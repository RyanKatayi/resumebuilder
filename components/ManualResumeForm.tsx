'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Resume } from '@/types/resume'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Save } from 'lucide-react'

interface ManualResumeFormProps {
  userId: string
}

export function ManualResumeForm({ userId }: ManualResumeFormProps) {
  const [saving, setSaving] = useState(false)
  const [resumeData, setResumeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    try {
      const generateId = () => Math.random().toString(36).substr(2, 9)
      
      // Parse the manual input into structured data
      const skills = resumeData.skills.split(',').map(skill => ({
        id: generateId(),
        name: skill.trim(),
        category: 'technical' as const,
        level: 'intermediate' as const
      })).filter(skill => skill.name)

      const resume: Partial<Resume> = {
        title: `${resumeData.firstName} ${resumeData.lastName} Resume`,
        personalInfo: {
          firstName: resumeData.firstName,
          lastName: resumeData.lastName,
          email: resumeData.email,
          phone: resumeData.phone,
          address: '',
          website: '',
          linkedin: '',
          github: ''
        },
        summary: resumeData.summary,
        experience: resumeData.experience ? [{
          id: generateId(),
          title: 'Your Position',
          company: 'Company Name',
          location: 'Location',
          startDate: '2020-01',
          endDate: '2024-01',
          current: false,
          description: resumeData.experience,
          achievements: []
        }] : [],
        education: resumeData.education ? [{
          id: generateId(),
          degree: resumeData.education,
          institution: 'University Name',
          location: 'Location',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: '',
          honors: undefined
        }] : [],
        skills: skills,
        projects: [],
        awards: [],
        template: 'professional',
        userId: userId,
      }

      const { data, error } = await supabase
        .from('resumes')
        .insert(resume)
        .select()
        .single()

      if (error) throw error

      router.push(`/resume/edit/${data.id}`)
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manual Resume Entry</CardTitle>
        <CardDescription>
          Enter your resume information manually. You can refine it later in the editor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={resumeData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={resumeData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={resumeData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={resumeData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={resumeData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            placeholder="Brief professional summary highlighting your key achievements and career objectives..."
            rows={4}
          />
        </div>

        {/* Experience */}
        <div>
          <Label htmlFor="experience">Work Experience</Label>
          <Textarea
            id="experience"
            value={resumeData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="Describe your work experience, roles, and responsibilities..."
            rows={4}
          />
        </div>

        {/* Education */}
        <div>
          <Label htmlFor="education">Education</Label>
          <Input
            id="education"
            value={resumeData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            placeholder="Bachelor of Science in Computer Science"
          />
        </div>

        {/* Skills */}
        <div>
          <Label htmlFor="skills">Skills</Label>
          <Input
            id="skills"
            value={resumeData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            placeholder="JavaScript, React, Node.js, Python, SQL (separate with commas)"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving || !resumeData.firstName || !resumeData.lastName}
          className="w-full"
        >
          {saving ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Resume
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}