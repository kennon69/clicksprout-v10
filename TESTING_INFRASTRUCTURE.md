# ClickSprout Testing Infrastructure

## Overview
ClickSprout includes a comprehensive testing suite to validate all core functionality during development and deployment. The testing infrastructure ensures that AI content generation, database integration, and API endpoints work correctly.

## Test Scripts

### 🧪 AI Content Generator Test (`test-ai-content.js`)
Tests the core AI functionality that powers ClickSprout's content generation.

```bash
# Single test
npm run test:ai

# Comprehensive test suite
npm run test:ai:full

# Direct usage
node test-ai-content.js
node test-ai-content.js -c
```

**Features Tested:**
- Content generation for multiple platforms
- Tone adaptation (casual, professional, playful, inspiring)
- Hashtag generation
- Call-to-action creation
- Platform-specific optimization

### 🔧 Development Test Suite (`dev-test.js`)
Comprehensive testing for all ClickSprout systems.

```bash
# Full test suite
npm run test:dev

# Individual components
npm run test:db    # Database only
npm run test:api   # API health only

# Direct usage
node dev-test.js
node dev-test.js --db-only
node dev-test.js --api-only
```

**Systems Tested:**
- API endpoint health
- Database connectivity
- AI content generation
- Settings management

## Test Scenarios

### AI Content Generation
Tests content creation for different product types:

1. **Instagram Beauty Product**
   - Vitamin C serum with casual tone
   - Visual-focused content with beauty hashtags

2. **LinkedIn Tech Product**
   - Cloud storage with professional tone
   - Business-focused content with technical terms

3. **Reddit Gaming Product**
   - Gaming keyboard with playful tone
   - Community-friendly content with gaming terminology

4. **Pinterest Home Decor**
   - Coffee table with inspiring tone
   - Aspirational content with home decor hashtags

### Database Integration
- Content record CRUD operations
- Campaign management
- Template library access
- Analytics data storage

### API Health Checks
- `/api/content` - Content management
- `/api/campaigns` - Campaign operations
- `/api/scheduler` - Post scheduling
- `/api/ai-content-generator` - AI content creation

## Success Criteria

### Content Quality Validation
- **Title**: Engaging and > 10 characters
- **Description**: Informative and > 20 characters
- **Hashtags**: Relevant hashtags generated
- **Call-to-Action**: Compelling action phrases

### Performance Metrics
- **Response Time**: < 30 seconds for AI generation
- **Success Rate**: > 95% for API calls
- **Content Variety**: Unique content across tests
- **Platform Relevance**: Appropriate for target platform

## Troubleshooting

### Common Issues

#### API Connection Failed
```bash
# Check if server is running
npm run dev

# Verify port availability
netstat -an | findstr :3000
```

#### OpenAI API Error
```bash
# Check environment variables
echo $OPENAI_API_KEY

# Verify API key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

#### Database Connection Issues
```bash
# Test database configuration
npm run test:db

# Check Supabase credentials
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Debug Mode
Enable detailed logging by setting environment variable:
```bash
DEBUG=1 npm run test:dev
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: ClickSprout Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:api
      - run: npm run test:ai
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Pre-deployment Checklist
```bash
# 1. Run full test suite
npm run test:dev

# 2. Test AI content generation
npm run test:ai:full

# 3. Verify all APIs
npm run test:api

# 4. Check database connectivity
npm run test:db
```

## Monitoring and Analytics

### Test Results Tracking
- Success/failure rates
- Response time metrics
- Content quality scores
- Platform-specific performance

### Performance Benchmarks
- AI Generation: < 30s response time
- Database Operations: < 5s response time
- API Health: > 99% uptime
- Content Quality: > 90% pass rate

## Contributing

### Adding New Tests
1. Follow existing test case format
2. Include proper validation
3. Add appropriate error handling
4. Document expected outcomes
5. Test with realistic data

### Test Data Guidelines
- Use realistic product information
- Include edge cases
- Test with various content lengths
- Validate all platforms

## Related Documentation
- `AI_CONTENT_GENERATOR_DOCS.md` - API documentation
- `AI_CONTENT_TEST_DOCS.md` - Detailed test documentation
- `DATABASE_INTEGRATION.md` - Database setup guide
- `.env.example` - Environment configuration
