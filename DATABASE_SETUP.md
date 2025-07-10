# 🗄️ Database Setup Guide for ClickSprout v1.0

## Quick Start with Supabase (Recommended)

Supabase is the easiest option for getting started with a production database.

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### 2. Set Up Database Tables
Run this SQL in your Supabase SQL Editor:

```sql
-- Content table for scraped and generated content
CREATE TABLE content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  generated_content TEXT,
  hashtags TEXT[] DEFAULT '{}',
  market_research JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table for managing marketing campaigns
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content_id UUID REFERENCES content(id),
  platforms TEXT[] NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  posted BOOLEAN DEFAULT FALSE,
  budget INTEGER,
  ab_test_enabled BOOLEAN DEFAULT FALSE,
  ab_variants JSONB,
  market_research JSONB,
  performance_forecast JSONB,
  optimization_enabled BOOLEAN DEFAULT FALSE,
  stats JSONB DEFAULT '{"views": 0, "clicks": 0, "shares": 0, "conversions": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled posts table for content scheduling
CREATE TABLE scheduled_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'failed')),
  posted_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content templates table for reusable content
CREATE TABLE content_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_content_created_at ON content(created_at DESC);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX idx_scheduled_posts_scheduled_time ON scheduled_posts(scheduled_time);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_content_templates_created_at ON content_templates(created_at DESC);

-- Enable Row Level Security (RLS) for multi-user support (optional)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (customize for authentication later)
CREATE POLICY "Allow all operations" ON content FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON scheduled_posts FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON content_templates FOR ALL USING (true);
```

### 3. Get Your API Keys
1. Go to Project Settings → API
2. Copy your Project URL and Anon Key
3. Add them to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Test the Connection
```bash
npm run dev
```

Go to the Submit page and try scraping a URL. The content should now be saved to your Supabase database!

## Alternative Database Options

### Firebase
1. Create a Firebase project
2. Enable Firestore
3. Set up collections: `content`, `campaigns`, `scheduled_posts`, `content_templates`
4. Add Firebase config to `.env.local`

### MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Add to `.env.local`: `MONGODB_URI=your_connection_string`

### PostgreSQL/MySQL
1. Set up your database server
2. Create the tables using the SQL above (adjust syntax as needed)
3. Add connection string to `.env.local`: `DATABASE_URL=your_connection_string`

## 🔧 Verification

After setting up your database:

1. **Test Content Saving**: Submit a URL and check if it appears in your database
2. **Test Campaign Creation**: Create a campaign and verify it's stored
3. **Test Scheduling**: Schedule a post and check the scheduled_posts table
4. **Test Templates**: Save a content template and verify storage

## 🚀 Production Tips

1. **Backup**: Set up automatic backups
2. **Monitoring**: Enable database monitoring
3. **Scaling**: Most services auto-scale, but monitor usage
4. **Security**: Enable RLS and proper authentication for multi-user setups
5. **Performance**: Add indexes for frequently queried fields

## 📊 Expected Data Flow

```
User submits URL
    ↓
Scrape API extracts data
    ↓
Content saved to database
    ↓
User edits content
    ↓
Updates saved to database
    ↓
User creates campaign
    ↓
Campaign saved to database
    ↓
User schedules posts
    ↓
Scheduled posts saved to database
    ↓
Analytics track performance
    ↓
Data aggregated from database
```

## ⚡ Features Enabled by Database

- ✅ **Persistent Data**: Content survives browser refresh
- ✅ **Cross-Device Access**: Access your content from anywhere
- ✅ **Analytics**: Real performance tracking
- ✅ **Backup & Recovery**: Automatic data protection
- ✅ **Scalability**: Handle unlimited content and campaigns
- ✅ **Real-time Updates**: See changes instantly
- ✅ **Search & Filter**: Find content quickly
- ✅ **History**: Track content evolution over time

Your ClickSprout v1.0 is now production-ready with persistent data storage! 🎉
