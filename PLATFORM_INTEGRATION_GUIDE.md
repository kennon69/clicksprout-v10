# ClickSprout Platform Integration Setup Guide

## 🚀 Overview
ClickSprout now supports posting and scheduling content to major social media platforms:
- Reddit
- Medium  
- Twitter (X)
- Pinterest
- Facebook
- LinkedIn

## 📋 Prerequisites
1. Next.js development server running (`npm run dev`)
2. Account access to platforms you want to integrate
3. API keys and access tokens for each platform

## 🔧 Installation

### 1. Install Dependencies
```bash
node install-platform-deps.js
```

### 2. Environment Setup
```bash
# Copy environment template
copy .env.local.example .env.local

# Edit .env.local with your API keys
notepad .env.local
```

## 🔑 API Keys Setup

### Reddit API
1. Go to https://www.reddit.com/prefs/apps
2. Create a new app (script type)
3. Get your client ID and secret
4. Add to `.env.local`:
```
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

### Medium API
1. Go to https://medium.com/me/settings
2. Scroll to "Integration tokens"
3. Create a new token
4. Add to `.env.local`:
```
MEDIUM_ACCESS_TOKEN=your_access_token
```

### Twitter API
1. Go to https://developer.twitter.com/
2. Create a new app
3. Generate API keys and tokens
4. Add to `.env.local`:
```
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

### Pinterest API
1. Go to https://developers.pinterest.com/
2. Create a new app
3. Generate access token
4. Add to `.env.local`:
```
PINTEREST_ACCESS_TOKEN=your_access_token
```

### Facebook API
1. Go to https://developers.facebook.com/
2. Create a new app
3. Get page access token
4. Add to `.env.local`:
```
FACEBOOK_ACCESS_TOKEN=your_access_token
FACEBOOK_PAGE_ID=your_page_id
```

## 🧪 Testing

### 1. Test Platform Connections
```bash
node test-platform-integration.js
```

### 2. Test in Browser
1. Go to http://localhost:3000/scheduler
2. Click "Test All" in the Platform Connection Test section
3. Verify all platforms show "Connected" status

### 3. Test Posting
1. Create content in the editor
2. Go to scheduler
3. Select platforms
4. Click "Post Now" for immediate posting
5. Or set a schedule time and click "Schedule Posts"

## 🏗️ Architecture

### API Routes
- `/api/post/[platform]` - Post content to specific platform
- `/api/test-platform` - Test platform connections
- `/api/schedule-manager` - Manage scheduled posts
- `/api/analytics` - Get post analytics

### Core Components
- `PlatformAPI` - Base class for platform integrations
- `PostScheduler` - Handles post scheduling and execution
- `PlatformTester` - Tests platform connections
- `PlatformFactory` - Creates platform instances

### Database Schema
```sql
-- Posts table
CREATE TABLE posts (
  id VARCHAR PRIMARY KEY,
  title TEXT,
  content TEXT,
  images TEXT[],
  hashtags TEXT[],
  platform VARCHAR,
  scheduled_time TIMESTAMP,
  status VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  platform_post_id VARCHAR,
  url TEXT,
  error TEXT
);

-- Analytics table
CREATE TABLE post_analytics (
  post_id VARCHAR,
  platform VARCHAR,
  views INTEGER,
  clicks INTEGER,
  likes INTEGER,
  shares INTEGER,
  comments INTEGER,
  engagement INTEGER,
  last_updated TIMESTAMP,
  PRIMARY KEY (post_id, platform)
);
```

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check API keys in `.env.local`
   - Verify platform permissions
   - Check rate limits

2. **Posts Not Scheduling**
   - Ensure development server is running
   - Check database connection
   - Verify content format

3. **Platform Not Supported**
   - Check platform ID matches factory
   - Verify API implementation
   - Check environment variables

### Debug Mode
Set `DEBUG=true` in `.env.local` for detailed logging.

## 📊 Analytics

### Available Metrics
- Views/Impressions
- Clicks
- Likes/Reactions
- Shares/Retweets
- Comments
- Engagement Rate

### Analytics API
```javascript
// Get analytics for a post
const response = await fetch('/api/analytics?platform=twitter&postId=123')
const analytics = await response.json()
```

## 🚀 Production Deployment

### 1. Environment Variables
Set all required environment variables in your hosting platform.

### 2. Database Setup
Ensure your database has the required tables (see schema above).

### 3. Cron Jobs
For scheduled posts, ensure your hosting platform supports background jobs.

### 4. Rate Limiting
Implement rate limiting for API endpoints to prevent abuse.

## 📝 Usage Examples

### Schedule a Post
```javascript
const postData = {
  title: "My Post Title",
  content: "My post content",
  images: ["https://example.com/image.jpg"],
  hashtags: ["#marketing", "#social"],
  platform: "twitter",
  scheduledTime: "2024-01-01T12:00:00Z"
}

await fetch('/api/schedule-manager', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'schedule', postData })
})
```

### Post Immediately
```javascript
await fetch('/api/post/twitter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(postData)
})
```

## 🎯 Best Practices

1. **Content Optimization**
   - Customize content for each platform
   - Use appropriate hashtags
   - Optimize image sizes

2. **Scheduling**
   - Consider time zones
   - Avoid peak hours for better engagement
   - Space out posts appropriately

3. **Analytics**
   - Monitor performance regularly
   - Adjust strategy based on data
   - Track engagement rates

4. **Security**
   - Keep API keys secure
   - Use environment variables
   - Implement rate limiting

## 📚 Resources

- [Reddit API Documentation](https://www.reddit.com/dev/api/)
- [Medium API Documentation](https://github.com/Medium/medium-api-docs)
- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [Pinterest API Documentation](https://developers.pinterest.com/docs/)
- [Facebook API Documentation](https://developers.facebook.com/docs/)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review API documentation
3. Test with the provided testing scripts
4. Check browser console for errors

---

**🎉 Congratulations! Your ClickSprout platform integration is now ready to use.**
