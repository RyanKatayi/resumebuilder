import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CVViewer } from '@/components/CVViewer'
import { Resume } from '@/types/resume'

export default async function CVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get the CV data
  const { data: cv, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !cv) {
    redirect('/dashboard')
  }

  // Transform database resume to Resume type
  const resumeData: Resume = {
    id: cv.id,
    userId: cv.user_id,
    title: cv.title,
    personalInfo: cv.personal_info,
    summary: cv.summary,
    experience: cv.experience,
    education: cv.education,
    skills: cv.skills,
    projects: cv.projects,
    awards: cv.awards,
    template: cv.template,
    createdAt: cv.created_at,
    updatedAt: cv.updated_at,
  }

  return <CVViewer resume={resumeData} />
}