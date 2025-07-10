import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, ContentTemplateRecord } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const allTemplates = await DatabaseService.getAllTemplates()
    return NextResponse.json(allTemplates)
  } catch (error) {
    console.error('Templates GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData: ContentTemplateRecord = await request.json()

    // Validate required fields
    if (!templateData.name || !templateData.title || !templateData.content) {
      return NextResponse.json(
        { error: 'Name, title, and content are required' },
        { status: 400 }
      )
    }

    const savedTemplate = await DatabaseService.saveTemplate(templateData)
    if (!savedTemplate) {
      throw new Error('Failed to save template to database')
    }

    return NextResponse.json(savedTemplate)
  } catch (error) {
    console.error('Template POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    )
  }
}
