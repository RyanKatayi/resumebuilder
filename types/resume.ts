export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  website?: string
  linkedin?: string
  github?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
  relevant_coursework?: string[]
}

export interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft' | 'language'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate: string
  endDate?: string
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Resume {
  id: string
  userId: string
  title: string
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  awards: Award[]
  template: 'professional' | 'modern' | 'classic'
  createdAt: string
  updatedAt: string
}