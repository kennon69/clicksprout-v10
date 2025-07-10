import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with proper error handling
let openai: OpenAI | null = null

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
} catch (error) {
  console.warn('OpenAI initialization failed:', error)
}

interface ContentGeneratorRequest {
  title: string
  description: string
  type?: 'social' | 'product' | 'marketing' | 'ad'
  platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'reddit'
  tone?: 'casual' | 'professional' | 'playful' | 'urgent' | 'inspiring'
  length?: 'short' | 'medium' | 'long'
}

interface ContentGeneratorResponse {
  result: string
  hashtags?: string[]
  suggestions?: string[]
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: ContentGeneratorRequest = await request.json()
    const { 
      title, 
      description, 
      type = 'social', 
      platform = 'instagram', 
      tone = 'casual',
      length = 'medium'
    } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Check if OpenAI is available
    if (!openai || !process.env.OPENAI_API_KEY) {
      // Return fallback content with a note about missing API key
      const fallbackContent = generateFallbackContent(title, description, platform)
      
      return NextResponse.json({
        result: fallbackContent,
        error: 'OpenAI API key not configured. Using fallback content.',
        hashtags: generateFallbackHashtags(title, platform)
      }, { status: 200 })
    }

    // Create dynamic prompt based on parameters
    const systemPrompt = `You are an expert content creator and marketing copywriter specializing in viral social media content. You understand current trends, platform-specific best practices, and how to create engaging content that drives conversions.

Key Guidelines:
- Always include relevant emojis
- Focus on benefits and value proposition
- Include compelling call-to-action
- Make content shareable and engaging
- Follow platform-specific best practices`

    const lengthGuide = {
      short: '1-2 sentences, very concise',
      medium: '2-4 sentences, balanced detail',
      long: '4+ sentences, comprehensive detail'
    }

    const platformGuide = {
      instagram: 'Include 8-12 relevant hashtags at the end',
      facebook: 'Conversational and community-focused',
      twitter: 'Keep concise, under 280 characters if possible',
      linkedin: 'Professional but engaging tone',
      pinterest: 'Focus on inspiration and visual appeal',
      reddit: 'Authentic and community-oriented'
    }

    const userPrompt = `Create ${length} ${type} content for ${platform} with a ${tone} tone.

Product: "${title}"
Description: "${description}"

Length: ${lengthGuide[length]}
Platform: ${platformGuide[platform]}
Tone: ${tone}

Generate compelling promotional content that will grab attention and drive engagement. Make it feel natural and authentic for the platform.`

    // Generate content with OpenAI GPT-4 Turbo
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8, // Higher creativity for marketing content
      max_tokens: 1000,
      top_p: 0.9,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated from OpenAI')
    }

    // Extract hashtags if present
    const hashtagRegex = /#[\w\d_]+/g
    const hashtags = generatedContent.match(hashtagRegex) || []

    // Generate alternative suggestions
    let suggestions: string[] = []
    try {
      const suggestionsPrompt = `Based on this ${platform} content: "${generatedContent.substring(0, 200)}..."

Provide 3 alternative opening lines or headlines that could be used instead. Make them catchy and ${tone} for ${platform}. Return only the alternatives, one per line.`

      const suggestionsCompletion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: "You are a creative copywriter. Return only the alternative lines, no numbering or extra text." },
          { role: "user", content: suggestionsPrompt }
        ],
        temperature: 0.9,
        max_tokens: 200,
      })

      suggestions = suggestionsCompletion.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim())
        .slice(0, 3) || []
    } catch (error) {
      console.warn('Failed to generate suggestions:', error)
    }

    const response: ContentGeneratorResponse = {
      result: generatedContent,
      hashtags: hashtags.length > 0 ? hashtags : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Content generation error:', error)

    // Get title and description for fallback
    let title = 'Amazing Product'
    let description = 'A great product you\'ll love'
    let platform = 'instagram'
    
    try {
      const body = await request.json()
      title = body.title || title
      description = body.description || description
      platform = body.platform || platform
    } catch (e) {
      // Use defaults if request parsing fails
    }
    
    const fallbackContent = generateFallbackContent(title, description, platform)

    return NextResponse.json({
      result: fallbackContent,
      error: `AI generation failed: ${error.message}`,
      hashtags: generateFallbackHashtags(title, platform)
    }, { status: 200 })
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'AI Content Generator API - Fixed OpenAI SDK Implementation',
    version: 'v1.1 - Latest OpenAI SDK',
    description: 'Send a POST request with title and description to generate promotional content',
    example: {
      title: 'Summer Glow Serum',
      description: 'A lightweight hydrating facial serum with vitamin C and SPF 30',
      type: 'social',
      platform: 'instagram',
      tone: 'casual',
      length: 'medium'
    },
    supported_platforms: ['instagram', 'facebook', 'twitter', 'linkedin', 'pinterest', 'reddit'],
    supported_tones: ['casual', 'professional', 'playful', 'urgent', 'inspiring'],
    supported_lengths: ['short', 'medium', 'long'],
    api_status: openai ? 'OpenAI Connected' : 'Fallback Mode (No API Key)'
  })
}

