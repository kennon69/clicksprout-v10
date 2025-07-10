# ClickSprout AI Content Generator Test Documentation

## Overview
The `test-ai-content.js` script is a comprehensive testing suite for ClickSprout's AI content generation capabilities. It validates that the AI can generate high-quality, platform-optimized content for product promotion across multiple social media and professional platforms.

## Features Tested

### 🚀 Core AI Capabilities
- **Content Generation**: Creates engaging titles and descriptions
- **Platform Optimization**: Adapts content style for different platforms
- **Tone Adaptation**: Adjusts voice from casual to professional
- **Hashtag Generation**: Creates relevant, trending hashtags
- **Call-to-Action**: Generates compelling CTAs for conversions

### 📱 Platform Support
- **Instagram**: Visual-focused, casual content with emojis
- **LinkedIn**: Professional tone, business-oriented content
- **Reddit**: Community-friendly, authentic discussions
- **Pinterest**: Inspirational, searchable descriptions
- **General**: Flexible content for any platform

### 🎨 Tone Variations
- **Casual**: Friendly, conversational, emoji-rich
- **Professional**: Business-appropriate, formal language
- **Playful**: Fun, energetic, community-focused
- **Inspiring**: Motivational, aspirational messaging
- **Urgent**: Time-sensitive, action-driving content

### 📏 Length Options
- **Short**: Concise content for quick engagement
- **Medium**: Balanced content with key details
- **Long**: Comprehensive content with full details

## Usage

### Single Test
```bash
node test-ai-content.js
```
Runs a single test with Instagram beauty product content to quickly verify API functionality.

### Comprehensive Test Suite
```bash
node test-ai-content.js -c
# or
node test-ai-content.js --comprehensive
```
Runs multiple test scenarios across different platforms, tones, and content types.

### Help
```bash
node test-ai-content.js --help
```
Shows usage instructions and available options.

## Test Scenarios

### 1. Instagram Beauty Product
- **Product**: Vitamin C Serum
- **Platform**: Instagram
- **Tone**: Casual
- **Expected**: Visual-focused content with beauty hashtags

### 2. LinkedIn Tech Product
- **Product**: Cloud Storage Solution
- **Platform**: LinkedIn
- **Tone**: Professional
- **Expected**: Business-focused content with professional language

### 3. Reddit Gaming Product
- **Product**: Gaming Keyboard
- **Platform**: Reddit
- **Tone**: Playful
- **Expected**: Community-friendly content with gaming terminology

### 4. Pinterest Home Decor
- **Product**: Coffee Table
- **Platform**: Pinterest
- **Tone**: Inspiring
- **Expected**: Aspirational content with home decor hashtags

## Success Criteria

### ✅ Content Quality Validation
- **Title**: Must be > 10 characters and engaging
- **Description**: Must be > 20 characters and informative
- **Hashtags**: Must generate relevant hashtags (minimum 1)
- **Call-to-Action**: Should include compelling action phrases

### 📊 Performance Metrics
- **Success Rate**: Percentage of successful API calls
- **Response Time**: Speed of content generation
- **Content Variety**: Uniqueness across different tests
- **Platform Relevance**: Appropriateness for target platform

## API Response Format

```json
{
  "success": true,
  "data": {
    "title": "Generated product title",
    "description": "Detailed product description",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
    "callToAction": "Shop now and get 20% off!"
  }
}
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure Next.js dev server is running (`npm run dev`)
   - Check if port 3000 is available
   - Verify network connectivity

2. **OpenAI API Error**
   - Check `.env.local` for `OPENAI_API_KEY`
   - Verify API key is valid and has credits
   - Check OpenAI service status

3. **Invalid Response Format**
   - Ensure AI Content Generator API is properly configured
   - Check API route implementation
   - Verify request parameters match expected format

### Debug Mode
Add console logging to see detailed request/response data:
```javascript
console.log('Request:', JSON.stringify(testCase.data, null, 2))
console.log('Response:', JSON.stringify(data, null, 2))
```

## Integration with ClickSprout

This test suite validates the core AI functionality that powers:
- **Content Creation**: Auto-generating promotional content from product links
- **Campaign Management**: Creating platform-specific campaigns
- **Market Research**: Understanding optimal content for different audiences
- **Analytics**: Measuring content performance across platforms

## Contributing

When adding new test scenarios:
1. Follow the existing test case format
2. Include validation for content quality
3. Add appropriate delays between API calls
4. Document expected outcomes
5. Test with realistic product data

## Related Files
- `/src/app/api/ai-content-generator/route.ts` - Main API implementation
- `/src/lib/database.ts` - Database integration
- `/src/contexts/SettingsContext.tsx` - Settings management
- `AI_CONTENT_GENERATOR_DOCS.md` - API documentation
