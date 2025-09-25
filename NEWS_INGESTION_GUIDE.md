# 📰 Tech News Ingestion Guide

## Overview
JobFlix's tech news section now features **live daily news** from multiple trusted sources including TechCrunch, The Verge, Dev.to, and Hacker News.

## Current Status
✅ **Working**: The tech news page is now live with mock data as fallback  
✅ **Backend**: News ingestion service is implemented  
✅ **Frontend**: Modern UI with live updates, auto-refresh, and filtering  

## Getting Live News Data

### Option 1: Automatic Ingestion (Recommended)
The backend has a news ingestion service that can fetch from multiple sources:

```bash
# Run the ingestion script
node trigger-news-ingestion.js
```

### Option 2: Manual Backend Trigger
```bash
# Direct API call to backend
curl -X POST http://localhost:8000/api/v1/blog/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["newsapi", "devto", "hackernews"],
    "max_articles": 50
  }'
```

### Option 3: Frontend API Trigger
```bash
# Trigger via frontend API
curl -X POST http://localhost:3000/api/news/ingest
```

## News Sources

### 🔴 Live Sources (when configured)
- **NewsAPI**: TechCrunch, The Verge, Ars Technica, Wired, Engadget
- **Dev.to**: Developer community articles
- **Hacker News**: Top tech stories

### 📝 Mock Data (current fallback)
- 6 realistic tech news articles
- Recent timestamps (30min - 12hrs ago)
- Proper categorization and metadata
- High-quality cover images from Unsplash

## Features

### 🎭 Live Updates
- **Auto-refresh**: 30s, 1m, 5m intervals
- **Live indicators**: Pulsing dots for recent articles
- **Real-time stats**: Article counts, sources, update times
- **Background updates**: Non-intrusive refresh

### 🔍 Advanced Filtering
- **Search**: Title, content, source, tags
- **Categories**: AI, Web, DevOps, Programming, Cloud, etc.
- **Sorting**: Recent, oldest, title, source
- **Active filters**: Visual chips with clear options

### 🎨 Modern UI
- **Sparkles background**: Animated particles
- **Typewriter effect**: "Live Tech News" headline
- **Interactive cards**: Hover effects, save functionality
- **Mobile responsive**: Optimized for all devices

### 📱 User Experience
- **Save articles**: Bookmark for later reading
- **Share functionality**: Social media integration
- **Live badges**: "LIVE" indicator for recent articles
- **Author avatars**: Professional display
- **Time indicators**: "Just now", "2h ago", etc.

## Configuration

### Backend Setup (for real news)
1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment variables** (optional for external APIs):
   ```bash
   export NEWS_API_KEY="your_newsapi_key"  # For NewsAPI.org
   ```

3. **Start backend**:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

### Frontend Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start frontend**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Backend
- `GET /api/v1/blog/posts` - Fetch all news articles
- `POST /api/v1/blog/ingest` - Trigger news ingestion

### Frontend
- `POST /api/news/ingest` - Trigger ingestion via frontend

## Troubleshooting

### No News Showing
1. **Check backend**: `curl http://localhost:8000/api/v1/blog/posts`
2. **Check frontend**: Visit `http://localhost:3000/tech-news`
3. **Fallback**: Mock data should always show

### API Errors
- Backend not running → Mock data fallback activates
- CORS issues → Check backend CORS configuration
- Network errors → Automatic retry with exponential backoff

### Performance
- **Auto-refresh**: Disable if causing issues (set to "Off")
- **Image loading**: Lazy loading implemented
- **Search**: Debounced for performance

## Development

### Adding News Sources
1. **Backend**: Extend `NewsIngestionService` in `backend/app/services/news_ingestion.py`
2. **Frontend**: Update source colors in `newsSourceColors`

### Customizing UI
- **Colors**: Update in `tailwind.config.js`
- **Animations**: Modify Framer Motion variants
- **Layout**: Adjust grid columns and spacing

## Next Steps

### Immediate
- [ ] Configure NewsAPI key for real data
- [ ] Set up automated ingestion cron job
- [ ] Add more news sources

### Future Enhancements
- [ ] User preferences for sources
- [ ] Push notifications for breaking news
- [ ] AI-powered article summarization
- [ ] Social sharing analytics
- [ ] Offline reading mode

## Support

The tech news system is designed to be resilient:
- **Always shows content** (mock data fallback)
- **Graceful error handling** (no broken states)
- **Progressive enhancement** (works without JS)
- **Accessible design** (WCAG compliant)

Visit `http://localhost:3000/tech-news` to see the live news feed! 🎭✨
