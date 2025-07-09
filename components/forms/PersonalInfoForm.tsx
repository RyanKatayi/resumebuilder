'use client'

import { useState } from 'react'
import { PersonalInfo } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo
  onChange: (personalInfo: PersonalInfo) => void
}

interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  linkedin?: string
  github?: string
}

export function PersonalInfoForm({ personalInfo, onChange }: PersonalInfoFormProps) {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateField = (field: keyof PersonalInfo, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? undefined : 'This field is required'
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) ? undefined : 'Please enter a valid email address'
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        const phoneRegex = /^[\+]?[\d\s\-\(\)\.]+$/
        return phoneRegex.test(value) ? undefined : 'Please enter a valid phone number'
      case 'address':
        return value.trim() ? undefined : 'Address is required'
      case 'website':
      case 'linkedin':
      case 'github':
        if (!value.trim()) return undefined
        try {
          new URL(value)
          return undefined
        } catch {
          return 'Please enter a valid URL'
        }
      default:
        return undefined
    }
  }

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
    onChange({ ...personalInfo, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            type="text"
            value={personalInfo.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
            className={errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}
            aria-invalid={errors.firstName ? 'true' : 'false'}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && <p id="firstName-error" className="text-sm text-red-600" role="alert">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            value={personalInfo.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Doe"
            className={errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@email.com"
          className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={personalInfo.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
          className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          type="text"
          value={personalInfo.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Main St, City, State 12345"
          className={errors.address ? 'border-red-500 focus:ring-red-500' : ''}
        />
        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={personalInfo.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://johndoe.com"
            className={errors.website ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            type="url"
            value={personalInfo.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className={errors.linkedin ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.linkedin && <p className="text-sm text-red-600">{errors.linkedin}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            type="url"
            value={personalInfo.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/johndoe"
            className={errors.github ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.github && <p className="text-sm text-red-600">{errors.github}</p>}
        </div>
      </div>
    </div>
  )
}