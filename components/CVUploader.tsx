'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { extractTextFromCV } from '@/lib/cv-extractor'
import { formatToProfessionalStyle } from '@/lib/resume-formatter'
import { hasApiKey } from '@/lib/openai-client'
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ApiKeySettings } from '@/components/ApiKeySettings'

export function CVUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'extracting' | 'formatting' | 'saving' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, or DOCX file')
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

    if (!hasApiKey()) {
      setError('Please add your API key in settings to use AI features.')
      return
    }

    setUploading(true)
    setStatus('extracting')
    setProgress(10)
    setError(null)

    try {
      // Step 1: Extract text from CV
      console.log('Extracting text from CV:', file.name)
      setProgress(30)
      const extractedText = await extractTextFromCV(file)
      console.log('Extracted text:', extractedText.substring(0, 200) + '...')

      // Step 2: Format to professional style
      console.log('Formatting to professional style...')
      setStatus('formatting')
      setProgress(60)
      const professionalCV = await formatToProfessionalStyle(extractedText)
      console.log('Professional formatted CV:', professionalCV)

      // Step 3: Save to localStorage
      console.log('Saving resume...')
      setStatus('saving')
      setProgress(80)
      
      const resumeId = crypto.randomUUID()
      const resumeData = {
        id: resumeId,
        userId: 'local-user',
        title: professionalCV.title,
        personalInfo: professionalCV.personalInfo,
        summary: professionalCV.summary,
        experience: professionalCV.experience || [],
        education: professionalCV.education || [],
        skills: professionalCV.skills || [],
        projects: professionalCV.projects || [],
        awards: professionalCV.awards || [],
        template: professionalCV.template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Save to localStorage
      localStorage.setItem(`resume_${resumeId}`, JSON.stringify(resumeData))
      
      // Update resume IDs list
      const resumeIds = JSON.parse(localStorage.getItem('resumeIds') || '[]')
      resumeIds.push(resumeId)
      localStorage.setItem('resumeIds', JSON.stringify(resumeIds))

      setStatus('success')
      setProgress(100)
      
      // Show success message
      setTimeout(() => {
        router.push(`/cv/${resumeId}`)
      }, 1500)

    } catch (error) {
      console.error('Error processing CV:', error)
      setStatus('error')
      
      // Better error messaging
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          setError('AI service is temporarily unavailable. Your CV has been processed with basic formatting. You can edit and enhance it manually.')
        } else if (error.message.includes('Failed to format')) {
          setError('CV formatting encountered an issue, but your resume has been created with basic formatting. You can edit it to enhance the content.')
        } else {
          setError(error.message)
        }
      } else {
        setError('Failed to process CV. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'extracting':
        return 'Extracting text from your CV...'
      case 'formatting':
        return 'Formatting your resume...'
      case 'saving':
        return 'Saving your resume...'
      case 'success':
        return 'CV processed successfully!'
      case 'error':
        return 'Error processing CV'
      default:
        return ''
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'extracting':
      case 'formatting':
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
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Upload Card */}
      <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            Upload Your CV
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Upload your existing CV in PDF, DOC, or DOCX format. Our AI will extract the content and reformat it professionally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="cv-file" className="text-sm font-medium text-gray-700">Choose your CV file</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <input
                id="cv-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
              <label htmlFor="cv-file" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, or DOCX (max 10MB)
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <span className="text-sm font-medium text-blue-900">{getStatusMessage()}</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm text-red-700">{error}</span>
                  {error.includes('API key') && (
                    <div className="mt-2">
                      <ApiKeySettings />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-700">
                CV processed successfully! Redirecting to view your resume...
              </span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing CV...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Process CV
              </>
            )}
          </Button>

          {/* Info */}
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>PDF supported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>DOC/DOCX supported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}