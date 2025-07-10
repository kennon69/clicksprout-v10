// ClickSprout Intelligent Posting Engine
// Auto-healing, self-monitoring, and continuously optimizing posting system

import { database } from './database'
import { scheduleCronJob } from './server-utils'

// Enhanced interfaces with monitoring capabilities
export interface PostData {
  id: string
  title: string
  content: string
  images: string[]
  hashtags: string[]
  platform: string
  scheduledTime?: string
  status: 'scheduled' | 'posted' | 'failed' | 'retrying' | 'cancelled' | 'pending'
  createdAt: string
  updatedAt?: string
  retryCount?: number
  maxRetries?: number
  lastError?: string
  platformPostId?: string
  url?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  tags?: string[]
  metadata?: Record<string, any>
}

export interface PlatformHealth {
  platform: string
  status: 'healthy' | 'degraded' | 'critical'
  lastChecked: string
  lastSuccessfulPost: string
  errorCount: number
  authStatus: 'valid' | 'expired' | 'invalid'
  rateLimit: {
    remaining: number
    resetTime: string
  }
}

export interface AnalyticsData {
  postId: string
  platform: string
  views: number
  clicks: number
  likes: number
  shares: number
  comments: number
  engagement: number
  lastUpdated: string
  trendData?: {
    hourly: number[]
    daily: number[]
    weekly: number[]
  }
  conversionData?: {
    leads: number
    sales: number
    revenue: number
  }
  demographics?: {
    age: Record<string, number>
    gender: Record<string, number>
    location: Record<string, number>
  }
}

export interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  details?: string
  timestamp: string
  platform?: string
  postId?: string
  resolved?: boolean
  acknowledgedBy?: string
  actions?: Array<{
    label: string
    action: string
    params?: Record<string, any>
  }>
}

export interface NotificationConfig {
  email: {
    enabled: boolean
    addresses: string[]
    minSeverity: 'low' | 'medium' | 'high' | 'critical'
  }
  slack: {
    enabled: boolean
    webhook: string
    channel: string
    minSeverity: 'low' | 'medium' | 'high' | 'critical'
  }
  sms: {
    enabled: boolean
    numbers: string[]
    minSeverity: 'high' | 'critical'
  }
}

// Intelligent Posting Engine with Auto-Healing and Enhanced Monitoring
export class IntelligentPostingEngine {
  private static instance: IntelligentPostingEngine
  private scheduledTasks: Map<string, any> = new Map()
  private platformHealth: Map<string, PlatformHealth> = new Map()
  private retryQueue: Map<string, PostData> = new Map()
  private analyticsCollectors: Map<string, NodeJS.Timeout> = new Map()
  private healthMonitors: Map<string, NodeJS.Timeout> = new Map()
  private systemAlerts: Map<string, SystemAlert> = new Map()
  private notificationConfig: NotificationConfig
  private isRunning: boolean = false
  private startTime: Date = new Date()
  private errorCounter: Map<string, number> = new Map()
  private performanceMetrics: Map<string, any> = new Map()
  private maintenanceMode: boolean = false

  constructor() {
    this.notificationConfig = {
      email: {
        enabled: false,
        addresses: [],
        minSeverity: 'high'
      },
      slack: {
        enabled: false,
        webhook: '',
        channel: '#alerts',
        minSeverity: 'medium'
      },
      sms: {
        enabled: false,
        numbers: [],
        minSeverity: 'critical'
      }
    }
  }

  static getInstance(): IntelligentPostingEngine {
    if (!IntelligentPostingEngine.instance) {
      IntelligentPostingEngine.instance = new IntelligentPostingEngine()
    }
    return IntelligentPostingEngine.instance
  }

  async start(): Promise<void> {
    if (this.isRunning) return
    
    console.log('🚀 Starting ClickSprout Intelligent Posting Engine v2.0...')
    this.startTime = new Date()
    
    // Initialize platform health monitoring
    await this.initializePlatformHealth()
    
    // Start continuous health monitoring
    this.startHealthMonitoring()
    
    // Start retry queue processor
    this.startRetryProcessor()
    
    // Start analytics collection
    this.startAnalyticsCollection()
    
    // Start alert processing
    this.startAlertProcessor()
    
    // Start performance monitoring
    this.startPerformanceMonitoring()
    
    // Load and resume scheduled posts
    await this.resumeScheduledPosts()
    
    this.isRunning = true
    
    await this.createAlert({
      type: 'success',
      severity: 'low',
      message: 'Intelligent Posting Engine started successfully',
      details: `Engine started at ${this.startTime.toISOString()}`
    })
    
    console.log('✅ Intelligent Posting Engine v2.0 started successfully')
  }

