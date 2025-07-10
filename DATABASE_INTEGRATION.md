# Database Integration Guide for ClickSprout v1.0

## 🎯 PRIORITY: Replace localStorage with Real Database

Currently ALL data is stored in browser localStorage. To make this production-ready, you need to integrate a database.

## 📍 FILES TO MODIFY FOR DATABASE INTEGRATION

### 1. **API Routes** (High Priority)
These handle data operations and should save to database:

#### `src/app/api/scrape/route.ts`
**Current**: Returns scraped data to frontend only
**Needed**: Save scraped content to database

```typescript
// ADD THIS: Save to database after scraping
const scrapedData = await scrapeWebsite(url, enableMarketResearch)

// Save to database
await saveContentToDatabase({
  url,
  title: scrapedData.title,
  description: scrapedData.description,
  price: scrapedData.price,
  images: scrapedData.images,
  videos: scrapedData.videos,
  market_research: scrapedData.marketResearch,
  created_at: new Date()
})
```

#### `src/app/api/generate/route.ts`
**Current**: Generates content in real-time only
**Needed**: Save generated content to database

#### NEW: `src/app/api/content/route.ts` 
**Needed**: CRUD operations for content
- GET: Retrieve saved content
- POST: Save new content
- PUT: Update existing content
- DELETE: Remove content

#### NEW: `src/app/api/campaigns/route.ts`
**Needed**: CRUD operations for campaigns
- GET: Retrieve campaigns
- POST: Create new campaign
- PUT: Update campaign
- DELETE: Remove campaign

#### NEW: `src/app/api/analytics/route.ts`
**Needed**: Analytics data operations
- GET: Retrieve analytics data
- POST: Record new metrics

### 2. **Frontend Pages** (Medium Priority)
Replace localStorage calls with API calls:

#### `src/app/editor/page.tsx`
**Current**: 
```typescript
localStorage.setItem('finalContent', JSON.stringify(finalContent))
```
**Replace with**:
```typescript
const response = await fetch('/api/content', {
  method: 'POST',
  body: JSON.stringify(finalContent)
})
```

#### `src/app/campaigns/page.tsx`
**Current**:
```typescript
localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns))
```
**Replace with**:
```typescript
const response = await fetch('/api/campaigns', {
  method: 'POST',
  body: JSON.stringify(newCampaign)
})
```

#### `src/app/scheduler/page.tsx`
**Current**:
```typescript
localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts))
```
**Replace with**:
```typescript
const response = await fetch('/api/scheduler', {
  method: 'POST',
  body: JSON.stringify(scheduledPosts)
})
```

#### `src/app/analytics/page.tsx`
**Current**:
```typescript
const savedCampaigns = localStorage.getItem('campaigns')
```
**Replace with**:
```typescript
const response = await fetch('/api/campaigns')
const campaigns = await response.json()
```

## 🗄️ RECOMMENDED DATABASE OPTIONS

### Option 1: **Firebase** (Easiest)
- ✅ Free tier available
- ✅ Real-time updates
- ✅ Built-in authentication
- ✅ Easy Next.js integration

```bash
npm install firebase
```

### Option 2: **Supabase** (PostgreSQL)
- ✅ Open source
- ✅ SQL database
- ✅ Built-in authentication
- ✅ Real-time subscriptions

```bash
npm install @supabase/supabase-js
```

### Option 3: **MongoDB Atlas** (NoSQL)
- ✅ Document-based
- ✅ Flexible schema
- ✅ Free tier available

```bash
npm install mongodb
```

### Option 4: **PlanetScale** (MySQL)
- ✅ Serverless MySQL
- ✅ Branching for databases
- ✅ Excellent performance

```bash
npm install @planetscale/database
```

## 🚀 IMPLEMENTATION STEPS

### Step 1: Choose Database
Pick one of the options above based on your preferences.

### Step 2: Create Database Tables
Use the schema in `DATABASE_SCHEMA.md` to create your tables.

### Step 3: Create API Routes
Create the API routes listed above to handle database operations.

### Step 4: Replace localStorage
Update all frontend pages to use API calls instead of localStorage.

### Step 5: Add Error Handling
Implement proper error handling for database operations.

### Step 6: Add Loading States
Add loading indicators for database operations.

## 📊 IMMEDIATE BENEFITS

Once you add database integration:
- ✅ **Persistent Data**: Content survives browser refresh/clearing
- ✅ **Cross-Device Access**: Access data from any device
- ✅ **Data Backup**: Automatic backup and recovery
- ✅ **Analytics**: Proper tracking of user behavior
- ✅ **Scalability**: Handle multiple users
- ✅ **Performance**: Better data management

## 🔧 ENVIRONMENT VARIABLES

Add to your `.env.local`:

```bash
# Database Configuration
DATABASE_URL=your_database_connection_string
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=clicksprout_v1
DB_USER=your_username
DB_PASSWORD=your_password

# Firebase (if using Firebase)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id

# Supabase (if using Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

This is the most critical missing piece for making ClickSprout v1.0 production-ready!
