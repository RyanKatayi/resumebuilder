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
    // For now, just use the basic extraction method
    // PDF.js has compatibility issues in the browser environment
    console.log('Using basic PDF extraction method')
    return await basicPDFExtraction(file)
  } catch (error) {
    console.error('PDF extraction failed:', error)
    return `Unable to extract text from PDF: ${file.name}. Please try converting to a text document first or manually enter your CV information.`
  }
}

async function basicPDFExtraction(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(uint8Array)
    
    // Look for text patterns in PDF structure
    let extractedText = ''
    
    // Pattern 1: Text between parentheses (common in PDFs)
    const parenMatches = text.matchAll(/\(([^)]+)\)/g)
    for (const match of parenMatches) {
      const content = match[1]
        // Decode common PDF escape sequences
        .replace(/\\r/g, '\r')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
        .trim()
      
      if (content.length > 1 && /[a-zA-Z0-9]/.test(content)) {
        extractedText += content + ' '
      }
    }
    
    // Pattern 2: Text in stream objects
    const streamMatches = text.matchAll(/stream\s*\n([\s\S]*?)\nendstream/g)
    for (const match of streamMatches) {
      const streamContent = match[1]
      // Extract readable text from stream
      const readable = streamContent
        .split(/\s+/)
        .filter(word => word.length > 2 && /^[a-zA-Z0-9\s.,\-@]+$/.test(word))
        .join(' ')
      
      if (readable) {
        extractedText += readable + ' '
      }
    }
    
    // Pattern 3: Look for Tj commands (text showing)
    const tjMatches = text.matchAll(/\((.*?)\)\s*Tj/g)
    for (const match of tjMatches) {
      const content = match[1]
        .replace(/\\([0-9]{3})/g, (m, oct) => String.fromCharCode(parseInt(oct, 8)))
        .trim()
      
      if (content.length > 1) {
        extractedText += content + ' '
      }
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, ' ') // Keep only printable ASCII
      .trim()
    
    // If we got substantial text, return it
    if (extractedText.length > 50) {
      return extractedText
    }
    
    // Fallback message
    return `PDF parsing yielded limited results. The file "${file.name}" may be image-based or use complex encoding. Please consider:
1. Converting your PDF to a text document (.txt or .docx)
2. Using a PDF with selectable text (not scanned)
3. Manually entering your CV information

Extracted preview: ${extractedText.substring(0, 100)}...`
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