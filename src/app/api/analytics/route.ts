import { NextRequest, NextResponse } from 'next/server'
import { PlatformFactory, scheduler } from '@/lib/platform-api'
import { database } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const postId = searchParams.get('postId')

    if (!platform || !postId) {
      return NextResponse.json(
        { error: 'Platform and postId are required' },
        { status: 400 }
      )
    }

    // Try to get analytics from database first
    const existingAnalytics = await database.select('post_analytics', {
      post_id: postId,
      platform: platform
    })

    // If we have recent analytics (less than 1 hour old), return them
    if (existingAnalytics && existingAnalytics.length > 0) {
      const analytics = existingAnalytics[0]
      const lastUpdated = new Date(analytics.last_updated)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      if (lastUpdated > oneHourAgo) {
        return NextResponse.json({
          success: true,
          analytics: analytics
        })
      }
    }

    // Fetch fresh analytics from platform
    const platformAPI = PlatformFactory.createPlatform(platform)
    
    if (!platformAPI) {
      return NextResponse.json(
        { error: `Platform ${platform} not supported` },
        { status: 400 }
      )
    }

    const analytics = await platformAPI.getAnalytics(postId)
    
    // Save to database
    await scheduler.collectAnalytics(platform, postId)
    
    return NextResponse.json({
      success: true,
      analytics
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform, postId } = await request.json()

    if (!platform || !postId) {
      return NextResponse.json(
        { error: 'Platform and postId are required' },
        { status: 400 }
      )
    }

    // Force refresh analytics
    await scheduler.collectAnalytics(platform, postId)
    
    return NextResponse.json({
      success: true,
      message: 'Analytics refresh initiated'
    })
  } catch (error) {
    console.error('Analytics refresh error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
