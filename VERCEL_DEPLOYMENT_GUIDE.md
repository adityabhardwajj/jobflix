# Vercel Deployment Guide for JobFlix

This guide will help you deploy your JobFlix application to Vercel successfully.

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- GitHub repository: `https://github.com/adityabhardwajj/jobflix.git`
- Vercel account (free tier available)
- Database (PostgreSQL recommended)

### 2. Environment Variables Setup

Before deploying, you need to set up the following environment variables in Vercel:

#### Required Environment Variables:
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI (Optional)
OPENAI_API_KEY="your-openai-api-key"

# JWT
JWT_SECRET="your-jwt-secret-key"

# App Configuration
NODE_ENV="production"
APP_URL="https://your-app.vercel.app"
```

### 3. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string to `DATABASE_URL`

#### Option B: External Database
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app (Free tier available)

### 4. Deploy to Vercel

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... add other variables
```

#### Method 2: Vercel Dashboard
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: `adityabhardwajj/jobflix`
4. Configure environment variables
5. Deploy

### 5. Post-Deployment Setup

#### Database Migration
After deployment, run database migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

#### Or use Vercel's Post-Deploy Hook:
Create a script in `package.json`:
```json
{
  "scripts": {
    "postbuild": "prisma generate && prisma migrate deploy"
  }
}
```

## 🔧 Configuration Files

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### .vercelignore
```
node_modules/
.next/
out/
.env*
*.log
backend/
uploads/
```

## 🐛 Common Issues & Solutions

### Issue 1: Build Failures
**Problem**: Build fails during deployment
**Solution**: 
- Check if all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Verify all imports are correct

### Issue 2: Database Connection
**Problem**: Database connection errors
**Solution**:
- Verify `DATABASE_URL` is correct
- Check if database allows external connections
- Ensure SSL is enabled for production

### Issue 3: Environment Variables
**Problem**: Environment variables not loading
**Solution**:
- Add variables in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Issue 4: API Routes Not Working
**Problem**: API endpoints returning 404
**Solution**:
- Check file structure in `src/app/api/`
- Verify route handlers are exported correctly
- Check Vercel function configuration

### Issue 5: Static Generation Issues
**Problem**: Pages failing to generate
**Solution**:
- Check for server-side code in static pages
- Add `export const dynamic = 'force-dynamic'` to dynamic pages
- Verify all imports are available at build time

## 📊 Performance Optimization

### 1. Image Optimization
```typescript
// next.config.js
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'logo.clearbit.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### 2. Bundle Optimization
- Use dynamic imports for heavy components
- Implement code splitting
- Optimize images and assets

### 3. Caching
- Configure appropriate cache headers
- Use Vercel's edge caching
- Implement ISR for static content

## 🔍 Monitoring & Debugging

### 1. Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user interactions

### 2. Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

### 3. Debug Mode
```bash
# Enable debug mode
vercel env add DEBUG "true"
```

## 🚀 Advanced Configuration

### Custom Domains
1. Go to Vercel dashboard
2. Navigate to Domains
3. Add your custom domain
4. Configure DNS settings

### Edge Functions
```typescript
// For edge-optimized functions
export const config = {
  runtime: 'edge',
}
```

### Middleware
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Your middleware logic
  return NextResponse.next()
}
```

## 📝 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Build passes locally (`npm run build`)
- [ ] All API routes tested
- [ ] Authentication working
- [ ] File uploads working (if applicable)
- [ ] Performance optimized
- [ ] Analytics enabled
- [ ] Custom domain configured (optional)

## 🆘 Troubleshooting

### Common Error Messages:

1. **"Module not found"**
   - Check import paths
   - Verify file exists
   - Check case sensitivity

2. **"Database connection failed"**
   - Verify DATABASE_URL
   - Check database permissions
   - Ensure SSL is enabled

3. **"Environment variable not defined"**
   - Add variable in Vercel dashboard
   - Redeploy after adding
   - Check variable name spelling

4. **"Build timeout"**
   - Optimize build process
   - Remove unnecessary dependencies
   - Use Vercel's build cache

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review this guide
3. Check GitHub issues
4. Contact Vercel support

## 🎉 Success!

Once deployed, your JobFlix application will be available at:
`https://your-app.vercel.app`

Monitor the deployment in your Vercel dashboard and ensure all features are working correctly.
