import { NextRequest, NextResponse } from 'next/server'
import { authManager, PlatformFactory } from '@/lib/platform-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    if (platform) {
      // Check specific platform
      const isAuthenticated = await authManager.checkPlatformAuth(platform)
      const isSupported = PlatformFactory.isPlatformSupported(platform)
      
      return NextResponse.json({
        success: true,
        platform,
        isAuthenticated,
        isSupported,
        message: isAuthenticated 
          ? 'Authentication valid' 
          : isSupported 
            ? 'Authentication required' 
            : 'Platform not supported'
      })
    } else {
      // Check all platforms
      const authStatuses = await authManager.checkAllPlatforms()
      const supportedPlatforms = PlatformFactory.getSupportedPlatforms()
      
      const platformDetails = supportedPlatforms.map((platform: string) => ({
        name: platform,
        isAuthenticated: authStatuses[platform] || false,
        isSupported: true,
        status: authStatuses[platform] ? 'Ready' : 'Authentication Required'
      }))

      return NextResponse.json({
        success: true,
        platforms: platformDetails,
        summary: {
          total: supportedPlatforms.length,
          authenticated: Object.values(authStatuses).filter(Boolean).length,
          ready: Object.values(authStatuses).filter(Boolean).length
        }
      })
    }
  } catch (error) {
    console.error('Platform auth check error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check platform authentication' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, platform } = await request.json()

    switch (action) {
      case 'refresh':
        if (platform) {
          // Clear cache for specific platform and re-check
          authManager.clearAuthCache(platform)
          const isAuthenticated = await authManager.checkPlatformAuth(platform)
          
          return NextResponse.json({
            success: true,
            platform,
            isAuthenticated,
            message: `Authentication status refreshed for ${platform}`
          })
        } else {
          // Clear all cache and re-check
          authManager.clearAuthCache()
          const authStatuses = await authManager.checkAllPlatforms()
          
          return NextResponse.json({
            success: true,
            platforms: authStatuses,
            message: 'All platform authentication statuses refreshed'
          })
        }

      case 'test':
        if (!platform) {
          return NextResponse.json(
            { error: 'Platform is required for testing' },
            { status: 400 }
          )
        }

        const platformAPI = PlatformFactory.createPlatform(platform)
        if (!platformAPI) {
          return NextResponse.json({
            success: false,
            platform,
            isAuthenticated: false,
            message: `Platform ${platform} not supported or not configured`
          })
        }

        const isValid = await platformAPI.validateAuth()
        
        return NextResponse.json({
          success: true,
          platform,
          isAuthenticated: isValid,
          message: isValid 
            ? `${platform} authentication test successful` 
            : `${platform} authentication test failed`
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "refresh" or "test"' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Platform auth action error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Platform auth action failed' 
      },
      { status: 500 }
    )
  }
}
