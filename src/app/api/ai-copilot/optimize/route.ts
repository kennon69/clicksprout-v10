import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, platform, goals } = await request.json()

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200))

    const result = optimizeContent(content, platform, goals)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Content Optimization API Error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize content' },
      { status: 500 }
    )
  }
}

function optimizeContent(content: string, platform: string, goals: string[]) {
  let optimizedContent = content
  const improvements = []
  let score = 60

  // Apply platform-specific optimizations
  if (platform === 'pinterest') {
    optimizedContent = optimizeForPinterest(optimizedContent)
    improvements.push('Optimized for Pinterest visual discovery')
    score += 15
  } else if (platform === 'reddit') {
    optimizedContent = optimizeForReddit(optimizedContent)
    improvements.push('Adapted tone for Reddit community')
    score += 10
  } else if (platform === 'twitter') {
    optimizedContent = optimizeForTwitter(optimizedContent)
    improvements.push('Compressed for Twitter character limit')
    score += 12
  }

  // Apply goal-specific optimizations
  if (goals.includes('engagement')) {
    optimizedContent = addEngagementElements(optimizedContent)
    improvements.push('Added engagement-boosting elements')
    score += 10
  }

  if (goals.includes('conversion')) {
    optimizedContent = addConversionElements(optimizedContent)
    improvements.push('Enhanced call-to-action elements')
    score += 15
  }

  if (goals.includes('viral')) {
    optimizedContent = addViralElements(optimizedContent)
    improvements.push('Integrated viral trigger words')
    score += 20
  }

  return {
    optimizedContent,
    improvements,
    score: Math.min(100, score)
  }
}

function optimizeForPinterest(content: string) {
  // Add Pinterest-specific optimizations
  let optimized = content
  
  if (!optimized.includes('📌')) {
    optimized = '📌 ' + optimized
  }
  
  if (!optimized.toLowerCase().includes('pin')) {
    optimized += ' Save this pin for later!'
  }
  
  return optimized
}

function optimizeForReddit(content: string) {
  // Make content more conversational and authentic
  let optimized = content
  
  // Remove excessive promotional language
  optimized = optimized.replace(/amazing|incredible|revolutionary/gi, 'interesting')
  
  // Add discussion starter
  if (!optimized.includes('?')) {
    optimized += ' What do you think?'
  }
  
  return optimized
}

function optimizeForTwitter(content: string) {
  // Compress content for Twitter
  let optimized = content
  
  if (optimized.length > 250) {
    optimized = optimized.substring(0, 240) + '...'
  }
  
  // Add Twitter-specific elements
  if (!optimized.includes('#')) {
    optimized += ' #trending'
  }
  
  return optimized
}

function addEngagementElements(content: string) {
  let optimized = content
  
  // Add engaging elements
  if (!optimized.includes('🔥') && !optimized.includes('⚡') && !optimized.includes('🚀')) {
    optimized = '🔥 ' + optimized
  }
  
  // Add question to encourage interaction
  if (!optimized.includes('?')) {
    optimized += ' Which one would you choose?'
  }
  
  return optimized
}

function addConversionElements(content: string) {
  let optimized = content
  
  // Add urgency
  if (!optimized.toLowerCase().includes('limited') && !optimized.toLowerCase().includes('hurry')) {
    optimized += ' Limited time offer!'
  }
  
  // Add social proof
  if (!optimized.toLowerCase().includes('customers') && !optimized.toLowerCase().includes('reviews')) {
    optimized += ' Join thousands of satisfied customers.'
  }
  
  return optimized
}

function addViralElements(content: string) {
  let optimized = content
  
  // Add viral trigger words
  const viralWords = ['breakthrough', 'secret', 'revealed', 'shocking', 'incredible']
  const randomWord = viralWords[Math.floor(Math.random() * viralWords.length)]
  
  if (!viralWords.some(word => optimized.toLowerCase().includes(word))) {
    optimized = `${randomWord.charAt(0).toUpperCase() + randomWord.slice(1)}: ${optimized}`
  }
  
  return optimized
}
