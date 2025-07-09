export async function extractTextFromCV(file: File): Promise<string> {
  try {
    console.log('Starting CV text extraction for:', file.name)
    
    let fileContent = ''
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      fileContent = await extractFromPDF(file)
    } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileContent = await extractFromWord(file)
    } else {
      throw new Error('Unsupported file type')
    }

    console.log('Raw file content length:', fileContent.length)
    console.log('Raw file content preview:', fileContent.substring(0, 500))
    
    // Return the extracted content directly - no need for AI enhancement
    // If content is too short, still return what we have
    return fileContent || `This is a ${file.type} file named ${file.name}. Please manually enter your CV information.`
    
  } catch (error) {
    console.error('Error extracting text from CV:', error)
    throw new Error('Failed to extract text from CV')
  }
}

async function extractFromPDF(file: File): Promise<string> {
  try {
    // Use PDF.js for PDF text extraction
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
    
    const arrayBuffer = await file.arrayBuffer()
    const typedArray = new Uint8Array(arrayBuffer)
    
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise
    let fullText = ''
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: unknown) => {
          if (item && typeof item === 'object' && 'str' in item) {
            return (item as { str: string }).str
          }
          return ''
        })
        .join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    // Fallback to basic text extraction if PDF.js fails
    return await basicPDFExtraction(file)
  }
}

async function basicPDFExtraction(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(uint8Array)
    
    // Extract text using simple patterns
    const patterns = [
      /\(([^)]+)\)/g,  // Text in parentheses
      /\[([^\]]+)\]/g, // Text in brackets
      /\/([A-Za-z0-9\s]+)\s/g, // After forward slashes
      /BT\s*([^ET]*)\s*ET/g, // Between BT and ET
      /Tj\s*([^\/\s]+)/g, // After Tj commands
    ]
    
    let extractedText = ''
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const cleaned = match
            .replace(/[()[\]\/]/g, ' ')
            .replace(/BT\s*|ET\s*/g, ' ')
            .replace(/Tj\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
          
          if (cleaned.length > 2 && /[a-zA-Z]/.test(cleaned)) {
            extractedText += cleaned + ' '
          }
        })
      }
    })
    
    return extractedText.trim() || `PDF content extracted from ${file.name}. Please manually verify the information.`
  } catch (error) {
    console.error('Basic PDF extraction failed:', error)
    return `Unable to extract text from PDF: ${file.name}. Please manually enter your CV information.`
  }
}

async function extractFromWord(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // DOCX file - use mammoth.js with dynamic import
      try {
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ arrayBuffer })
        return result.value
      } catch (error) {
        console.error('Mammoth.js extraction failed:', error)
        return await basicWordExtraction(file)
      }
    } else {
      // DOC file - basic extraction
      return await basicWordExtraction(file)
    }
  } catch (error) {
    console.error('Error extracting Word text:', error)
    return `Unable to extract text from Word document: ${file.name}. Please manually enter your CV information.`
  }
}

async function basicWordExtraction(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(uint8Array)
    
    // Basic text cleaning for Word documents
    const cleanText = text
      .replace(/[^\x20-\x7E]/g, ' ') // Remove non-printable characters
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim()
    
    return cleanText || `Word document content from ${file.name}. Please verify the extracted information.`
  } catch (error) {
    console.error('Basic Word extraction failed:', error)
    return `Unable to extract text from Word document: ${file.name}. Please manually enter your CV information.`
  }
}