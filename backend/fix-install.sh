#!/bin/bash

echo "🔧 Fixing Jobflix Backend Installation..."

# Remove problematic package.json and use simplified version
if [ -f "package.json" ]; then
    echo "📦 Backing up current package.json..."
    mv package.json package.json.backup
fi

# Copy simplified package.json
if [ -f "package-simple.json" ]; then
    echo "📦 Using simplified package.json..."
    cp package-simple.json package.json
else
    echo "❌ package-simple.json not found"
    exit 1
fi

# Remove node_modules and package-lock.json if they exist
if [ -d "node_modules" ]; then
    echo "🗑️  Removing existing node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️  Removing package-lock.json..."
    rm package-lock.json
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Installation successful!"
    echo ""
    echo "🎉 You can now start the server with:"
    echo "   npm run dev"
    echo ""
    echo "📝 Note: This simplified version includes:"
    echo "   - Express.js server"
    echo "   - Authentication (JWT)"
    echo "   - Basic middleware (CORS, Helmet, etc.)"
    echo "   - TypeScript support"
    echo ""
    echo "🔧 To add more features later:"
    echo "   - Database: npm install pg knex"
    echo "   - File upload: npm install multer aws-sdk"
    echo "   - Email: npm install nodemailer"
    echo "   - Real-time: npm install socket.io"
else
    echo "❌ Installation failed"
    echo "🔄 Restoring original package.json..."
    if [ -f "package.json.backup" ]; then
        mv package.json.backup package.json
    fi
    exit 1
fi 