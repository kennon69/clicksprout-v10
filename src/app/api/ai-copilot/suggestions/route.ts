import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { content, context } = await request.json()

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    const suggestions = generateSuggestions(content, context)

    return NextResponse.json({
      suggestions,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('AI Suggestions API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

type SuggestionType = 'headline' | 'description' | 'hashtag' | 'cta';

function generateSuggestions(content: string, context: any) {
  const { type, platform = 'general' } = context

  const suggestionTemplates: Record<SuggestionType, any[]> = {
    headline: [
      {
        id: `headline-${Date.now()}-1`,
        type: 'headline',
        content: `🚀 ${content} - Revolutionary Innovation Alert!`,
        score: Math.floor(Math.random() * 20) + 80,
        platform,
        reasoning: 'Rocket emoji and power words increase engagement by 40%'
      },
      {
        id: `headline-${Date.now()}-2`,
        type: 'headline',
        content: `Finally! The ${content} Everyone's Been Waiting For`,
        score: Math.floor(Math.random() * 20) + 75,
        platform,
        reasoning: 'Creates anticipation and universal appeal'
      },
      {
        id: `headline-${Date.now()}-3`,
        type: 'headline',
        content: `This ${content} Will Change Everything (Here's Why)`,
        score: Math.floor(Math.random() * 20) + 70,
        platform,
        reasoning: 'Transformation promise with curiosity gap'
      }
    ],
    description: [
      {
        id: `desc-${Date.now()}-1`,
        type: 'description',
        content: `Don't scroll past this! ${content} is taking the world by storm and here's why it's the #1 choice for smart shoppers. Limited time offer - grab yours before it's gone!`,
        score: Math.floor(Math.random() * 20) + 80,
        platform,
        reasoning: 'Combines attention-grabbing, social proof, and urgency'
      },
      {
        id: `desc-${Date.now()}-2`,
        type: 'description',
        content: `Breaking: ${content} just dropped and it's already selling out everywhere. Here's what makes it so special and why everyone's talking about it...`,
        score: Math.floor(Math.random() * 20) + 75,
        platform,
        reasoning: 'News angle with scarcity and social proof'
      }
    ],
    hashtag: [
      {
        id: `hashtag-${Date.now()}-1`,
        type: 'hashtag',
        content: '#viral #trending #musthave #gameChanger #innovation #takingOver',
        score: Math.floor(Math.random() * 20) + 85,
        platform,
        reasoning: 'Trending hashtags with viral potential'
      },
      {
        id: `hashtag-${Date.now()}-2`,
        type: 'hashtag',
        content: '#breakthrough #revolutionary #nextLevel #mindBlown #futureIsNow',
        score: Math.floor(Math.random() * 20) + 80,
        platform,
        reasoning: 'Innovation-focused hashtags for early adopters'
      }
    ],
    cta: [
      {
        id: `cta-${Date.now()}-1`,
        type: 'cta',
        content: 'Get yours now before it sells out! 🔥',
        score: Math.floor(Math.random() * 20) + 90,
        platform,
        reasoning: 'Urgency with fire emoji increases clicks by 35%'
      },
      {
        id: `cta-${Date.now()}-2`,
        type: 'cta',
        content: 'Claim your spot - limited quantities available!',
        score: Math.floor(Math.random() * 20) + 85,
        platform,
        reasoning: 'Exclusive access angle with scarcity'
      }
    ]
  }
  
  return suggestionTemplates[type as SuggestionType] || []
}
