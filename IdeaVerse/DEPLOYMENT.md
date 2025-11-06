# Deployment Guide for IdeaVerse

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or self-hosted MongoDB)
- GitHub account
- Vercel/Netlify account (for frontend)
- Render/Railway/AWS account (for backend)

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# CORS
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.netlify.app

# Email (optional but recommended)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@ideaverse.com

# News API (optional)
NEWSAPI_KEY=your_newsapi_key

# Body size limit
BODY_SIZE_LIMIT=100kb
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com
# Or for local development:
# VITE_API_URL=http://localhost:5000
```

## Backend Deployment (Render/Railway)

### Option 1: Render

1. **Create a new Web Service**
   - Connect your GitHub repository
   - Select the root directory: `IdeaVerse/backend`
   - Build command: `npm install`
   - Start command: `npm run server`

2. **Environment Variables**
   - Add all variables from `backend/.env` in Render dashboard

3. **Health Check**
   - Health check path: `/`
   - Render will automatically monitor your service

### Option 2: Railway

1. **Create a new project**
   - Connect your GitHub repository
   - Add a new service
   - Set root directory to `IdeaVerse/backend`

2. **Configure**
   - Build command: `npm install`
   - Start command: `npm run server`
   - Add environment variables

3. **Generate domain**
   - Railway will provide a public URL automatically

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. **Import Project**
   - Connect your GitHub repository
   - Root directory: `IdeaVerse/frontend`
   - Framework preset: Vite

2. **Environment Variables**
   - `VITE_API_URL`: Your backend URL

3. **Deploy**
   - Vercel will automatically build and deploy

### Option 2: Netlify

1. **New Site from Git**
   - Connect your GitHub repository
   - Base directory: `IdeaVerse/frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   - Add `VITE_API_URL` in site settings

3. **Deploy**
   - Netlify will build and deploy automatically

## MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up at mongodb.com/cloud/atlas
   - Create a free M0 cluster

2. **Database Access**
   - Create a database user
   - Set username and password

3. **Network Access**
   - Add IP address: `0.0.0.0/0` (allow all) or your server IP

4. **Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

## Post-Deployment Checklist

- [ ] Backend is accessible at the deployed URL
- [ ] Frontend is accessible and connects to backend
- [ ] Database connection is working
- [ ] Authentication flow works (register/login)
- [ ] Email service is configured (if using)
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] SSL certificates are active (HTTPS)
- [ ] Error logging is working (Winston logs)
- [ ] Health check endpoint responds

## Monitoring & Logging

### Winston Logs

Logs are automatically saved to:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

For production, consider:
- **Logtail** - Real-time log aggregation
- **Sentry** - Error tracking and monitoring
- **PM2** - Process manager for Node.js

### PM2 Setup (Optional)

```bash
npm install -g pm2
pm2 start backend/server.js --name ideaverse-api
pm2 save
pm2 startup
```

## Domain Configuration

### Custom Domain (Optional)

1. **Backend**
   - Add custom domain in Render/Railway settings
   - Update CORS_ORIGINS to include your domain

2. **Frontend**
   - Add custom domain in Vercel/Netlify
   - Update VITE_API_URL if needed

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS is restricted to your frontend domains
- [ ] Rate limiting is enabled
- [ ] Helmet.js security headers are active
- [ ] Password validation is enforced
- [ ] Email verification is enabled
- [ ] HTTPS is enabled (automatic on Vercel/Netlify)
- [ ] Environment variables are secure (not in code)

## Troubleshooting

### Backend Issues

- **Connection refused**: Check MongoDB connection string
- **CORS errors**: Verify CORS_ORIGINS includes your frontend URL
- **Port issues**: Render/Railway sets PORT automatically

### Frontend Issues

- **API not connecting**: Verify VITE_API_URL is correct
- **Build errors**: Check Node.js version (should be v16+)
- **Socket.io not working**: Verify proxy configuration in vite.config.js

## CI/CD (Optional)

### GitHub Actions

See `.github/workflows/ci.yml` for automated testing on push.

## Support

For issues, check:
- GitHub Issues
- Documentation in `/docs`
- API docs at `/api/docs` (Swagger)

