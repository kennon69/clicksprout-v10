import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { category, platform } = await request.json()

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 500))

    const hashtags = generateTrendingHashtags(category, platform)

    return NextResponse.json({
      hashtags,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Hashtags API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get trending hashtags' },
      { status: 500 }
    )
  }
}

function generateTrendingHashtags(category: string, platform: string) {
  const baseTags = ['#viral', '#trending', '#fyp', '#explore']
  
  const categoryTags: Record<string, string[]> = {
    tech: ['#innovation', '#gadgets', '#future', '#ai', '#technology'],
    fashion: ['#style', '#ootd', '#fashion', '#trendy', '#outfit'],
    home: ['#homedecor', '#interior', '#diy', '#organization', '#lifestyle'],
    fitness: ['#fitness', '#workout', '#health', '#motivation', '#gym'],
    food: ['#foodie', '#recipe', '#cooking', '#delicious', '#yummy'],
    beauty: ['#beauty', '#skincare', '#makeup', '#selfcare', '#glowup'],
    travel: ['#travel', '#wanderlust', '#adventure', '#vacation', '#explore'],
    business: ['#entrepreneur', '#business', '#success', '#hustle', '#mindset']
  }

  const platformTags: Record<string, string[]> = {
    instagram: ['#insta', '#ig', '#photo', '#picoftheday'],
    tiktok: ['#tiktok', '#fyp', '#viral', '#trending'],
    twitter: ['#twitter', '#tweet', '#breaking', '#news'],
    pinterest: ['#pinterest', '#pin', '#diy', '#inspiration'],
    linkedin: ['#linkedin', '#professional', '#career', '#networking'],
    facebook: ['#facebook', '#community', '#share', '#connect']
  }

  const selectedCategoryTags = categoryTags[category] || categoryTags.tech
  const selectedPlatformTags = platformTags[platform] || []

  return [
    ...baseTags.slice(0, 2),
    ...selectedCategoryTags.slice(0, 3),
    ...selectedPlatformTags.slice(0, 2),
    '#musthave',
    '#amazing',
    '#gameChanger'
  ]
}
