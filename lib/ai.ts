import { Experience, PersonalInfo, Skill, Resume } from '@/types/resume'
import deepseek from './deepseek'

export interface AIGenerationOptions {
  jobDescription?: string
  industry?: string
  experience_level?: 'entry' | 'mid' | 'senior'
  target_role?: string
}

export async function generateSummary(
  personalInfo: PersonalInfo,
  experience: Experience[],
  skills: Skill[],
  options: AIGenerationOptions = {}
): Promise<string> {
  try {
    const skillsText = skills.map(s => s.name).join(', ')
    const experienceText = experience.map(exp => `${exp.title} at ${exp.company}`).join(', ')
    
    const prompt = `Write a professional resume summary for ${personalInfo.firstName} ${personalInfo.lastName}. 
    
Background:
- Skills: ${skillsText}
- Experience: ${experienceText}
- Experience Level: ${options.experience_level || 'professional'}
- Target Role: ${options.target_role || 'related position'}
- Industry: ${options.industry || 'general'}
    
${options.jobDescription ? `Job Description: ${options.jobDescription}` : ''}
    
Requirements:
- Write in third person
- 3-4 sentences maximum
- Professional tone
- Highlight key achievements and skills
- Make it professional and polished
- No generic phrases
- Quantify where possible`

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer specializing in executive-level resumes. Write compelling, specific, and results-oriented summaries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })
    
    return response.choices[0]?.message?.content || 'Unable to generate summary. Please try again.'
  } catch (error) {
    console.error('Error generating summary:', error)
    // Fallback to placeholder
    return `Experienced professional with expertise in ${skills.filter(s => s.category === 'technical').map(s => s.name).slice(0, 3).join(', ')}. Proven track record of delivering results in ${experience[0]?.company || 'various organizations'}. Seeking to leverage expertise in ${options.target_role || 'target role'} to drive innovation and growth.`
  }
}

export async function enhanceExperience(
  experience: Experience
): Promise<Experience> {
  try {
    const prompt = `Enhance this work experience entry for a professional resume:
    
Position: ${experience.title}
Company: ${experience.company}
Current Description: ${experience.description}
Current Achievements: ${experience.achievements.join(', ')}
    
Please:
1. Improve the description to be more impactful and specific
2. Add 2-3 quantified achievements that are realistic for this role
3. Use action verbs and professional language
4. Make it professional and impactful
5. Focus on results and impact
    
Return the response in this JSON format:
{
  "description": "enhanced description",
  "achievements": ["achievement 1", "achievement 2", "achievement 3"]
}`

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer. Enhance work experience entries to be more impactful and quantified. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    })

    const enhanced = JSON.parse(response.choices[0]?.message?.content || '{}')
    
    return {
      ...experience,
      description: enhanced.description || experience.description,
      achievements: enhanced.achievements || experience.achievements
    }
  } catch (error) {
    console.error('Error enhancing experience:', error)
    // Fallback to original with minor enhancement
    return {
      ...experience,
      description: `${experience.description} Demonstrated expertise in cross-functional collaboration and strategic problem-solving.`,
      achievements: [
        ...experience.achievements,
        "Improved operational efficiency by implementing streamlined processes",
        "Collaborated with cross-functional teams to deliver key initiatives on time"
      ]
    }
  }
}

export async function generateSkillSuggestions(
  currentSkills: Skill[]
): Promise<Skill[]> {
  // This would integrate with your preferred AI service
  // For now, returning sample suggestions
  const suggestions: Skill[] = [
    { id: 'ai-1', name: 'Project Management', category: 'soft', level: 'intermediate' },
    { id: 'ai-2', name: 'Data Analysis', category: 'technical', level: 'intermediate' },
    { id: 'ai-3', name: 'Strategic Planning', category: 'soft', level: 'intermediate' }
  ]
  
  return suggestions.filter(skill => 
    !currentSkills.some(existing => existing.name.toLowerCase() === skill.name.toLowerCase())
  )
}

export async function optimizeForATS(): Promise<string[]> {
  // This would analyze the resume against the job description for ATS optimization
  // For now, returning sample suggestions
  return [
    'Add more industry-specific keywords',
    'Use standard section headers',
    'Include relevant technical skills',
    'Quantify achievements with numbers',
    'Use action verbs consistently'
  ]
}

export async function convertToProfessionalStyle(resume: Resume): Promise<Resume> {
  // This would convert the resume to professional format
  const retryWithDelay = async <T>(fn: () => Promise<T>, maxRetries = 3, delay = 2000): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (error instanceof Error && error.message?.includes('overloaded') && i < maxRetries - 1) {
          console.log(`API overloaded, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2 // Exponential backoff
        } else {
          throw error
        }
      }
    }
    throw new Error('Max retries reached')
  }

  try {
    const prompt = `Convert this resume to professional format. Focus on:
1. Professional summary that highlights key achievements
2. Experience entries with quantified achievements
3. Clean, professional formatting
4. Action verbs and impact statements
5. Relevant skills and education

Current resume:
${JSON.stringify(resume, null, 2)}

Return the enhanced resume in the same JSON structure.`

    const response = await retryWithDelay(() => deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer specializing in executive-level resumes. Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    }))

    const enhanced = JSON.parse(response.choices[0]?.message?.content || '{}')
    return {
      ...resume,
      ...enhanced,
      id: resume.id, // Preserve original ID
      createdAt: resume.createdAt,
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error converting to professional style:', error)
    // Return original resume if conversion fails
    return resume
  }
}