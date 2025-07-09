'use client'

import { useState } from 'react'
import { Project } from '@/types/resume'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectsFormProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

export function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentProject, setCurrentProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    technologies: [],
    url: '',
    github: '',
    startDate: '',
    endDate: ''
  })

  const handleAdd = () => {
    setCurrentProject({
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: ''
    })
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setCurrentProject(projects[index])
    setEditingIndex(index)
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      const newProjects = [...projects]
      newProjects[editingIndex] = currentProject
      onChange(newProjects)
    } else {
      onChange([...projects, { ...currentProject, id: Date.now().toString() }])
    }
    resetForm()
  }

  const handleDelete = (index: number) => {
    onChange(projects.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setCurrentProject({
      id: '',
      title: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: ''
    })
    setEditingIndex(null)
  }

  const handleTechnologiesChange = (value: string) => {
    const technologies = value.split(',').map(tech => tech.trim()).filter(Boolean)
    setCurrentProject({
      ...currentProject,
      technologies
    })
  }

  return (
    <div className="space-y-4">
      {/* Existing Projects List */}
      {projects.map((project, index) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {project.startDate} - {project.endDate || 'Present'}
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
            <p className="text-sm mb-2">{project.description}</p>
            <p className="text-sm mb-2">
              <strong>Technologies:</strong> {project.technologies.join(', ')}
            </p>
            {(project.url || project.github) && (
              <div className="text-sm space-y-1">
                {project.url && (
                  <p><strong>URL:</strong> {project.url}</p>
                )}
                {project.github && (
                  <p><strong>GitHub:</strong> {project.github}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add/Edit Form */}
      {(editingIndex !== null || currentProject.title || currentProject.description) ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={currentProject.title}
                onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                placeholder="E-commerce Website"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={currentProject.description}
                onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                placeholder="Brief description of the project and your role..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies Used *</Label>
              <Input
                id="technologies"
                value={currentProject.technologies.join(', ')}
                onChange={(e) => handleTechnologiesChange(e.target.value)}
                placeholder="React, Node.js, MongoDB, AWS (separate with commas)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={currentProject.startDate}
                  onChange={(e) => setCurrentProject({...currentProject, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={currentProject.endDate || ''}
                  onChange={(e) => setCurrentProject({...currentProject, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">Project URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={currentProject.url || ''}
                  onChange={(e) => setCurrentProject({...currentProject, url: e.target.value})}
                  placeholder="https://myproject.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Repository</Label>
                <Input
                  id="github"
                  type="url"
                  value={currentProject.github || ''}
                  onChange={(e) => setCurrentProject({...currentProject, github: e.target.value})}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingIndex !== null ? 'Update' : 'Add'} Project
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
          Add Project
        </Button>
      )}
    </div>
  )
}