'use client'

import { useState } from 'react'
import { Award } from '@/types/resume'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AwardsFormProps {
  awards: Award[]
  onChange: (awards: Award[]) => void
}

export function AwardsForm({ awards, onChange }: AwardsFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentAward, setCurrentAward] = useState<Award>({
    id: '',
    title: '',
    issuer: '',
    date: '',
    description: ''
  })

  const handleAdd = () => {
    setCurrentAward({
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: ''
    })
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setCurrentAward(awards[index])
    setEditingIndex(index)
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      const newAwards = [...awards]
      newAwards[editingIndex] = currentAward
      onChange(newAwards)
    } else {
      onChange([...awards, { ...currentAward, id: Date.now().toString() }])
    }
    resetForm()
  }

  const handleDelete = (index: number) => {
    onChange(awards.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setCurrentAward({
      id: '',
      title: '',
      issuer: '',
      date: '',
      description: ''
    })
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Existing Awards List */}
      {awards.map((award, index) => (
        <Card key={award.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{award.title}</CardTitle>
                <p className="text-muted-foreground">{award.issuer}</p>
                <p className="text-sm text-muted-foreground">{award.date}</p>
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
          {award.description && (
            <CardContent>
              <p className="text-sm">{award.description}</p>
            </CardContent>
          )}
        </Card>
      ))}

      {/* Add/Edit Form */}
      {(editingIndex !== null || currentAward.title || currentAward.issuer) ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Edit Award' : 'Add New Award'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Award Title *</Label>
              <Input
                id="title"
                value={currentAward.title}
                onChange={(e) => setCurrentAward({...currentAward, title: e.target.value})}
                placeholder="Dean's List, Employee of the Month, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization *</Label>
                <Input
                  id="issuer"
                  value={currentAward.issuer}
                  onChange={(e) => setCurrentAward({...currentAward, issuer: e.target.value})}
                  placeholder="University, Company, Professional Organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="month"
                  value={currentAward.date}
                  onChange={(e) => setCurrentAward({...currentAward, date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentAward.description || ''}
                onChange={(e) => setCurrentAward({...currentAward, description: e.target.value})}
                placeholder="Brief description of the award and why it was received..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingIndex !== null ? 'Update' : 'Add'} Award
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
          Add Award
        </Button>
      )}
    </div>
  )
}