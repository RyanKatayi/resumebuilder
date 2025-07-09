import { Resume } from '@/types/resume'
import deepseek from './deepseek'

export async function parseResumeFile(file: File): Promise<Resume> {
  try {
    console.log('Parsing file type:', file.type)
    let content = ''
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      console.log('Parsing PDF file...')
      content = await parsePDF(file)
    } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('Parsing Word file...')
      content = await parseWord(file)
    } else if (file.type === 'text/plain') {
      console.log('Parsing text file...')
      content = await parseText(file)
    } else {
      throw new Error('Unsupported file type')
    }

    console.log('Extracted content length:', content.length)
    console.log('Content preview:', content.substring(0, 500))

    // Use AI to parse the content into structured data
    console.log('Starting AI parsing with DeepSeek...')
    const parsedResume = await parseWithAI(content)
    
    return parsedResume
  } catch (error) {
    console.error('Error parsing resume:', error)
    throw new Error('Failed to parse resume file')
  }
}

async function parsePDF(file: File): Promise<string> {
  // For PDF parsing, we'll use a simple approach
  // In a production app, you'd want to use a proper PDF parser like pdf-parse
  try {
    const arrayBuffer = await file.arrayBuffer()
    const text = await extractTextFromPDF(arrayBuffer)
    return text
  } catch {
    throw new Error('Failed to parse PDF file')
  }
}

async function parseWord(file: File): Promise<string> {
  // For Word documents, we'll use a simple approach
  // In a production app, you'd want to use a proper Word parser like mammoth
  try {
    const arrayBuffer = await file.arrayBuffer()
    const text = await extractTextFromWord(arrayBuffer)
    return text
  } catch {
    throw new Error('Failed to parse Word document')
  }
}

async function parseText(file: File): Promise<string> {
  try {
    const text = await file.text()
    return text
  } catch {
    throw new Error('Failed to read text file')
  }
}

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  // For now, we'll use a basic approach that works better with AI
  // In production, you'd use a proper PDF parser like pdf-parse
  const uint8Array = new Uint8Array(arrayBuffer)
  const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(uint8Array)
  
  // Extract text between parentheses and other common PDF text patterns
  const patterns = [
    /\(([^)]+)\)/g,  // Text in parentheses
    /\[([^\]]+)\]/g, // Text in brackets
    /\/([A-Za-z0-9\s]+)\s/g, // After forward slashes
    /BT\s*([^ET]*)\s*ET/g, // Between BT and ET
    /Tj\s*([^\/\s]+)/g, // After Tj commands
  ]
  
  let extractedText = ''
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => {
        // Clean up the match
        const cleaned = match
          .replace(/[()[\]\/]/g, ' ')
          .replace(/BT\s*|ET\s*/g, ' ')
          .replace(/Tj\s*/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        
        if (cleaned.length > 2 && /[a-zA-Z]/.test(cleaned)) {
          extractedText += cleaned + ' '
        }
      })
    }
  })
  
  // If no text extracted, return a message for AI to handle
  if (extractedText.trim().length < 50) {
    return `This is a PDF resume file. Please extract the following information:
    - Personal Information (Name, Email, Phone, Address)
    - Professional Summary
    - Work Experience
    - Education
    - Skills
    - Projects
    - Awards
    
    The original PDF content may be encoded, but this appears to be a professional resume document.`
  }
  
  return extractedText.trim()
}

async function extractTextFromWord(arrayBuffer: ArrayBuffer): Promise<string> {
  // Simple Word text extraction - in production, use a proper Word parser
  const uint8Array = new Uint8Array(arrayBuffer)
  const text = new TextDecoder().decode(uint8Array)
  
  // Very basic Word text extraction (this is a simplified approach)
  // In production, you'd use a library like mammoth
  // For now, return the raw text and let AI handle it
  return text
}

