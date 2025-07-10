import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, ContentRecord } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get specific content by ID
      const content = await DatabaseService.getContent(id)
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }
      return NextResponse.json(content)
    } else {
      // Get all content
      const allContent = await DatabaseService.getAllContent()
      return NextResponse.json(allContent)
    }
  } catch (error) {
    console.error('Content GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentData: ContentRecord = await request.json()

    // Validate required fields
    if (!contentData.url || !contentData.title) {
      return NextResponse.json(
        { error: 'URL and title are required' },
        { status: 400 }
      )
    }

    const savedContent = await DatabaseService.saveContent(contentData)
    if (!savedContent) {
      throw new Error('Failed to save content to database')
    }

    return NextResponse.json(savedContent)
  } catch (error) {
    console.error('Content POST error:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    const contentData: Partial<ContentRecord> = await request.json()
    const updatedContent = await DatabaseService.updateContent(id, contentData)

    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error('Content PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
