import { NextRequest, NextResponse } from 'next/server'
import { PlatformFactory } from '@/lib/platform-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform parameter is required' },
        { status: 400 }
      )
    }

    const platformAPI = PlatformFactory.createPlatform(platform)
    
    if (!platformAPI) {
      return NextResponse.json(
        { error: `Platform ${platform} not supported` },
        { status: 400 }
      )
    }

    const isAuthValid = await platformAPI.validateAuth()
    
    return NextResponse.json({
      platform,
      authenticated: isAuthValid,
      status: isAuthValid ? 'ready' : 'authentication_required'
    })
  } catch (error) {
    console.error('Platform test error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        authenticated: false,
        status: 'error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform, testPost } = await request.json()

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform parameter is required' },
        { status: 400 }
      )
    }

    const platformAPI = PlatformFactory.createPlatform(platform)
    
    if (!platformAPI) {
      return NextResponse.json(
        { error: `Platform ${platform} not supported` },
        { status: 400 }
      )
    }

    // Test authentication first
    const isAuthValid = await platformAPI.validateAuth()
    
    if (!isAuthValid) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    if (testPost) {
      // Create a test post
      const testPostData = {
        id: `test_${Date.now()}`,
        title: `ClickSprout Test Post - ${platform}`,
        content: `This is a test post from ClickSprout to verify ${platform} integration is working correctly.`,
        images: [],
        hashtags: ['#ClickSprout', '#Test', '#AutoPost'],
        platform: platform,
        status: 'posted' as const,
        createdAt: new Date().toISOString()
      }

      const result = await platformAPI.post(testPostData)
      
      return NextResponse.json({
        platform,
        testPost: true,
        success: result.success,
        postId: result.postId,
        url: result.url,
        error: result.error
      })
    }

    return NextResponse.json({
      platform,
      authenticated: true,
      status: 'ready'
    })
  } catch (error) {
    console.error('Platform test error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}
