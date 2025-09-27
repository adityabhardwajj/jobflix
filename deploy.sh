#!/bin/bash

# JobFlix Vercel Deployment Script
# This script helps prepare and deploy the JobFlix application to Vercel

echo "🚀 Starting JobFlix deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "📝 Don't forget to:"
    echo "   1. Set up environment variables in Vercel dashboard"
    echo "   2. Configure your database"
    echo "   3. Run database migrations"
    echo "   4. Test all functionality"
else
    echo "❌ Deployment failed. Check the logs above for errors."
    exit 1
fi
