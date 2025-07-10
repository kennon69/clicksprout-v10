# AI Content Generator API

## Overview
The AI Content Generator is a powerful endpoint that uses OpenAI's GPT-4 to create engaging promotional content for products and services across different social media platforms.

## Endpoint
```
POST /api/ai-content-generator
```

## Features
✅ **Latest OpenAI SDK** - Uses `openai@4.28.0` with modern ES module syntax  
✅ **Multi-Platform Support** - Optimized for Instagram, Facebook, Twitter, LinkedIn, Pinterest, Reddit  
✅ **Customizable Tone** - Casual, professional, playful, urgent, inspiring  
✅ **Variable Length** - Short, medium, long content options  
✅ **Hashtag Extraction** - Automatically extracts and returns hashtags  
✅ **Alternative Suggestions** - Provides 3 alternative headlines/openings  
✅ **Graceful Fallbacks** - Works even without OpenAI API key configured  

## Request Format

### Required Fields
```json
{
  "title": "Product/Service Name",
  "description": "Brief description of the product/service"
}
```

### Optional Parameters
```json
{
  "title": "Summer Glow Serum",
  "description": "A lightweight hydrating facial serum with vitamin C and SPF 30",
  "type": "social",          // "social" | "product" | "marketing" | "ad"
  "platform": "instagram",   // "instagram" | "facebook" | "twitter" | "linkedin" | "pinterest" | "reddit"
  "tone": "casual",          // "casual" | "professional" | "playful" | "urgent" | "inspiring"
  "length": "medium"         // "short" | "medium" | "long"
}
```

## Response Format

### Success Response
```json
{
  "result": "🌟 **Summer Glow Serum** ✨\n\nGet ready to glow like never before! ☀️ This lightweight hydrating serum is packed with vitamin C goodness and SPF 30 protection...",
  "hashtags": ["#SummerGlow", "#SkincareRoutine", "#VitaminC", "#SPF30"],
  "suggestions": [
    "Ready to unlock your summer glow? ✨",
    "Transform your skin with this game-changing serum! 🌟", 
    "The secret to radiant skin is finally here! ☀️"
  ]
}
```

### Error Response
```json
{
  "error": "Title and description are required",
  "result": "Fallback content provided when API fails..."
}
```

## Platform-Specific Optimizations

### Instagram
- Includes 8-12 relevant hashtags
- Emoji-rich content
- Visual appeal focus
- Story-friendly format

### Twitter/X  
- Keeps under 280 characters when possible
- Punchy, shareable format
- Trending hashtag integration

### LinkedIn
- Professional yet engaging tone
- Business-focused language
- Industry-relevant keywords

### Pinterest
- Inspiration-focused content
- Visual appeal emphasis
- Aspirational language

### Reddit
- Authentic, community-focused
- Less promotional tone
- Value-driven content

## Usage Examples

### Basic Usage
```javascript
const response = await fetch('/api/ai-content-generator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Summer Glow Serum",
    description: "A lightweight hydrating facial serum with vitamin C and SPF 30"
  })
})

const result = await response.json()
console.log(result.result) // Generated content
```

### Advanced Usage with All Parameters
```javascript
const response = await fetch('/api/ai-content-generator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Premium Coffee Beans",
    description: "Single-origin artisan coffee beans roasted to perfection",
    type: "marketing",
    platform: "pinterest",
    tone: "inspiring", 
    length: "long"
  })
})
```

### Integration with React Components
```jsx
const [content, setContent] = useState('')
const [loading, setLoading] = useState(false)

const generateContent = async (productData) => {
  setLoading(true)
  try {
    const response = await fetch('/api/ai-content-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    const result = await response.json()
    setContent(result.result)
  } catch (error) {
    console.error('Generation failed:', error)
  } finally {
    setLoading(false)
  }
}
```

## Configuration

### Environment Variables
Add to your `.env.local` file:
```bash
# Required for AI-powered generation
OPENAI_API_KEY=your_openai_api_key_here
```

### Getting an OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new secret key
5. Add it to your environment variables

## Error Handling

The API includes comprehensive error handling:

1. **Missing API Key**: Returns fallback content with helpful error message
2. **Invalid Request**: Returns 400 with validation error
3. **API Failures**: Graceful fallback to pre-generated content
4. **Rate Limits**: Automatic retry with exponential backoff

## Testing

Use the included test client:
```bash
node test-ai-content-generator.js
```

Or test directly in the browser console:
```javascript
// Copy the test function from test-ai-content-generator.js
testAIContentGenerator()
```

## Performance

- **Response Time**: ~2-5 seconds for AI generation
- **Fallback Time**: <100ms for fallback content
- **Rate Limits**: Respects OpenAI's rate limits
- **Caching**: Consider implementing Redis caching for production

## Best Practices

1. **Always provide descriptive titles and descriptions**
2. **Choose the right platform for your audience** 
3. **Match tone to your brand voice**
4. **Test different lengths for engagement**
5. **Use generated hashtags strategically**
6. **A/B test the alternative suggestions**

## Integration with ClickSprout

This API works seamlessly with other ClickSprout features:
- Product URL scraping → AI content generation
- Market research → Targeted content creation  
- Multi-platform scheduling → Platform-optimized content
- Analytics → Performance tracking of generated content
