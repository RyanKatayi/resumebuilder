'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { parseResumeFile } from '@/lib/resume-parser'
import { convertToProfessionalStyle } from '@/lib/ai'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

interface ResumeUploaderProps {
  userId: string
}

export function ResumeUploader({ userId }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'converting' | 'saving' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file')
        return
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus('uploading')
    setProgress(10)
    setError(null)

    try {
      // Step 1: Parse the resume file
      console.log('Starting to parse resume file:', file.name)
      setStatus('parsing')
      setProgress(30)
      const parsedData = await parseResumeFile(file)
      console.log('Parsed data:', parsedData)
      
      // Step 2: Convert to Professional style using AI
      console.log('Starting Professional style conversion...')
      setStatus('converting')
      setProgress(60)
      const professionalStyleResume = await convertToProfessionalStyle(parsedData)
      console.log('Professional style resume:', professionalStyleResume)
      
      // Step 3: Save to database
      console.log('Saving to database...')
      setStatus('saving')
      setProgress(80)
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          title: `${parsedData.personalInfo.firstName} ${parsedData.personalInfo.lastName} - Professional Style`,
          personal_info: professionalStyleResume.personalInfo,
          summary: professionalStyleResume.summary,
          experience: professionalStyleResume.experience,
          education: professionalStyleResume.education,
          skills: professionalStyleResume.skills,
          projects: professionalStyleResume.projects,
          awards: professionalStyleResume.awards,
          template: 'professional',
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error

      setStatus('success')
      setProgress(100)
      
      // Redirect to edit page after a brief delay
      setTimeout(() => {
        router.push(`/resume/edit/${data.id}`)
      }, 1500)

    } catch (error) {
      console.error('Error uploading resume:', error)
      setStatus('error')
      
      let errorMessage = 'Failed to upload and convert resume'
      if (error instanceof Error) {
        if (error.message.includes('overloaded')) {
          errorMessage = 'AI service is currently overloaded. Please try again in a few minutes.'
        } else if (error.message.includes('quota')) {
          errorMessage = 'AI service quota exceeded. The resume will be created with a basic template that you can customize.'
        } else if (error.message.includes('parse')) {
          errorMessage = 'Unable to parse your resume. Please try a different format or check if the file is readable.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading file...'
      case 'parsing':
        return 'Parsing resume content...'
      case 'converting':
        return 'Converting to Professional style...'
      case 'saving':
        return 'Saving to your account...'
      case 'success':
        return 'Resume converted successfully!'
      case 'error':
        return 'Error occurred during conversion'
      default:
        return ''
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'parsing':
      case 'converting':
      case 'saving':
        return <Loader2 className="h-5 w-5 animate-spin" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Your Resume
        </CardTitle>
        <CardDescription>
          Upload your existing resume in PDF, DOC, DOCX, or TXT format. We&apos;ll automatically format it professionally.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="resume-file">Resume File</Label>
          <div className="flex items-center gap-4">
            <Input
              id="resume-file"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              disabled={uploading}
              className="flex-1"
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusMessage()}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Resume converted successfully! Redirecting to editor...
            </span>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Converting to Professional Style...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload and Convert
            </>
          )}
        </Button>

        {/* Supported Formats */}
        <div className="text-sm text-gray-600 text-center">
          <p className="font-medium">Supported formats:</p>
          <p>PDF, DOC, DOCX, TXT (Max 10MB)</p>
        </div>
      </CardContent>
    </Card>
  )
}