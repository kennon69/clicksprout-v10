import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { headline, description, hashtags, platform } = await request.json()

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800))

    const score = calculateViralScore(headline, description, hashtags, platform)

    return NextResponse.json({
      score,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Viral Score API Error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate viral score' },
      { status: 500 }
    )
  }
}

function calculateViralScore(headline: string, description: string, hashtags: string[], platform: string) {
  // Simulate AI-powered scoring algorithm
  let engagementScore = 50
  let shareabilityScore = 50
  let conversionScore = 50
  let platformOptimization = 50
  
  const feedback = []

  // Analyze headline
  if (headline) {
    if (headline.includes('🚀') || headline.includes('🔥') || headline.includes('⚡')) {
      engagementScore += 15
      feedback.push('Great use of engaging emojis in headline')
    }
    
    if (headline.toLowerCase().includes('finally') || headline.toLowerCase().includes('revolutionary')) {
      shareabilityScore += 20
      feedback.push('Strong emotional triggers detected')
    }
    
    if (headline.length > 60) {
      conversionScore -= 10
      feedback.push('Consider shortening headline for better conversion')
    }
  }

  // Analyze description
  if (description) {
    if (description.toLowerCase().includes('limited') || description.toLowerCase().includes('don\'t miss')) {
      conversionScore += 20
      feedback.push('Effective urgency elements found')
    }
    
    if (description.includes('!')) {
      engagementScore += 10
      feedback.push('Exclamation points boost engagement')
    }
    
    if (description.length > 200) {
      shareabilityScore -= 5
      feedback.push('Long descriptions may reduce shareability')
    }
  }

  // Analyze hashtags
  if (hashtags && hashtags.length > 0) {
    const hashtagText = hashtags.join(' ').toLowerCase()
    if (hashtagText.includes('viral') || hashtagText.includes('trending')) {
      shareabilityScore += 15
      feedback.push('Viral hashtags increase discoverability')
    }
    
    if (hashtags.length > 10) {
      platformOptimization -= 10
      feedback.push('Too many hashtags may look spammy')
    }
  }

  // Platform-specific optimizations
  if (platform === 'pinterest') {
    if (hashtags.length >= 3) {
      platformOptimization += 20
      feedback.push('Good hashtag count for Pinterest')
    }
  } else if (platform === 'twitter') {
    if (headline.length <= 140) {
      platformOptimization += 15
      feedback.push('Perfect length for Twitter')
    }
  }

  // Ensure scores are within bounds
  engagementScore = Math.max(0, Math.min(100, engagementScore))
  shareabilityScore = Math.max(0, Math.min(100, shareabilityScore))
  conversionScore = Math.max(0, Math.min(100, conversionScore))
  platformOptimization = Math.max(0, Math.min(100, platformOptimization))

  const overall = Math.round((engagementScore + shareabilityScore + conversionScore + platformOptimization) / 4)

  return {
    overall,
    engagement: engagementScore,
    shareability: shareabilityScore,
    conversion: conversionScore,
    platformOptimization,
    feedback
  }
}
