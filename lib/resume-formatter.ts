import { Resume, Education, Experience, Skill, Project, Award } from '@/types/resume'
import deepseek from './deepseek'

// Fallback function to create a resume from raw text when AI fails
// This function performs a best-effort parse to avoid data loss.
function createFallbackResume(extractedText: string): Resume {
  console.warn('AI formatting failed. Creating fallback resume from raw text.')

  const generateId = () => Math.random().toString(36).substr(2, 9)
  const lines = extractedText.split('\n').filter(line => line.trim() !== '')
  
  const resume: Resume = {
    id: generateId(),
    userId: '',
    title: 'New Resume - Needs Review',
    template: 'professional',
    personalInfo: { firstName: 'Your', lastName: 'Name', email: '', phone: '', address: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    awards: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Very basic parsing to preserve information
  // We'll put the whole text into the summary as a last resort,
  // so no data is ever lost.
  resume.summary = extractedText
  
  // Attempt to extract basic info
  if (lines.length > 0) {
    const nameLine = lines[0]
    const nameParts = nameLine.split(' ')
    resume.personalInfo.firstName = nameParts[0] || 'Your'
    resume.personalInfo.lastName = nameParts.slice(1).join(' ') || 'Name'
    resume.title = `${nameLine} - Professional Style`
  }
  
  const emailMatch = extractedText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
  if (emailMatch) resume.personalInfo.email = emailMatch[0]
  
  const phoneMatch = extractedText.match(/(\+?[\d\s\-\(\)]{10,})/i)
  if (phoneMatch) resume.personalInfo.phone = phoneMatch[0]

  // This is a simple fallback, the main goal is to not lose the user's data.
  // The user can then edit the resume in the builder.
  // We add one placeholder experience so the form is not empty.
  resume.experience.push({
    id: generateId(),
    title: 'Please review and edit',
    company: 'Your information has been saved in the summary',
    location: 'And other sections if possible',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    current: true,
    description: `We couldn't fully categorize your resume automatically, but all the text from your CV has been placed in the 'Professional Summary' section. Please use the editor to move the text into the correct sections like Experience, Education, etc.`,
    achievements: []
  })

  console.log('Fallback resume created:', resume)
  return resume
}


export async function formatToProfessionalStyle(extractedText: string): Promise<Resume> {
  if (!extractedText || extractedText.trim().length < 20) {
    console.warn("Extracted text is too short, using fallback.")
    return createFallbackResume(extractedText)
  }

  try {
    console.log('Starting professional style formatting with DeepSeek...')
    
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert resume formatter specializing in professional resume guidelines. Your task is to convert the user's CV text into a structured JSON format.

CRITICAL INSTRUCTIONS:
1.  **DO NOT OMIT OR SUMMARIZE:** You must include ALL information from the original CV. Every job, educational entry, skill, project, and award must be present in the output.
2.  **ACCURATE EXTRACTION:** Extract the data as precisely as possible. Do not invent or hallucinate information.
3.  **RETURN JSON ONLY:** Your entire output must be a single, valid JSON object matching the structure provided. Do not include any text, explanations, or markdown before or after the JSON.

Return JSON in this exact structure:`
        },
        {
          role: "user",
          content: `Here is the resume JSON structure to follow:
{
  "personalInfo": {
    "firstName": "First Name",
    "lastName": "Last Name", 
    "email": "email@example.com",
    "phone": "(555) 555-5555",
    "address": "City, State",
    "website": "optional",
    "linkedin": "optional",
    "github": "optional"
  },
  "summary": "Professional 3-4 sentence summary. If no summary exists, create one from the experience.",
  "education": [
    {
      "degree": "Bachelor of Arts in [Field]",
      "institution": "University Name",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "3.7" (only if above 3.5),
      "honors": ["Dean's List", "Cum Laude"] (if applicable)
    }
  ],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "Brief role description. If achievements are listed, use them instead.",
      "achievements": [
        "Increased X by Y% through implementation of Z",
        "Managed team of X people and achieved Y% improvement"
      ]
    }
  ],
  "skills": [
    { "name": "Technical Skills", "category": "technical", "level": "advanced" },
    { "name": "Language Skills", "category": "language", "level": "intermediate" }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description with technologies and impact",
      "technologies": ["Tech1", "Tech2"],
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ],
  "awards": [
    {
      "title": "Award Name",
      "issuer": "Organization",
      "date": "YYYY-MM",
      "description": "Brief description of award"
    }
  ]
}

CV Content to Convert:
${extractedText.substring(0, 4000)}` // Limit input to avoid token limits
        }
      ],
      max_tokens: 2000,
      temperature: 0.1,
      response_format: { type: "json_object" }
    })

    const jsonResponse = response.choices[0]?.message?.content
    if (!jsonResponse) {
      throw new Error("AI returned an empty response.")
    }

    console.log('AI response received.')
    const parsedJson = JSON.parse(jsonResponse)
    
    // Convert parsed JSON to our Resume type
    const generateId = () => Math.random().toString(36).substr(2, 9)
    const resume: Resume = {
      id: generateId(),
      userId: '',
      title: `${parsedJson.personalInfo?.firstName || 'New'} ${parsedJson.personalInfo?.lastName || 'Resume'} - Professional Style`,
      personalInfo: parsedJson.personalInfo || {},
      summary: parsedJson.summary || '',
      education: (parsedJson.education || []).map((edu: Omit<Education, 'id'>) => ({ ...edu, id: generateId() })),
      experience: (parsedJson.experience || []).map((exp: Omit<Experience, 'id'>) => ({ ...exp, id: generateId() })),
      skills: (parsedJson.skills || []).map((skill: Omit<Skill, 'id'>) => ({ ...skill, id: generateId() })),
      projects: (parsedJson.projects || []).map((proj: Omit<Project, 'id'>) => ({ ...proj, id: generateId() })),
      awards: (parsedJson.awards || []).map((award: Omit<Award, 'id'>) => ({ ...award, id: generateId() })),
      template: 'professional',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('Successfully formatted to professional style with AI.')
    return resume
    
  } catch (error) {
    console.error('Error in formatToProfessionalStyle:', error)
    return createFallbackResume(extractedText)
  }
}