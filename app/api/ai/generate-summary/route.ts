import { NextRequest, NextResponse } from 'next/server'
import { generateSummary } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { personalInfo, experience, skills, options } = await request.json()
    
    const summary = await generateSummary(personalInfo, experience, skills, options)
    
    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}