async function parseWithAI(content: string): Promise<Resume> {
  // Retry function for API overload
  const retryWithDelay = async <T>(fn: () => Promise<T>, maxRetries = 3, delay = 2000): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (error instanceof Error && (error.message?.includes('overloaded') || error.message?.includes('quota')) && i < maxRetries - 1) {
          console.log(`API issue (${error.message?.includes('quota') ? 'quota exceeded' : 'overloaded'}), retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2 // Exponential backoff
        } else {
          throw error
        }
      }
    }
    throw new Error('Max retries reached')
  }
  
  const prompt = `Parse this resume content and extract structured information. Return a JSON object with the following structure:

{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string"
  },
  "summary": "string",
  "experience": [
    {
      "id": "string",
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": false,
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "id": "string",
      "degree": "string",
      "institution": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string",
      "honors": ["string"]
    }
  ],
  "skills": [
    {
      "id": "string",
      "name": "string",
      "category": "technical" | "soft" | "language",
      "level": "beginner" | "intermediate" | "advanced" | "expert"
    }
  ],
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "startDate": "string",
      "endDate": "string",
      "url": "string"
    }
  ],
  "awards": [
    {
      "id": "string",
      "title": "string",
      "issuer": "string",
      "date": "string",
      "description": "string"
    }
  ]
}

Resume content:
${content}

Important: Return only valid JSON, no additional text or formatting.`

  try {
    const result = await retryWithDelay(() => deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional resume parser. Extract structured information from resume content and return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    }))
    
    const jsonStr = result.choices[0]?.message?.content || ''
    
    // Clean up the response to ensure it's valid JSON
    const cleanJsonStr = jsonStr.replace(/```json\s*|\s*```/g, '').trim()
    const parsedData = JSON.parse(cleanJsonStr)
    
    // Generate unique IDs for each item
    const generateId = () => Math.random().toString(36).substr(2, 9)
    
    const resume: Resume = {
      id: generateId(),
      userId: '', // Will be set by the calling function
      title: `${parsedData.personalInfo?.firstName || 'Unknown'} ${parsedData.personalInfo?.lastName || 'User'} Resume`,
      personalInfo: parsedData.personalInfo || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        linkedin: '',
        github: ''
      },
      summary: parsedData.summary || '',
      experience: (parsedData.experience || []).map((exp: Record<string, unknown>) => ({
        ...exp,
        id: generateId(),
        achievements: exp.achievements || []
      })),
      education: (parsedData.education || []).map((edu: Record<string, unknown>) => ({
        ...edu,
        id: generateId(),
        honors: edu.honors || []
      })),
      skills: (parsedData.skills || []).map((skill: Record<string, unknown>) => ({
        ...skill,
        id: generateId(),
        category: skill.category || 'technical',
        level: skill.level || 'intermediate'
      })),
      projects: (parsedData.projects || []).map((project: Record<string, unknown>) => ({
        ...project,
        id: generateId(),
        technologies: project.technologies || []
      })),
      awards: (parsedData.awards || []).map((award: Record<string, unknown>) => ({
        ...award,
        id: generateId()
      })),
      template: 'professional',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return resume
  } catch (error) {
    console.error('Error parsing with AI:', error)
    console.log('Falling back to basic parsing...')
    
    // Fallback: Create a basic resume structure that user can fill in
    const generateId = () => Math.random().toString(36).substr(2, 9)
    
    const fallbackResume: Resume = {
      id: generateId(),
      userId: '', // Will be set by the calling function
      title: 'Imported Resume',
      personalInfo: {
        firstName: 'Your',
        lastName: 'Name',
        email: 'your.email@example.com',
        phone: 'Your Phone',
        address: 'Your Address',
        website: '',
        linkedin: '',
        github: ''
      },
      summary: 'Please update this summary with your professional background and key achievements.',
      experience: [
        {
          id: generateId(),
          title: 'Your Job Title',
          company: 'Company Name',
          location: 'Location',
          startDate: '2020-01',
          endDate: '2024-01',
          current: false,
          description: 'Please describe your role and responsibilities.',
          achievements: [
            'Add your key achievement here',
            'Add another achievement here'
          ]
        }
      ],
      education: [
        {
          id: generateId(),
          degree: 'Your Degree',
          institution: 'Your University',
          location: 'Location',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: undefined,
          honors: undefined
        }
      ],
      skills: [
        {
          id: generateId(),
          name: 'Add your skills',
          category: 'technical',
          level: 'intermediate'
        }
      ],
      projects: [],
      awards: [],
      template: 'professional',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return fallbackResume
  }
}