import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

// Initialize OpenAI client only if API key is available
let openai: any = null
try {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai')
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
} catch (error) {
  console.warn('OpenAI not available. Install with: npm install openai')
}

interface ScrapedData {
  title: string
  description: string
  price?: string
  images: string[]
  videos: string[]
  url: string
  marketResearch?: {
    competitorUrls: string[]
    suggestedHashtags: string[]
    targetAudience: string
    priceComparison: string[]
    marketTrends: string[]
  }
}

async function scrapeWebsite(url: string, enableMarketResearch = false): Promise<ScrapedData> {
  try {
    // Enhanced headers to avoid blocking
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }

    console.log('Scraping URL:', url)
    
    // Fetch the webpage with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
      redirect: 'follow'
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Enhanced title extraction
    let title = ''
    const titleSelectors = [
      'h1.product-title',
      'h1[data-testid="product-title"]',
      'h1.pdp-product-name',
      '.product-name h1',
      '.product-title',
      'h1',
      'title',
      '[property="og:title"]',
      '[name="twitter:title"]'
    ]

    for (const selector of titleSelectors) {
      const element = $(selector).first()
      if (element.length) {
        title = element.text().trim() || element.attr('content')?.trim() || ''
        if (title) break
      }
    }

    // Clean up title
    title = title.replace(/\s+/g, ' ').replace(/[^\w\s-]/g, '').trim()

    // Enhanced description extraction
    let description = ''
    const descriptionSelectors = [
      '[property="og:description"]',
      '[name="description"]',
      '[name="twitter:description"]',
      '.product-description',
      '.product-details',
      '.item-description',
      '.description',
      'meta[name="description"]',
      '.product-info p',
      '.product-summary'
    ]

    for (const selector of descriptionSelectors) {
      const element = $(selector).first()
      if (element.length) {
        description = element.text().trim() || element.attr('content')?.trim() || ''
        if (description && description.length > 20) break
      }
    }

    // Enhanced price extraction
    let price = ''
    const priceSelectors = [
      '.price',
      '.product-price',
      '[data-testid*="price"]',
      '.price-current',
      '.a-price-whole',
      '.notranslate',
      '.price-now',
      '.sale-price',
      '[class*="price"]'
    ]

    for (const selector of priceSelectors) {
      const element = $(selector).first()
      if (element.length) {
        const priceText = element.text().trim()
        if (priceText && /\$[\d,.]/.test(priceText)) {
          price = priceText.match(/\$[\d,.]+/)?.[0] || ''
          if (price) break
        }
      }
    }

    // Enhanced image extraction
    const images: string[] = []
    const imageSelectors = [
      '.product-image img',
      '.product-photos img',
      '[data-testid*="image"] img',
      '.gallery img',
      '.product-gallery img',
      'img[alt*="product"]',
      'img[src*="product"]',
      '[property="og:image"]'
    ]

    imageSelectors.forEach((selector: string) => {
      $(selector).each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('content')
        if (src) {
          const fullSrc = src.startsWith('http') ? src : new URL(src, url).href
          if (!images.includes(fullSrc)) {
            images.push(fullSrc)
          }
        }
      })
    })

    // Enhanced video extraction
    const videos: string[] = []
    const videoSelectors = [
      'video source[src]',
      'iframe[src*="youtube"]',
      'iframe[src*="vimeo"]',
      '[property="og:video"]'
    ]

    videoSelectors.forEach((selector: string) => {
      $(selector).each((_, element) => {
        const src = $(element).attr('src') || $(element).attr('content')
        if (src && !videos.includes(src)) {
          videos.push(src)
        }
      })
    })

    // Generate market research if enabled
    let marketResearch: ScrapedData['marketResearch'] = undefined
    if (enableMarketResearch) {
      marketResearch = await generateMarketResearch({ title, description, price, images, videos, url })
    }

    return {
      title: title || 'Product Title',
      description: description || 'Product description not available',
      price: price || undefined,
      images: images.slice(0, 10), // Limit to 10 images
      videos: videos.slice(0, 5),  // Limit to 5 videos
      url,
      marketResearch
    }
  } catch (error) {
    console.error('Scraping error:', error)
    
    // Return fallback data instead of throwing
    return {
      title: 'Product Information',
      description: 'Unable to extract product details from this URL. Please try a different product link or add the information manually.',
      images: [],
      videos: [],
      url
    }
  }
}

