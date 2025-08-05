'use client'

import { redirect } from 'next/navigation'
import { CVViewer } from '@/components/CVViewer'
import { Resume } from '@/types/resume'
import { useEffect, useState } from 'react'

export default function CVPage({ params }: { params: Promise<{ id: string }> }) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResume = async () => {
      const { id } = await params
      
      // Get the CV data from localStorage
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

  return <CVViewer resume={resume} />
}