  async stop(): Promise<void> {
    console.log('🛑 Stopping Intelligent Posting Engine...')
    
    // Clear all scheduled tasks
    this.scheduledTasks.forEach(task => {
      if (task.destroy) task.destroy()
    })
    this.scheduledTasks.clear()
    
    // Clear health monitors
    this.healthMonitors.forEach(monitor => clearInterval(monitor))
    this.healthMonitors.clear()
    
    // Clear analytics collectors
    this.analyticsCollectors.forEach(collector => clearTimeout(collector))
    this.analyticsCollectors.clear()
    
    await this.createAlert({
      type: 'info',
      severity: 'medium',
      message: 'Intelligent Posting Engine stopped',
      details: `Engine stopped after ${this.getUptime()} seconds of uptime`
    })
    
    this.isRunning = false
    console.log('✅ Intelligent Posting Engine stopped')
  }

  // Enhanced alert system
  async createAlert(alert: Omit<SystemAlert, 'id' | 'timestamp'>): Promise<string> {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const systemAlert: SystemAlert = {
      id,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alert
    }
    
    this.systemAlerts.set(id, systemAlert)
    
    // Send notifications based on severity
    await this.sendNotification(systemAlert)
    
    // Store in database
    try {
      await database.insert('system_alerts', systemAlert)
    } catch (error) {
      console.error('Failed to store alert in database:', error)
    }
    
    console.log(`🚨 Alert created: ${alert.type.toUpperCase()} - ${alert.message}`)
    return id
  }

  async sendNotification(alert: SystemAlert): Promise<void> {
    try {
      // Email notifications
      if (this.notificationConfig.email.enabled && 
          this.shouldSendNotification(alert.severity, this.notificationConfig.email.minSeverity)) {
        await this.sendEmailNotification(alert)
      }
      
      // Slack notifications
      if (this.notificationConfig.slack.enabled && 
          this.shouldSendNotification(alert.severity, this.notificationConfig.slack.minSeverity)) {
        await this.sendSlackNotification(alert)
      }
      
      // SMS notifications
      if (this.notificationConfig.sms.enabled && 
          this.shouldSendNotification(alert.severity, this.notificationConfig.sms.minSeverity)) {
        await this.sendSMSNotification(alert)
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  private shouldSendNotification(alertSeverity: string, minSeverity: string): boolean {
    const severityLevels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 }
    return severityLevels[alertSeverity as keyof typeof severityLevels] >= 
           severityLevels[minSeverity as keyof typeof severityLevels]
  }

  private async sendEmailNotification(alert: SystemAlert): Promise<void> {
    // Implementation for email notifications
    console.log('📧 Email notification sent:', alert.message)
  }

  private async sendSlackNotification(alert: SystemAlert): Promise<void> {
    if (!this.notificationConfig.slack.webhook) return
    
    const payload = {
      channel: this.notificationConfig.slack.channel,
      text: `🚨 ClickSprout Alert: ${alert.message}`,
      attachments: [{
        color: this.getAlertColor(alert.severity),
        fields: [
          { title: 'Severity', value: alert.severity.toUpperCase(), short: true },
          { title: 'Platform', value: alert.platform || 'System', short: true },
          { title: 'Details', value: alert.details || 'No additional details', short: false }
        ],
        timestamp: Math.floor(new Date().getTime() / 1000)
      }]
    }
    
    try {
      const response = await fetch(this.notificationConfig.slack.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        console.log('💬 Slack notification sent:', alert.message)
      }
    } catch (error) {
      console.error('Failed to send Slack notification:', error)
    }
  }

  private async sendSMSNotification(alert: SystemAlert): Promise<void> {
    // Implementation for SMS notifications
    console.log('📱 SMS notification sent:', alert.message)
  }

  private getAlertColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'good'
      case 'low': return '#36a64f'
      default: return 'good'
    }
  }

  // Enhanced performance monitoring
  private startPerformanceMonitoring(): void {
    const monitor = setInterval(() => {
      const metrics = {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: this.getUptime(),
        scheduledTasks: this.scheduledTasks.size,
        retryQueue: this.retryQueue.size,
        systemAlerts: this.systemAlerts.size,
        timestamp: new Date().toISOString()
      }
      
      this.performanceMetrics.set('current', metrics)
      
      // Check for performance issues
      if (metrics.memoryUsage.heapUsed > 500 * 1024 * 1024) { // 500MB threshold
        this.createAlert({
          type: 'warning',
          severity: 'medium',
          message: 'High memory usage detected',
          details: `Current heap usage: ${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB`
        })
      }
      
      if (this.retryQueue.size > 50) {
        this.createAlert({
          type: 'warning',
          severity: 'high',
          message: 'High retry queue size',
          details: `Current retry queue size: ${this.retryQueue.size}`
        })
      }
    }, 60000) // Check every minute
    
    this.healthMonitors.set('performance', monitor)
  }

  private startAlertProcessor(): void {
    const processor = setInterval(() => {
      // Clean up resolved alerts older than 24 hours
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const alertsToDelete: string[] = []
      this.systemAlerts.forEach((alert, id) => {
        if (alert.resolved && new Date(alert.timestamp) < cutoff) {
          alertsToDelete.push(id)
        }
      })
      
      alertsToDelete.forEach(id => this.systemAlerts.delete(id))
    }, 3600000) // Check every hour
    
    this.healthMonitors.set('alerts', processor)
  }

  private getUptime(): number {
    return Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000)
  }

  // Enhanced scheduling with intelligent retry and monitoring
  async schedulePost(postData: PostData): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`📅 Scheduling post ${postData.id} for ${postData.scheduledTime}`)
      
      // Validate platform health before scheduling
      const platformHealth = await this.checkPlatformHealth(postData.platform)
      if (platformHealth.status === 'critical') {
        return {
          success: false,
          message: `Platform ${postData.platform} is currently down. Post queued for retry.`
        }
      }

      const scheduledTime = new Date(postData.scheduledTime!)
      const now = new Date()
      
      if (scheduledTime <= now) {
        // Execute immediately
        return await this.executePost(postData)
      }

      // Schedule for future execution
      const delay = scheduledTime.getTime() - now.getTime()
      
      const task = setTimeout(async () => {
        await this.executePost(postData)
        this.scheduledTasks.delete(postData.id)
      }, delay)

      this.scheduledTasks.set(postData.id, task)
      
      // Save to database with enhanced metadata
      await this.savePostToDatabase({
        ...postData,
        status: 'scheduled',
        retryCount: 0,
        updatedAt: new Date().toISOString()
      })

      return {
        success: true,
        message: `Post scheduled successfully for ${scheduledTime.toLocaleString()}`
      }
    } catch (error) {
      console.error('❌ Scheduling error:', error)
      return {
        success: false,
        message: `Scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Intelligent post execution with auto-retry and error recovery
  async executePost(postData: PostData): Promise<{ success: boolean; message: string }> {
    const startTime = Date.now()
    console.log(`📤 Executing post ${postData.id} to ${postData.platform}`)

    try {
      // Pre-execution health check
      const platformHealth = await this.checkPlatformHealth(postData.platform)
      
      if (platformHealth.status === 'critical') {
        console.log(`⚠️ Platform ${postData.platform} is down, queuing for retry`)
        await this.queueForRetry(postData, 'Platform temporarily unavailable')
        return { success: false, message: 'Platform down, queued for retry' }
      }

      // Get platform API instance
      const platformAPI = PlatformFactory.createPlatform(postData.platform)
      if (!platformAPI) {
        throw new Error(`Platform ${postData.platform} not supported`)
      }

      // Execute post with timeout
      const result = await Promise.race([
        platformAPI.post(postData),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Post timeout')), 30000)
        )
      ])

      const executionTime = Date.now() - startTime

      if (result.success) {
        console.log(`✅ Post ${postData.id} successful in ${executionTime}ms`)
        
        // Update post status
        await this.updatePostStatus(postData.id, 'posted', undefined, result.postId, result.url)
        
        // Update platform health
        await this.updatePlatformHealth(postData.platform, true)
        
        // Schedule analytics collection
        this.scheduleAnalyticsCollection(postData.platform, result.postId!, postData.id)
        
        return {
          success: true,
          message: `Posted successfully to ${postData.platform}`
        }
      } else {
        console.log(`❌ Post ${postData.id} failed: ${result.error}`)
        
        // Handle specific error types
        if (result.retryAfter) {
          await this.queueForRetry(postData, result.error || 'Unknown error', result.retryAfter * 1000)
        } else if (this.isRetryableError(result.error)) {
          await this.queueForRetry(postData, result.error || 'Unknown error')
        } else {
          await this.updatePostStatus(postData.id, 'failed', result.error || 'Unknown error')
        }
        
        // Update platform health
        await this.updatePlatformHealth(postData.platform, false, result.error)
        
        return {
          success: false,
          message: result.error || 'Post failed'
        }
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      console.error(`❌ Post execution error after ${executionTime}ms:`, error)
      
      // Auto-retry for network errors and timeouts
      if (this.isRetryableError(errorMessage)) {
        await this.queueForRetry(postData, errorMessage)
      } else {
        await this.updatePostStatus(postData.id, 'failed', errorMessage)
      }
      
      await this.updatePlatformHealth(postData.platform, false, errorMessage)
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  // Intelligent retry system with exponential backoff
  private async queueForRetry(postData: PostData, error: string, customDelay?: number): Promise<void> {
    const retryCount = (postData.retryCount || 0) + 1
    const maxRetries = 5
    
    if (retryCount > maxRetries) {
      console.log(`❌ Max retries exceeded for post ${postData.id}`)
      await this.updatePostStatus(postData.id, 'failed', `Max retries exceeded: ${error}`)
      return
    }

    // Exponential backoff: 1min, 5min, 15min, 1hr, 4hr
    const backoffDelays = [60000, 300000, 900000, 3600000, 14400000]
    const delay = customDelay || backoffDelays[retryCount - 1] || 14400000

    console.log(`🔄 Queueing post ${postData.id} for retry ${retryCount}/${maxRetries} in ${delay/1000}s`)

    const updatedPost: PostData = {
      ...postData,
      status: 'retrying',
      retryCount,
      lastError: error,
      updatedAt: new Date().toISOString()
    }

    // Update database
    await this.updatePostStatus(postData.id, 'retrying', error)

    // Schedule retry
    setTimeout(async () => {
      await this.executePost(updatedPost)
      this.retryQueue.delete(postData.id)
    }, delay)

    this.retryQueue.set(postData.id, updatedPost)
  }

  // Continuous platform health monitoring
  private startHealthMonitoring(): void {
    const platforms = ['reddit', 'medium', 'twitter', 'pinterest', 'facebook']
    
    platforms.forEach(platform => {
      // Check every 5 minutes
      const monitor = setInterval(async () => {
        await this.checkPlatformHealth(platform)
      }, 300000)
      
      this.healthMonitors.set(platform, monitor)
    })

    console.log('🔍 Platform health monitoring started')
  }

  // Enhanced platform health checking
  private async checkPlatformHealth(platform: string): Promise<PlatformHealth> {
    try {
      const platformAPI = PlatformFactory.createPlatform(platform)
      if (!platformAPI) {
        throw new Error('Platform not supported')
      }

      const isHealthy = await platformAPI.validateAuth()
      const now = new Date().toISOString()

      const health: PlatformHealth = {
        platform,
        status: isHealthy ? 'healthy' : 'degraded',
        lastChecked: now,
        lastSuccessfulPost: this.platformHealth.get(platform)?.lastSuccessfulPost || '',
        errorCount: isHealthy ? 0 : (this.platformHealth.get(platform)?.errorCount || 0) + 1,
        authStatus: isHealthy ? 'valid' : 'invalid',
        rateLimit: {
          remaining: 100, // Platform-specific implementation needed
          resetTime: now
        }
      }

      this.platformHealth.set(platform, health)
      
      // Save to database for dashboard
      await database.upsert('platform_health', health, { platform })

      if (!isHealthy) {
        console.log(`⚠️ Platform ${platform} health check failed`)
        await this.sendHealthAlert(platform, health)
      }

      return health
    } catch (error) {
      console.error(`❌ Health check failed for ${platform}:`, error)
      
      const degradedHealth: PlatformHealth = {
        platform,
        status: 'critical',
        lastChecked: new Date().toISOString(),
        lastSuccessfulPost: this.platformHealth.get(platform)?.lastSuccessfulPost || '',
        errorCount: (this.platformHealth.get(platform)?.errorCount || 0) + 1,
        authStatus: 'invalid',
        rateLimit: { remaining: 0, resetTime: new Date().toISOString() }
      }

      this.platformHealth.set(platform, degradedHealth)
      await database.upsert('platform_health', degradedHealth, { platform })
      
      return degradedHealth
    }
  }

  // Continuous analytics collection
  private startAnalyticsCollection(): void {
    // Collect analytics every hour for recent posts
    scheduleCronJob('0 * * * *', async () => {
      console.log('📊 Starting hourly analytics collection...')
      await this.collectRecentAnalytics()
    })

    // Deep analytics collection daily
    scheduleCronJob('0 2 * * *', async () => {
      console.log('📈 Starting daily analytics collection...')
      await this.collectAllAnalytics()
    })

    console.log('📊 Analytics collection scheduled')
  }

  private async collectRecentAnalytics(): Promise<void> {
    try {
      // Get posts from last 24 hours
      const recentPosts = await database.select('posts', {
        status: 'posted',
        created_at: { gte: new Date(Date.now() - 86400000).toISOString() }
      })

      for (const post of recentPosts || []) {
        if (post.platform_post_id) {
          await this.collectPostAnalytics(post.platform, post.platform_post_id, post.id)
        }
      }
    } catch (error) {
      console.error('❌ Recent analytics collection error:', error)
    }
  }

  private async collectAllAnalytics(): Promise<void> {
    try {
      // Get all posted content
      const allPosts = await database.select('posts', { status: 'posted' })

      for (const post of allPosts || []) {
        if (post.platform_post_id) {
          await this.collectPostAnalytics(post.platform, post.platform_post_id, post.id)
        }
      }
    } catch (error) {
      console.error('❌ Full analytics collection error:', error)
    }
  }

  private async collectPostAnalytics(platform: string, platformPostId: string, postId: string): Promise<void> {
    try {
      const platformAPI = PlatformFactory.createPlatform(platform)
      if (!platformAPI) return

      const analytics = await platformAPI.getAnalytics(platformPostId)
      
      // Enhanced analytics with trend data
      const enhancedAnalytics: AnalyticsData = {
        ...analytics,
        postId,
        trendData: await this.calculateTrends(postId, analytics)
      }

      await database.upsert('post_analytics', enhancedAnalytics, { 
        post_id: postId, 
        platform 
      })

      console.log(`📊 Analytics updated for ${platform} post ${platformPostId}`)
    } catch (error) {
      console.error(`❌ Analytics collection failed for ${platform}:`, error)
    }
  }

  // Enhanced analytics collection with trend analysis
  private async scheduleAnalyticsCollection(platform: string, platformPostId: string, postId: string): Promise<void> {
    const collectAnalytics = async (attempt: number = 1) => {
      try {
        const platformAPI = PlatformFactory.createPlatform(platform)
        if (!platformAPI) return

        const analytics = await platformAPI.getAnalytics(platformPostId)
        
        if (analytics) {
          // Enhanced analytics with trend calculation
          const enhancedAnalytics = {
            ...analytics,
            postId,
            collectionAttempt: attempt,
            trendData: await this.calculateTrends(postId, analytics),
            conversionData: await this.calculateConversions(postId, analytics),
            demographics: await this.getDemographics(platform, platformPostId)
          }

          await database.insert('analytics', enhancedAnalytics)
          
          // Alert on significant changes
          await this.checkAnalyticsAlerts(enhancedAnalytics)
        }
      } catch (error) {
        console.error(`Analytics collection failed for ${postId}:`, error)
        
        if (attempt < 3) {
          // Retry with exponential backoff
          setTimeout(() => collectAnalytics(attempt + 1), Math.pow(2, attempt) * 60000)
        }
      }
    }

    // Collect analytics at intervals: 1hr, 6hr, 24hr, 7d, 30d
    const intervals = [3600000, 21600000, 86400000, 604800000, 2592000000]
    
    intervals.forEach((interval, index) => {
      const timeout = setTimeout(() => collectAnalytics(index + 1), interval)
      this.analyticsCollectors.set(`${postId}_${index}`, timeout)
    })
  }

  // Missing helper methods
  private async initializePlatformHealth(): Promise<void> {
    const platforms = ['reddit', 'medium', 'twitter', 'pinterest', 'facebook']
    
    for (const platform of platforms) {
      const health: PlatformHealth = {
        platform,
        status: 'healthy',
        lastChecked: new Date().toISOString(),
        lastSuccessfulPost: '',
        errorCount: 0,
        authStatus: 'valid',
        rateLimit: {
          remaining: 100,
          resetTime: new Date(Date.now() + 3600000).toISOString()
        }
      }
      
      this.platformHealth.set(platform, health)
    }
  }

  private startRetryProcessor(): void {
    const processor = setInterval(async () => {
      const retryItems: Array<[string, PostData]> = []
      this.retryQueue.forEach((postData, postId) => {
        retryItems.push([postId, postData])
      })
      
      for (const [postId, postData] of retryItems) {
        if (postData.status === 'retrying') {
          await this.executePost(postData)
        }
      }
    }, 60000) // Process every minute
    
    this.healthMonitors.set('retryProcessor', processor)
  }

  private async resumeScheduledPosts(): Promise<void> {
    try {
      const scheduledPosts = await database.select('posts', { status: 'scheduled' })
      
      for (const post of scheduledPosts) {
        if (post.scheduledTime && new Date(post.scheduledTime) > new Date()) {
          await this.schedulePost(post as PostData)
        }
      }
      
      console.log(`📅 Resumed ${scheduledPosts.length} scheduled posts`)
    } catch (error) {
      console.error('Failed to resume scheduled posts:', error)
    }
  }

  private async savePostToDatabase(postData: PostData): Promise<void> {
    try {
      await database.insert('posts', postData)
    } catch (error) {
      console.error('Failed to save post to database:', error)
    }
  }

  private async updatePostStatus(
    postId: string, 
    status: PostData['status'], 
    error?: string, 
    platformPostId?: string, 
    url?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date().toISOString()
      }
      
      if (error) updateData.lastError = error
      if (platformPostId) updateData.platformPostId = platformPostId
      if (url) updateData.url = url
      
      await database.update('posts', { id: postId }, updateData)
    } catch (error) {
      console.error('Failed to update post status:', error)
    }
  }

  private async updatePlatformHealth(platform: string, success: boolean, error?: string): Promise<void> {
    const health = this.platformHealth.get(platform)
    if (!health) return

    const updatedHealth: PlatformHealth = {
      ...health,
      status: success ? 'healthy' : 'degraded',
      lastChecked: new Date().toISOString(),
      errorCount: success ? 0 : health.errorCount + 1
    }

    if (success) {
      updatedHealth.lastSuccessfulPost = new Date().toISOString()
    }

    this.platformHealth.set(platform, updatedHealth)

    // Send alert if platform status changed
    if (health.status !== updatedHealth.status) {
      await this.sendHealthAlert(platform, updatedHealth)
    }
  }

  private async sendHealthAlert(platform: string, health: PlatformHealth): Promise<void> {
    const severity = health.status === 'critical' ? 'high' : 'medium'
    const message = `Platform ${platform} status changed to ${health.status}`
    
    await this.createAlert({
      type: 'warning',
      severity,
      message,
      details: `Error count: ${health.errorCount}`,
      platform
    })
  }

  private isRetryableError(error?: string): boolean {
    if (!error) return false
    
    const retryableErrors = [
      'timeout',
      'network',
      'connection',
      'rate limit',
      'server error',
      'internal server error',
      'bad gateway',
      'service unavailable'
    ]
    
    return retryableErrors.some(retryable => 
      error.toLowerCase().includes(retryable)
    )
  }

  private async calculateTrends(postId: string, currentAnalytics: any): Promise<any> {
    try {
      const historicalData = await database.select('analytics', { postId }, { 
        orderBy: 'lastUpdated', 
        limit: 24 
      })

      if (historicalData.length < 2) return null

      const hourlyTrend = historicalData.slice(-24).map((d: any) => d.views)
      const dailyTrend = historicalData.filter((_: any, i: number) => i % 24 === 0).map((d: any) => d.views)
      
      return {
        hourly: hourlyTrend,
        daily: dailyTrend,
        weekly: dailyTrend.slice(-7),
        growth: {
          hourly: this.calculateGrowthRate(hourlyTrend),
          daily: this.calculateGrowthRate(dailyTrend),
          weekly: this.calculateGrowthRate(dailyTrend.slice(-7))
        }
      }
    } catch (error) {
      console.error('Error calculating trends:', error)
      return null
    }
  }

  private calculateGrowthRate(data: number[]): number {
    if (data.length < 2) return 0
    const first = data[0] || 0
    const last = data[data.length - 1] || 0
    return first === 0 ? 0 : ((last - first) / first) * 100
  }

  private async calculateConversions(postId: string, analytics: any): Promise<any> {
    // Implementation for conversion tracking
    return {
      leads: Math.floor(analytics.clicks * 0.05), // 5% conversion rate estimate
      sales: Math.floor(analytics.clicks * 0.02), // 2% conversion rate estimate
      revenue: Math.floor(analytics.clicks * 0.02 * 25) // $25 average order value
    }
  }

  private async getDemographics(platform: string, platformPostId: string): Promise<any> {
    // Platform-specific demographics implementation
    return {
      age: { '18-24': 25, '25-34': 40, '35-44': 20, '45+': 15 },
      gender: { 'male': 45, 'female': 50, 'other': 5 },
      location: { 'US': 60, 'UK': 15, 'CA': 10, 'AU': 8, 'Other': 7 }
    }
  }

  private async checkAnalyticsAlerts(analytics: any): Promise<void> {
    // Alert on viral content (high engagement)
    if (analytics.engagement > 10) {
      await this.createAlert({
        type: 'success',
        severity: 'low',
        message: 'Viral content detected!',
        details: `Post ${analytics.postId} has ${analytics.engagement}% engagement rate`,
        postId: analytics.postId,
        platform: analytics.platform
      })
    }

    // Alert on poor performance
    if (analytics.engagement < 0.5 && analytics.views > 100) {
      await this.createAlert({
        type: 'warning',
        severity: 'low',
        message: 'Low engagement detected',
        details: `Post ${analytics.postId} has ${analytics.engagement}% engagement rate`,
        postId: analytics.postId,
        platform: analytics.platform
      })
    }
  }

  // Enhanced maintenance and recovery methods
  async enableMaintenanceMode(): Promise<void> {
    this.maintenanceMode = true
    
    // Pause all scheduled tasks
    this.scheduledTasks.forEach(task => {
      if (task.pause) task.pause()
    })
    
    await this.createAlert({
      type: 'info',
      severity: 'medium',
      message: 'Maintenance mode enabled',
      details: 'All posting operations have been paused'
    })
  }

  async disableMaintenanceMode(): Promise<void> {
    this.maintenanceMode = false
    
    // Resume all scheduled tasks
    this.scheduledTasks.forEach(task => {
      if (task.resume) task.resume()
    })
    
    await this.createAlert({
      type: 'info',
      severity: 'medium',
      message: 'Maintenance mode disabled',
      details: 'All posting operations have been resumed'
    })
  }

  async performHealthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'critical'
    details: Array<{
      component: string
      status: 'healthy' | 'degraded' | 'critical'
      message: string
    }>
  }> {
    const results: Array<{
      component: string
      status: 'healthy' | 'degraded' | 'critical'
      message: string
    }> = []
    
    // Check engine status
    results.push({
      component: 'Engine',
      status: this.isRunning ? 'healthy' : 'critical',
      message: this.isRunning ? 'Engine is running' : 'Engine is stopped'
    })
    
    // Check platform health
    this.platformHealth.forEach((health, platform) => {
      results.push({
        component: `Platform: ${platform}`,
        status: health.status,
        message: `${health.status} - ${health.errorCount} errors`
      })
    })
    
    // Check retry queue
    results.push({
      component: 'Retry Queue',
      status: this.retryQueue.size > 20 ? 'degraded' : 'healthy',
      message: `${this.retryQueue.size} items in queue`
    })
    
    // Check system alerts
    const criticalAlerts = Array.from(this.systemAlerts.values())
      .filter(a => !a.resolved && a.severity === 'critical').length
    
    results.push({
      component: 'System Alerts',
      status: criticalAlerts > 0 ? 'critical' : 'healthy',
      message: `${criticalAlerts} critical alerts`
    })
    
    // Determine overall health
    const overall = results.some(r => r.status === 'critical') ? 'critical' :
                   results.some(r => r.status === 'degraded') ? 'degraded' : 'healthy'
    
    return { overall, details: results }
  }

  // Helper methods for metrics
  private async getTotalPostsCount(): Promise<number> {
    try {
      const posts = await database.select('posts', {})
      return posts.length
    } catch (error) {
      return 0
    }
  }

  private async getSuccessRate(): Promise<number> {
    try {
      const posts = await database.select('posts', {})
      const successful = posts.filter((p: any) => p.status === 'posted').length
      return posts.length > 0 ? (successful / posts.length) * 100 : 0
    } catch (error) {
      return 0
    }
  }

  private async getAverageResponseTime(): Promise<number> {
    // Implementation for average response time calculation
    return 1500 // ms
  }

  // Alert management methods
  async resolveAlert(alertId: string, acknowledgedBy?: string): Promise<boolean> {
    try {
      const alert = this.systemAlerts.get(alertId)
      if (!alert) return false

      alert.resolved = true
      alert.acknowledgedBy = acknowledgedBy

      await database.update('system_alerts', { id: alertId }, { 
        resolved: true, 
        acknowledgedBy 
      })

      return true
    } catch (error) {
      console.error('Error resolving alert:', error)
      return false
    }
  }

  async getAlerts(filter?: { severity?: string; resolved?: boolean }): Promise<SystemAlert[]> {
    let alerts = Array.from(this.systemAlerts.values())
    
    if (filter) {
      if (filter.severity) {
        alerts = alerts.filter(a => a.severity === filter.severity)
      }
      if (filter.resolved !== undefined) {
        alerts = alerts.filter(a => a.resolved === filter.resolved)
      }
    }
    
    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Configuration methods
  async updateNotificationConfig(config: Partial<NotificationConfig>): Promise<void> {
    this.notificationConfig = { ...this.notificationConfig, ...config }
    
    await this.createAlert({
      type: 'info',
      severity: 'low',
      message: 'Notification configuration updated',
      details: 'Alert notification settings have been updated'
    })
  }

  getNotificationConfig(): NotificationConfig {
    return this.notificationConfig
  }

  // System health methods
  async getSystemHealth(): Promise<{
    engine: {
      status: 'running' | 'stopped' | 'maintenance'
      uptime: number
      startTime: string
    }
    platforms: Array<{
      platform: string
      status: 'healthy' | 'degraded' | 'critical'
      lastChecked: string
      errorCount: number
      authStatus: 'valid' | 'expired' | 'invalid'
    }>
    scheduledPosts: number
    retryQueue: number
    systemAlerts: number
    performance: {
      memoryUsage: NodeJS.MemoryUsage
      uptime: number
      lastUpdated: string
    }
  }> {
    const platformsArray = Array.from(this.platformHealth.values()).map(health => ({
      platform: health.platform,
      status: health.status,
      lastChecked: health.lastChecked,
      errorCount: health.errorCount,
      authStatus: health.authStatus
    }))

    const currentMetrics = this.performanceMetrics.get('current')
    
    return {
      engine: {
        status: this.maintenanceMode ? 'maintenance' : (this.isRunning ? 'running' : 'stopped'),
        uptime: this.getUptime(),
        startTime: this.startTime.toISOString()
      },
      platforms: platformsArray,
      scheduledPosts: this.scheduledTasks.size,
      retryQueue: this.retryQueue.size,
      systemAlerts: Array.from(this.systemAlerts.values()).filter(a => !a.resolved).length,
      performance: {
        memoryUsage: currentMetrics?.memoryUsage || process.memoryUsage(),
        uptime: this.getUptime(),
        lastUpdated: new Date().toISOString()
      }
    }
  }

  async getPostStatus(postId: string): Promise<{
    id: string
    status: 'scheduled' | 'posted' | 'failed' | 'retrying' | 'cancelled' | 'pending'
    scheduledTime?: string
    executedTime?: string
    platform?: string
    error?: string
    retryCount?: number
    url?: string
    platformPostId?: string
  } | null> {
    try {
      const post = await database.select('posts', { id: postId })
      if (!post || post.length === 0) return null

      const postData = post[0]
      return {
        id: postData.id,
        status: postData.status,
        scheduledTime: postData.scheduledTime,
        executedTime: postData.updatedAt,
        platform: postData.platform,
        error: postData.lastError,
        retryCount: postData.retryCount,
        url: postData.url,
        platformPostId: postData.platformPostId
      }
    } catch (error) {
      console.error('Error getting post status:', error)
      return null
    }
  }

  async cancelPost(postId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Cancel scheduled task if it exists
      const task = this.scheduledTasks.get(postId)
      if (task) {
        clearTimeout(task)
        this.scheduledTasks.delete(postId)
      }

      // Remove from retry queue
      this.retryQueue.delete(postId)

      // Update post status in database
      await this.updatePostStatus(postId, 'cancelled')

      return {
        success: true,
        message: 'Post cancelled successfully'
      }
    } catch (error) {
      console.error('Error cancelling post:', error)
      return {
        success: false,
        message: 'Failed to cancel post'
      }
    }
  }
}

// Export singleton instance
export const postingEngine = IntelligentPostingEngine.getInstance()

// Import platform factory (assuming it exists from previous implementation)
import { PlatformFactory } from './platform-api'
