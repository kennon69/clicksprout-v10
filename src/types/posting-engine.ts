// Client-safe version of posting engine interfaces
// This file contains only types and interfaces, no server-side code

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