// Helper function to generate fallback content
function generateFallbackContent(title: string, description: string, platform: string): string {
  const templates = {
    instagram: `✨ **${title}** ✨

${description}

🌟 Transform your routine with this amazing product! Perfect for anyone looking to upgrade their lifestyle and experience something truly special.

🔥 Why you'll love it:
• Premium quality you can trust
• Perfect for everyday use
• Amazing value for money
• Join thousands of happy customers

Ready to elevate your experience? Get yours today! 💫

#${title.replace(/\s+/g, '')} #MustHave #QualityFirst #ShopNow #Innovation #LifestyleUpgrade #NewProduct #Trending #LimitedTime #Transform`,

    facebook: `🎉 Introducing ${title}! 

${description}

This is exactly what you've been looking for! Our customers love how this product fits perfectly into their daily routine and delivers amazing results.

✅ What makes it special:
• Carefully crafted with attention to detail
• Designed for real people with real needs
• Backed by our satisfaction guarantee

Don't wait - join our community of happy customers today! Share this with friends who would love it too! 💕`,

    twitter: `🚀 ${title} is here! 

${description}

The upgrade your routine deserves ✨ #NewProduct #MustHave`,

    linkedin: `Introducing ${title} - ${description}

In today's fast-paced world, quality and reliability matter more than ever. This product represents innovation meeting practical needs, designed for professionals who demand excellence.

Key benefits include enhanced functionality, proven results, and exceptional value. Join industry leaders who trust our solutions.

#Innovation #Quality #Professional`,

    pinterest: `💡 ${title} Inspiration

${description}

✨ Perfect for creating the lifestyle you've always wanted
🌟 High-quality design meets functionality  
💫 Transform your space and routine
🎯 Curated for style-conscious individuals

Save this pin and make it yours! #${title.replace(/\s+/g, '')} #Lifestyle #Inspiration`,

    reddit: `Found something awesome: ${title}

${description}

I've been using this for a while now and honestly, it's been a game-changer. The quality is solid and it does exactly what it promises. No BS marketing - just a genuinely good product.

Anyone else tried this? Would love to hear your experiences!`
  }

  return templates[platform as keyof typeof templates] || templates.instagram
}

// Helper function to generate fallback hashtags
function generateFallbackHashtags(title: string, platform: string): string[] {
  const baseHashtags = [
    `#${title.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`,
    '#MustHave',
    '#QualityFirst', 
    '#ShopNow',
    '#NewProduct'
  ]

  const platformHashtags = {
    instagram: [...baseHashtags, '#Trending', '#Innovation', '#LifestyleUpgrade', '#Transform', '#LimitedTime'],
    facebook: [...baseHashtags, '#Community', '#Share', '#Love'],
    twitter: [...baseHashtags, '#Tech', '#Update'],
    linkedin: [...baseHashtags, '#Professional', '#Innovation', '#Quality'],
    pinterest: [...baseHashtags, '#Inspiration', '#Lifestyle', '#Design'],
    reddit: [...baseHashtags, '#Review', '#Experience']
  }

  return platformHashtags[platform as keyof typeof platformHashtags] || baseHashtags
}
