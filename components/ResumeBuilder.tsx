'use client'

import { useState } from 'react'
import { Resume, PersonalInfo, Experience, Education, Skill, Project, Award } from '@/types/resume'
import { ProfessionalTemplate } from '@/components/templates/ProfessionalTemplate'
import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm'
import { ExperienceForm } from '@/components/forms/ExperienceForm'
import { EducationForm } from '@/components/forms/EducationForm'
import { SkillsForm } from '@/components/forms/SkillsForm'
import { ProjectsForm } from '@/components/forms/ProjectsForm'
import { AwardsForm } from '@/components/forms/AwardsForm'
import { generateSummary } from '@/lib/ai'
import { hasApiKey } from '@/lib/openai-client'
import { Eye, Download, Save, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ResumeBuilderProps {
  resumeId?: string
  initialData?: Resume
  mode?: 'create' | 'edit'
}

export function ResumeBuilder({ resumeId, initialData, mode = 'create' }: ResumeBuilderProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [resume, setResume] = useState<Resume>(initialData || {
    id: resumeId || crypto.randomUUID(),
    userId: 'local-user',
    title: 'My Resume',
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    awards: [],
    template: 'professional',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [showPreview, setShowPreview] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleGenerateSummary = async () => {
    if (!hasApiKey()) {
      addToast({
        title: 'API Key Required',
        description: 'Please add your API key in settings to use AI features.',
        variant: 'destructive'
      })
      return
    }

    if (!resume.personalInfo.firstName || resume.experience.length === 0) {
      addToast({
        title: 'Missing information',
        description: 'Please fill in your personal information and add at least one work experience before generating a summary.',
        variant: 'destructive'
      })
      return
    }

    setGenerating(true)
    try {
      const summary = await generateSummary(
        resume.personalInfo,
        resume.experience,
        resume.skills
      )
      setResume(prev => ({ ...prev, summary }))
      addToast({
        title: 'Summary generated',
        description: 'Your professional summary has been generated successfully.',
        variant: 'success'
      })
    } catch (error) {
      console.error('Error generating summary:', error)
      addToast({
        title: 'Generation failed',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const resumeData = {
        id: resume.id,
        userId: resume.userId,
        title: resume.title,
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        awards: resume.awards,
        template: resume.template,
        createdAt: resume.createdAt,
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage
      localStorage.setItem(`resume_${resumeData.id}`, JSON.stringify(resumeData))
      
      // Update list of resume IDs
      const resumeIds = JSON.parse(localStorage.getItem('resumeIds') || '[]')
      if (!resumeIds.includes(resumeData.id)) {
        resumeIds.push(resumeData.id)
        localStorage.setItem('resumeIds', JSON.stringify(resumeIds))
      }
      
      addToast({
        title: mode === 'edit' ? 'Resume updated' : 'Resume created',
        description: 'Your resume has been saved locally.',
        variant: 'success'
      })
      
      if (mode === 'create') {
        router.push(`/edit/${resumeData.id}`)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      addToast({
        title: 'Save failed',
        description: 'Failed to save resume. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const element = document.getElementById('resume-preview')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${resume.personalInfo.firstName}-${resume.personalInfo.lastName}-resume.pdf`)
      addToast({
        title: 'PDF exported',
        description: 'Your resume has been exported successfully.',
        variant: 'success'
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      addToast({
        title: 'Export failed',
        description: 'Failed to export PDF. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setExporting(false)
    }
  }

  const updatePersonalInfo = (personalInfo: PersonalInfo) => {
    setResume(prev => ({ ...prev, personalInfo }))
  }

  const updateExperience = (experience: Experience[]) => {
    setResume(prev => ({ ...prev, experience }))
  }

  const updateEducation = (education: Education[]) => {
    setResume(prev => ({ ...prev, education }))
  }

  const updateSkills = (skills: Skill[]) => {
    setResume(prev => ({ ...prev, skills }))
  }

  const updateProjects = (projects: Project[]) => {
    setResume(prev => ({ ...prev, projects }))
  }

  const updateAwards = (awards: Award[]) => {
    setResume(prev => ({ ...prev, awards }))
  }

  const updateSummary = (summary: string) => {
    setResume(prev => ({ ...prev, summary }))
  }


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel - Form */}
      <div className={`${showPreview ? 'hidden lg:block' : 'block'} lg:w-1/2`}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Resume Builder</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="outline" size="sm" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Professional Summary</CardTitle>
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={generating}
                    size="sm"
                    variant="outline"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {generating ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resume.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  placeholder="Write a brief professional summary or use AI to generate one..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs sm:text-sm">Experience</TabsTrigger>
                <TabsTrigger value="education" className="text-xs sm:text-sm">Education</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
                <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
                <TabsTrigger value="awards" className="text-xs sm:text-sm">Awards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-6">
                <PersonalInfoForm personalInfo={resume.personalInfo} onChange={updatePersonalInfo} />
              </TabsContent>
              
              <TabsContent value="experience" className="mt-6">
                <ExperienceForm experience={resume.experience} onChange={updateExperience} />
              </TabsContent>
              
              <TabsContent value="education" className="mt-6">
                <EducationForm education={resume.education} onChange={updateEducation} />
              </TabsContent>
              
              <TabsContent value="skills" className="mt-6">
                <SkillsForm skills={resume.skills} onChange={updateSkills} />
              </TabsContent>
              
              <TabsContent value="projects" className="mt-6">
                <ProjectsForm projects={resume.projects} onChange={updateProjects} />
              </TabsContent>
              
              <TabsContent value="awards" className="mt-6">
                <AwardsForm awards={resume.awards} onChange={updateAwards} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Preview */}
      <div className={`${showPreview ? 'block' : 'hidden lg:block'} lg:w-1/2`}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                >
                  Back to Edit
                </Button>
                <Button onClick={handleExport} size="sm" disabled={exporting}>
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <div id="resume-preview" className="transform scale-50 sm:scale-75 origin-top-left" style={{ width: '200%' }}>
                  <ProfessionalTemplate resume={resume} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResumeBuilder