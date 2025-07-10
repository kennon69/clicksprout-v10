import { NextRequest, NextResponse } from 'next/server'
import { PlatformFactory, PostData, scheduler } from '@/lib/platform-api'

export async function POST(request: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const { platform } = params
    const postData: PostData = await request.json()

    // Validate required fields
    if (!postData.title || !postData.content || !postData.platform) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, platform' },
        { status: 400 }
      )
    }

    // Generate unique ID if not provided
    if (!postData.id) {
      postData.id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Set timestamps
    postData.createdAt = new Date().toISOString()
    postData.updatedAt = postData.createdAt

    if (postData.scheduledTime && new Date(postData.scheduledTime) > new Date()) {
      // Schedule the post for later
      postData.status = 'scheduled'
      await scheduler.schedulePost(postData)
      
      return NextResponse.json({
        success: true,
        message: 'Post scheduled successfully',
        postId: postData.id,
        scheduledTime: postData.scheduledTime
      })
    } else {
      // Post immediately
      const platformAPI = PlatformFactory.createPlatform(platform)
      
      if (!platformAPI) {
        return NextResponse.json(
          { error: `Platform ${platform} not supported` },
          { status: 400 }
        )
      }

      // Validate platform authentication
      const isAuthValid = await platformAPI.validateAuth()
      if (!isAuthValid) {
        return NextResponse.json(
          { error: `Authentication failed for ${platform}` },
          { status: 401 }
        )
      }

      postData.status = 'posted'
      const result = await platformAPI.post(postData)
      
      if (result.success) {
        // Start analytics collection after a delay
        setTimeout(async () => {
          await scheduler.collectAnalytics(platform, result.postId!)
        }, 60000)

        return NextResponse.json({
          success: true,
          message: 'Post published successfully',
          postId: result.postId,
          url: result.url
        })
      } else {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }
    }
  } catch (error) {
    console.error('Platform posting error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
