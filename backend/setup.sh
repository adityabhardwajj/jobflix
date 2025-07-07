#!/bin/bash

echo "🚀 Setting up Jobflix Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 12+ to use the database features."
    echo "   You can still run the server with mock data."
else
    echo "✅ PostgreSQL found"
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw jobflix; then
        echo "✅ Database 'jobflix' already exists"
    else
        echo "📊 Creating database 'jobflix'..."
        createdb jobflix
        if [ $? -eq 0 ]; then
            echo "✅ Database created successfully"
        else
            echo "⚠️  Failed to create database. You may need to create it manually."
        fi
    fi
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'npm run db:migrate' to set up database tables"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "The API will be available at: http://localhost:5000"
echo "Health check: http://localhost:5000/health"
echo "" 