async function generateMarketResearch(scrapedData: ScrapedData): Promise<ScrapedData['marketResearch']> {
  try {
    if (!openai || !process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback market research')
      return generateFallbackMarketResearch(scrapedData)
    }

    const prompt = `Based on this product data, generate market research insights:

Product: "${scrapedData.title}"
Description: "${scrapedData.description}"
Price: "${scrapedData.price}"
URL: "${scrapedData.url}"

Provide JSON with:
- competitorUrls: 5 relevant competitor website URLs
- suggestedHashtags: 8-10 trending hashtags for this product
- targetAudience: brief target audience description
- priceComparison: 3-4 price comparison insights
- marketTrends: 3-4 current market trends

Make it realistic and current for 2025.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are a market research expert. Provide realistic, actionable market insights in JSON format." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const aiResponse = completion.choices[0]?.message?.content || ''
    
    try {
      const parsedData = JSON.parse(aiResponse)
      if (parsedData.competitorUrls && parsedData.suggestedHashtags) {
        return parsedData
      }
    } catch (parseError) {
      console.warn('Failed to parse AI market research, using fallback')
    }

  } catch (error) {
    console.error('Market research generation error:', error)
  }

  // Fallback to enhanced market research
  return generateFallbackMarketResearch(scrapedData)
}

function generateFallbackMarketResearch(scrapedData: ScrapedData): ScrapedData['marketResearch'] {
  const productCategory = scrapedData.title.toLowerCase()
  
  let competitorUrls = ['https://amazon.com', 'https://walmart.com', 'https://target.com', 'https://bestbuy.com']
  let baseHashtags = ['#MustHave2025', '#TrendingNow', '#BestDeal', '#QualityFirst']
  
  // Customize based on product category
  if (productCategory.includes('tech') || productCategory.includes('electronic')) {
    competitorUrls = ['https://amazon.com/electronics', 'https://bestbuy.com', 'https://newegg.com', 'https://bhphotovideo.com']
    baseHashtags = ['#TechTrends', '#Innovation', '#GadgetLover', '#TechSavvy', '#FutureTech', '#SmartTech']
  } else if (productCategory.includes('fashion') || productCategory.includes('clothing')) {
    competitorUrls = ['https://amazon.com/fashion', 'https://nordstrom.com', 'https://macys.com', 'https://zara.com']
    baseHashtags = ['#Fashion2025', '#StyleInspo', '#Trendy', '#OOTD', '#FashionTrends', '#StyleGoals']
  } else if (productCategory.includes('health') || productCategory.includes('beauty')) {
    competitorUrls = ['https://ulta.com', 'https://sephora.com', 'https://cvs.com', 'https://walgreens.com']
    baseHashtags = ['#BeautyTrends', '#SelfCare', '#HealthyLifestyle', '#Wellness', '#BeautyTips', '#GlowUp']
  }

  const additionalHashtags = ['#CustomerFavorite', '#TopRated', '#ExclusiveOffer', '#FastShipping']
  
  return {
    competitorUrls: competitorUrls.slice(0, 5),
    suggestedHashtags: [...baseHashtags, ...additionalHashtags].slice(0, 10),
    targetAudience: '25-45 year old consumers interested in quality products and online shopping',
    priceComparison: [
      'Competitive pricing in mid-range segment', 
      'Good value for money compared to premium alternatives', 
      'Premium features at accessible price point',
      'Strong price-to-performance ratio'
    ],
    marketTrends: [
      'Growing online shopping adoption and mobile commerce',
      'Increased focus on product quality and authenticity',
      'Social media influence on purchasing decisions',
      'Demand for fast shipping and easy returns'
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, enableMarketResearch } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const scrapedData = await scrapeWebsite(url, enableMarketResearch)
    
    return NextResponse.json(scrapedData)
  } catch (error) {
    console.error('Scrape API error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape website' },
      { status: 500 }
    )
  }
}
