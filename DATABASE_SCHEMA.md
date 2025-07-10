// Database schema for ClickSprout v1.0
// This would be implemented with your chosen database (Firebase, MongoDB, PostgreSQL, etc.)

interface Database {
  // Users table (if you add authentication)
  users: {
    id: string
    email: string
    created_at: Date
    updated_at: Date
  }

  // Scraped content and generated content
  content: {
    id: string
    user_id?: string
    url: string
    title: string
    description: string
    price?: string
    images: string[]
    videos: string[]
    generated_content?: string
    hashtags: string[]
    market_research?: object
    created_at: Date
    updated_at: Date
  }

  // Campaigns created by users
  campaigns: {
    id: string
    user_id?: string
    name: string
    content_id: string
    platforms: string[]
    scheduled_time?: Date
    posted: boolean
    budget?: number
    ab_test_enabled: boolean
    ab_variants?: object[]
    market_research?: object
    performance_forecast?: object
    optimization_enabled: boolean
    stats: {
      views: number
      clicks: number
      shares: number
      conversions: number
    }
    created_at: Date
    updated_at: Date
  }

  // Scheduled posts across platforms
  scheduled_posts: {
    id: string
    user_id?: string
    campaign_id: string
    platform: string
    content: string
    images: string[]
    scheduled_time: Date
    status: 'scheduled' | 'posted' | 'failed'
    posted_at?: Date
    error_message?: string
    created_at: Date
    updated_at: Date
  }

  // Content templates for reuse
  content_templates: {
    id: string
    user_id?: string
    name: string
    title: string
    description: string
    content: string
    hashtags: string[]
    images: string[]
    created_at: Date
    updated_at: Date
  }

  // Analytics and performance data
  analytics: {
    id: string
    user_id?: string
    campaign_id: string
    platform: string
    metric_type: 'view' | 'click' | 'share' | 'conversion'
    value: number
    recorded_at: Date
  }
}
