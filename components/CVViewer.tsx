'use client'

import { Resume } from '@/types/resume'
import {
  ArrowLeft,
  Download,
  Edit,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ProfessionalTemplate } from './templates/ProfessionalTemplate'

interface CVViewerProps {
  resume: Resume
}

export function CVViewer({ resume }: CVViewerProps) {
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const cvContent = document.getElementById('cv-content')
      if (!cvContent) return

      const canvas = await html2canvas(cvContent, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_CV.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/edit/${resume.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button onClick={handleExportPDF} disabled={exporting} size="sm">
              <Download className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>

        {/* CV Content */}
        <Card>
          <CardContent className="p-2 sm:p-8 flex justify-center bg-gray-100">
            <div className="w-full max-w-full overflow-x-auto">
              <div
                id="cv-content"
                className="bg-white shadow-lg mx-auto"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '0.75in',
                  boxSizing: 'border-box',
                  minWidth: '210mm', // Prevent shrinking
                }}
              >
                <ProfessionalTemplate resume={resume} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}