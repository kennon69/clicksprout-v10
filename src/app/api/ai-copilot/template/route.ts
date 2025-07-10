import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { productInfo, targetPlatform } = await request.json()

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200))

    const template = generateAITemplate(productInfo, targetPlatform)

    return NextResponse.json({
      template,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Template API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}

function generateAITemplate(productInfo: any, platform: string) {
  const templates = {
    pinterest: {
      id: 'pinterest-viral',
      name: 'Pinterest Viral Product',
      description: 'Optimized for Pinterest discovery and saves',
      category: 'product-showcase',
      platforms: ['pinterest'],
      structure: {
        headline: `📌 ${productInfo.title} - Everyone's Pinning This!`,
        description: `This ${productInfo.category} is taking Pinterest by storm! 🔥 Get yours before it's gone. Save this pin for later! #PinterestFinds #MustHave`,
        hashtags: ['#pinterest', '#viral', '#trending', '#musthave', '#savethispin'],
        cta: 'Pin it now and grab yours!'
      },
      viralScore: 92
    },
    instagram: {
      id: 'instagram-story',
      name: 'Instagram Story Teaser',
      description: 'Perfect for Instagram stories and reels',
      category: 'social-proof',
      platforms: ['instagram'],
      structure: {
        headline: `🚀 ${productInfo.title} - The Internet's Obsession`,
        description: `Why is everyone talking about this ${productInfo.category}? Swipe up to see why it's going viral! Stories like this don't last long 👀`,
        hashtags: ['#instagram', '#viral', '#trending', '#internetobsession', '#swipeup'],
        cta: 'Swipe up to see the hype!'
      },
      viralScore: 88
    },
    tiktok: {
      id: 'tiktok-trending',
      name: 'TikTok Trending Template',
      description: 'Designed for TikTok FYP algorithm',
      category: 'trending-content',
      platforms: ['tiktok'],
      structure: {
        headline: `POV: You found the ${productInfo.title} everyone's talking about`,
        description: `The algorithm brought you here for a reason 👀 This ${productInfo.category} is breaking the internet and here's why... #fyp #viral`,
        hashtags: ['#fyp', '#viral', '#trending', '#tiktok', '#algorithm'],
        cta: 'Follow for more viral finds!'
      },
      viralScore: 95
    },
    twitter: {
      id: 'twitter-thread',
      name: 'Twitter Thread Starter',
      description: 'Optimized for Twitter engagement',
      category: 'thread-starter',
      platforms: ['twitter'],
      structure: {
        headline: `🧵 THREAD: Why ${productInfo.title} is trending everywhere`,
        description: `Everyone's talking about this ${productInfo.category}. Here's why it's worth the hype (and why you need it): 1/7 🧵`,
        hashtags: ['#twitter', '#thread', '#trending', '#review', '#viral'],
        cta: 'RT if you want one too!'
      },
      viralScore: 85
    },
    linkedin: {
      id: 'linkedin-professional',
      name: 'LinkedIn Professional Post',
      description: 'Professional angle for LinkedIn audience',
      category: 'professional-insight',
      platforms: ['linkedin'],
      structure: {
        headline: `Why ${productInfo.title} is revolutionizing the ${productInfo.category} industry`,
        description: `As someone who's been following industry trends, I've been impressed by how ${productInfo.title} addresses key pain points. Here's my professional take on why this matters:`,
        hashtags: ['#innovation', '#industry', '#professional', '#review', '#technology'],
        cta: 'What are your thoughts? Share below.'
      },
      viralScore: 78
    }
  }

  const defaultTemplate = {
    id: 'general-viral',
    name: 'General Viral Template',
    description: 'Universal viral content template',
    category: 'general',
    platforms: ['general'],
    structure: {
      headline: `🔥 ${productInfo.title} - This Changes Everything!`,
      description: `I wasn't expecting this ${productInfo.category} to be THIS good... but here we are! 🤯 If you're looking for something that actually works, this is it.`,
      hashtags: ['#viral', '#trending', '#musthave', '#gameChanger', '#amazing'],
      cta: 'Get yours before everyone else does!'
    },
    viralScore: 82
  }

  return templates[platform as keyof typeof templates] || defaultTemplate
}
