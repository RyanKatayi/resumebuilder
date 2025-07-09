import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ResumeBuilder } from '@/components/ResumeBuilder'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch the resume data
  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !resume) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Edit Resume: {resume.title}
          </h1>
          <p className="text-gray-600 mt-2">
            Update your resume details and see changes in real-time
          </p>
        </div>
        
        <ResumeBuilder 
          initialData={resume}
          userId={user.id}
          resumeId={id}
          mode="edit"
        />
      </div>
    </div>
  )
}