'use client'

import { useState } from 'react'
import { Education } from '@/types/resume'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EducationFormProps {
  education: Education[]
  onChange: (education: Education[]) => void
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentEducation, setCurrentEducation] = useState<Education>({
    id: '',
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    honors: '',
    relevant_coursework: []
  })

  const handleAdd = () => {
    setCurrentEducation({
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      relevant_coursework: []
    })
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setCurrentEducation(education[index])
    setEditingIndex(index)
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      const newEducation = [...education]
      newEducation[editingIndex] = currentEducation
      onChange(newEducation)
    } else {
      onChange([...education, { ...currentEducation, id: Date.now().toString() }])
    }
    resetForm()
  }

  const handleDelete = (index: number) => {
    onChange(education.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setCurrentEducation({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      relevant_coursework: []
    })
    setEditingIndex(null)
  }

  const addCoursework = () => {
    setCurrentEducation({
      ...currentEducation,
      relevant_coursework: [...(currentEducation.relevant_coursework || []), '']
    })
  }

  const updateCoursework = (index: number, value: string) => {
    const newCoursework = [...(currentEducation.relevant_coursework || [])]
    newCoursework[index] = value
    setCurrentEducation({
      ...currentEducation,
      relevant_coursework: newCoursework
    })
  }

  const removeCoursework = (index: number) => {
    setCurrentEducation({
      ...currentEducation,
      relevant_coursework: currentEducation.relevant_coursework?.filter((_, i) => i !== index) || []
    })
  }

  return (
    <div className="space-y-4">
      {/* Existing Education List */}
      {education.map((edu, index) => (
        <Card key={edu.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{edu.degree}</CardTitle>
                <p className="text-muted-foreground">{edu.institution} • {edu.location}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(index)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(index)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            {edu.honors && <p className="text-sm">{edu.honors}</p>}
            {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
              <p className="text-sm">
                <strong>Relevant Coursework:</strong> {edu.relevant_coursework.join(', ')}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      {(editingIndex !== null || currentEducation.degree || currentEducation.institution) ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Edit Education' : 'Add New Education'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  value={currentEducation.degree}
                  onChange={(e) => setCurrentEducation({...currentEducation, degree: e.target.value})}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={currentEducation.institution}
                  onChange={(e) => setCurrentEducation({...currentEducation, institution: e.target.value})}
                  placeholder="University Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={currentEducation.location}
                  onChange={(e) => setCurrentEducation({...currentEducation, location: e.target.value})}
                  placeholder="Cambridge, MA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={currentEducation.startDate}
                  onChange={(e) => setCurrentEducation({...currentEducation, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={currentEducation.endDate}
                  onChange={(e) => setCurrentEducation({...currentEducation, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  value={currentEducation.gpa || ''}
                  onChange={(e) => setCurrentEducation({...currentEducation, gpa: e.target.value})}
                  placeholder="3.8/4.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honors">Honors</Label>
                <Input
                  id="honors"
                  value={currentEducation.honors || ''}
                  onChange={(e) => setCurrentEducation({...currentEducation, honors: e.target.value})}
                  placeholder="Magna Cum Laude"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Relevant Coursework</Label>
                <Button
                  onClick={addCoursework}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>
              {currentEducation.relevant_coursework?.map((course, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={course}
                    onChange={(e) => updateCoursework(index, e.target.value)}
                    placeholder="Data Structures and Algorithms"
                  />
                  <Button
                    onClick={() => removeCoursework(index)}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingIndex !== null ? 'Update' : 'Add'} Education
              </Button>
              <Button onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={handleAdd}
          variant="outline"
          className="w-full h-16 border-dashed"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Education
        </Button>
      )}
    </div>
  )
}