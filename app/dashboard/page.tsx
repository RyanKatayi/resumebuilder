'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Resume } from '@/types/resume'
import { ApiKeySettings } from '@/components/ApiKeySettings'

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = () => {
    const resumeIds = JSON.parse(localStorage.getItem('resumeIds') || '[]')
    const loadedResumes: Resume[] = []
    
    resumeIds.forEach((id: string) => {
      const resumeData = localStorage.getItem(`resume_${id}`)
      if (resumeData) {
        try {
          const resume = JSON.parse(resumeData)
          loadedResumes.push(resume)
        } catch (error) {
          console.error(`Error parsing resume ${id}:`, error)
        }
      }
    })
    
    // Sort by updated date
    loadedResumes.sort((a, b) => 
      new Date(b.updatedAt || b.createdAt).getTime() - 
      new Date(a.updatedAt || a.createdAt).getTime()
    )
    
    setResumes(loadedResumes)
    setLoading(false)
  }

  const handleDelete = (resumeId: string, resumeTitle: string) => {
    if (confirm(`Are you sure you want to delete "${resumeTitle}"?`)) {
      // Remove from localStorage
      localStorage.removeItem(`resume_${resumeId}`)
      
      // Update resume IDs list
      const resumeIds = JSON.parse(localStorage.getItem('resumeIds') || '[]')
      const updatedIds = resumeIds.filter((id: string) => id !== resumeId)
      localStorage.setItem('resumeIds', JSON.stringify(updatedIds))
      
      // Reload resumes
      loadResumes()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Resumes</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              All resumes are saved locally in your browser
            </p>
          </div>
          <div className="flex gap-3">
            <ApiKeySettings />
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-105">
              <Link href="/upload" aria-label="Upload a new CV to create a professional resume">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Upload CV
              </Link>
            </Button>
          </div>
        </div>

        {/* Resumes Grid */}
        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm bg-white rounded-xl overflow-hidden hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{resume.title}</CardTitle>
                  <CardDescription className="text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {resume.template} template
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200">
                      <Link href={`/cv/${resume.id}`} aria-label={`View ${resume.title} resume`}>
                        View CV
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1 border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                        <Link href={`/edit/${resume.id}`} aria-label={`Edit ${resume.title} resume`}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        onClick={() => handleDelete(resume.id, resume.title)}
                        size="sm" 
                        variant="outline"
                        className="border-red-300 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${resume.title} resume`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-white border-0 shadow-sm rounded-2xl">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first professional resume with our AI-powered builder.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-105">
                <Link href="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}