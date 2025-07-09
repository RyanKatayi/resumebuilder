'use client'

import { useState } from 'react'
import { Skill } from '@/types/resume'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SkillsFormProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
}

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState<{
    name: string;
    category: 'technical' | 'soft' | 'language';
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>({
    name: '',
    category: 'technical',
    level: 'intermediate'
  })

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name.trim(),
        category: newSkill.category,
        level: newSkill.level
      }
      onChange([...skills, skill])
      setNewSkill({ name: '', category: 'technical', level: 'intermediate' })
    }
  }

  const handleDeleteSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id))
  }

  const skillsByCategory = {
    technical: skills.filter(skill => skill.category === 'technical'),
    soft: skills.filter(skill => skill.category === 'soft'),
    language: skills.filter(skill => skill.category === 'language')
  }

  const categories = [
    { value: 'technical', label: 'Technical Skills' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'language', label: 'Languages' }
  ]

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ]

  return (
    <div className="space-y-6">
      {/* Add New Skill */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name *</Label>
              <Input
                id="skillName"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="JavaScript, Leadership, Spanish..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as 'technical' | 'soft' | 'language' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <select
                id="level"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={handleAddSkill} disabled={!newSkill.name.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Skills by Category */}
      {categories.map(category => (
        <Card key={category.value}>
          <CardHeader>
            <CardTitle>{category.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {skillsByCategory[category.value as keyof typeof skillsByCategory].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {skillsByCategory[category.value as keyof typeof skillsByCategory].map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({skill.level})
                      </span>
                    </div>
                    <Button
                      onClick={() => handleDeleteSkill(skill.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No {category.label.toLowerCase()} added yet.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}