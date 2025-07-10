import { NextRequest, NextResponse } from 'next/server'
import { postingEngine } from '@/lib/intelligent-posting-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'health':
        const health = await postingEngine.getSystemHealth()
        return NextResponse.json({
          success: true,
          data: health
        })

      case 'status':
        const postId = searchParams.get('postId')
        if (!postId) {
          return NextResponse.json(
            { error: 'Post ID required for status check' },
            { status: 400 }
          )
        }
        
        const status = await postingEngine.getPostStatus(postId)
        return NextResponse.json({
          success: true,
          data: status
        })

      case 'alerts':
        const severity = searchParams.get('severity')
        const resolved = searchParams.get('resolved')
        const alerts = await postingEngine.getAlerts({
          severity: severity || undefined,
          resolved: resolved === 'true' ? true : resolved === 'false' ? false : undefined
        })
        return NextResponse.json({
          success: true,
          data: alerts
        })

      case 'healthcheck':
        const healthCheck = await postingEngine.performHealthCheck()
        return NextResponse.json({
          success: true,
          data: healthCheck
        })

      case 'config':
        const config = postingEngine.getNotificationConfig()
        return NextResponse.json({
          success: true,
          data: config
        })

      default:
        const systemHealth = await postingEngine.getSystemHealth()
        return NextResponse.json({
          success: true,
          message: 'Intelligent Posting Engine v2.0 API',
          data: systemHealth,
          endpoints: {
            health: '/api/posting-engine?action=health',
            status: '/api/posting-engine?action=status&postId=<id>',
            alerts: '/api/posting-engine?action=alerts',
            healthcheck: '/api/posting-engine?action=healthcheck',
            config: '/api/posting-engine?action=config'
          }
        })
    }
  } catch (error) {
    console.error('Posting engine API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, postData, postId, ...params } = await request.json()

    switch (action) {
      case 'start':
        await postingEngine.start()
        return NextResponse.json({
          success: true,
          message: 'Intelligent Posting Engine started'
        })

      case 'stop':
        await postingEngine.stop()
        return NextResponse.json({
          success: true,
          message: 'Intelligent Posting Engine stopped'
        })

      case 'maintenance':
        const enable = params.enable === true
        if (enable) {
          await postingEngine.enableMaintenanceMode()
        } else {
          await postingEngine.disableMaintenanceMode()
        }
        return NextResponse.json({
          success: true,
          message: `Maintenance mode ${enable ? 'enabled' : 'disabled'}`
        })

      case 'resolve-alert':
        const { alertId, acknowledgedBy } = params
        if (!alertId) {
          return NextResponse.json(
            { error: 'Alert ID required' },
            { status: 400 }
          )
        }
        
        const resolved = await postingEngine.resolveAlert(alertId, acknowledgedBy)
        return NextResponse.json({
          success: resolved,
          message: resolved ? 'Alert resolved' : 'Alert not found'
        })

      case 'update-config':
        const { config } = params
        if (!config) {
          return NextResponse.json(
            { error: 'Configuration required' },
            { status: 400 }
          )
        }
        
        await postingEngine.updateNotificationConfig(config)
        return NextResponse.json({
          success: true,
          message: 'Configuration updated successfully'
        })

      case 'schedule':
        if (!postData) {
          return NextResponse.json(
            { error: 'Post data required for scheduling' },
            { status: 400 }
          )
        }

        const scheduleResult = await postingEngine.schedulePost(postData)
        return NextResponse.json({
          success: scheduleResult.success,
          message: scheduleResult.message
        })

      case 'execute':
        if (!postData) {
          return NextResponse.json(
            { error: 'Post data required for execution' },
            { status: 400 }
          )
        }

        const executeResult = await postingEngine.executePost(postData)
        return NextResponse.json({
          success: executeResult.success,
          message: executeResult.message
        })

      case 'cancel':
      case 'cancel-post':
        const targetPostId = postId || params.postId
        if (!targetPostId) {
          return NextResponse.json(
            { error: 'Post ID required for cancellation' },
            { status: 400 }
          )
        }

        const cancelResult = await postingEngine.cancelPost(targetPostId)
        return NextResponse.json({
          success: cancelResult.success,
          message: cancelResult.message
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Posting engine API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}
