'use client'

import { redirect } from 'next/navigation'
import { ResumeBuilder } from '@/components/ResumeBuilder'
import { useEffect, useState } from 'react'
import { Resume } from '@/types/resume'

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const [resumeId, setResumeId] = useState<string>('')
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResume = async () => {
      const { id } = await params
      setResumeId(id)
      
      // Fetch the resume data from localStorage
      const resumeData = localStorage.getItem(`resume_${id}`)
      
      if (!resumeData) {
        redirect('/dashboard')
      }
      
      try {
        const parsedResume = JSON.parse(resumeData)
        setResume(parsedResume)
      } catch (error) {
        console.error('Error parsing resume data:', error)
        redirect('/dashboard')
      }
      
      setLoading(false)
    }
    
    loadResume()
  }, [params])

  if (loading || !resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
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
          resumeId={resumeId}
          mode="edit"
        />
      </div>
    </div>
  )
}