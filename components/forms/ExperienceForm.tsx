'use client'

import { useState } from 'react'
import { Experience } from '@/types/resume'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface ExperienceFormProps {
  experience: Experience[]
  onChange: (experience: Experience[]) => void
}

export function ExperienceForm({ experience, onChange }: ExperienceFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  })

  const handleAdd = () => {
    setCurrentExperience({
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    })
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setCurrentExperience(experience[index])
    setEditingIndex(index)
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      const newExperience = [...experience]
      newExperience[editingIndex] = currentExperience
      onChange(newExperience)
    } else {
      onChange([...experience, { ...currentExperience, id: Date.now().toString() }])
    }
    setCurrentExperience({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    })
    setEditingIndex(null)
  }

  const handleDelete = (index: number) => {
    onChange(experience.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    setCurrentExperience({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    })
    setEditingIndex(null)
  }

  const addAchievement = () => {
    setCurrentExperience({
      ...currentExperience,
      achievements: [...currentExperience.achievements, '']
    })
  }

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...currentExperience.achievements]
    newAchievements[index] = value
    setCurrentExperience({
      ...currentExperience,
      achievements: newAchievements
    })
  }

  const removeAchievement = (index: number) => {
    setCurrentExperience({
      ...currentExperience,
      achievements: currentExperience.achievements.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-4">
      {/* Existing Experience List */}
      {experience.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{exp.title}</h3>
              <p className="text-gray-600">{exp.company} • {exp.location}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {exp.description && (
            <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
          )}
          {exp.achievements.length > 0 && (
            <ul className="text-sm text-gray-700 space-y-1">
              {exp.achievements.map((achievement, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Add New Experience */}
      {(editingIndex !== null || currentExperience.title || currentExperience.company) ? (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingIndex !== null ? 'Edit Experience' : 'Add New Experience'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={currentExperience.title}
                onChange={(e) => setCurrentExperience({...currentExperience, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={currentExperience.company}
                onChange={(e) => setCurrentExperience({...currentExperience, company: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Tech Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={currentExperience.location}
                onChange={(e) => setCurrentExperience({...currentExperience, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                value={currentExperience.startDate}
                onChange={(e) => setCurrentExperience({...currentExperience, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="space-y-2">
                <input
                  type="month"
                  value={currentExperience.endDate}
                  onChange={(e) => setCurrentExperience({...currentExperience, endDate: e.target.value})}
                  disabled={currentExperience.current}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentExperience.current}
                    onChange={(e) => setCurrentExperience({...currentExperience, current: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Current position</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={currentExperience.description}
              onChange={(e) => setCurrentExperience({...currentExperience, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Brief description of your role and responsibilities..."
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Key Achievements
              </label>
              <button
                onClick={addAchievement}
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                + Add Achievement
              </button>
            </div>
            {currentExperience.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Increased sales by 25% through strategic initiatives..."
                />
                <button
                  onClick={() => removeAchievement(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editingIndex !== null ? 'Update' : 'Add'} Experience
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Work Experience
        </button>
      )}
    </div>
  )
}