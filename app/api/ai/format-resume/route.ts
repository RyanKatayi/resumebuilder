import { NextRequest, NextResponse } from 'next/server'
import { formatToProfessionalStyle } from '@/lib/resume-formatter'

export async function POST(request: NextRequest) {
  try {
    const { extractedText } = await request.json()
    
    const formattedResume = await formatToProfessionalStyle(extractedText)
    
    return NextResponse.json({ resume: formattedResume })
  } catch (error) {
    console.error('Error formatting resume:', error)
    return NextResponse.json(
      { error: 'Failed to format resume' },
      { status: 500 }
    )
  }
}