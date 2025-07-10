import { NextRequest, NextResponse } from 'next/server'
import { scheduler } from '@/lib/platform-api'
import { database } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let whereClause = {}
    if (status) {
      whereClause = { status }
    }

    const posts = await database.select('posts', whereClause)
    
    return NextResponse.json({
      success: true,
      posts: posts || [],
      scheduledCount: scheduler.getScheduledPosts().length
    })
  } catch (error) {
    console.error('Scheduler fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, postId, postData } = await request.json()

    switch (action) {
      case 'schedule':
        if (!postData) {
          return NextResponse.json(
            { error: 'Post data is required for scheduling' },
            { status: 400 }
          )
        }

        await scheduler.schedulePost(postData)
        
        return NextResponse.json({
          success: true,
          message: 'Post scheduled successfully',
          postId: postData.id
        })

      case 'cancel':
        if (!postId) {
          return NextResponse.json(
            { error: 'Post ID is required for cancellation' },
            { status: 400 }
          )
        }

        scheduler.cancelScheduledPost(postId)
        
        // Update database
        await database.update('posts', 
          { status: 'cancelled', updated_at: new Date().toISOString() },
          { id: postId }
        )
        
        return NextResponse.json({
          success: true,
          message: 'Post cancelled successfully'
        })

      case 'reschedule':
        if (!postId || !postData?.scheduledTime) {
          return NextResponse.json(
            { error: 'Post ID and scheduled time are required for rescheduling' },
            { status: 400 }
          )
        }

        // Cancel existing schedule
        scheduler.cancelScheduledPost(postId)
        
        // Get existing post data
        const existingPosts = await database.select('posts', { id: postId })
        if (!existingPosts || existingPosts.length === 0) {
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          )
        }

        const existingPost = existingPosts[0]
        const updatedPost = {
          ...existingPost,
          scheduledTime: postData.scheduledTime,
          status: 'scheduled' as const,
          updatedAt: new Date().toISOString()
        }

        await scheduler.schedulePost(updatedPost)
        
        return NextResponse.json({
          success: true,
          message: 'Post rescheduled successfully'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Scheduler action error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
