#!/bin/bash

# JobFlix FastAPI Backend Startup Script

echo "🚀 Starting JobFlix FastAPI Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before running again."
    exit 1
fi

# Check if database is accessible
echo "🗄️  Checking database connection..."
python -c "
import asyncio
from app.core.database import async_engine
from sqlalchemy import text

async def check_db():
    try:
        async with async_engine.begin() as conn:
            await conn.execute(text('SELECT 1'))
        print('✅ Database connection successful')
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        exit(1)

asyncio.run(check_db())
"

# Run database migrations
echo "🔄 Running database migrations..."
alembic upgrade head

# Start the application
echo "🌟 Starting FastAPI application..."
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔍 ReDoc Documentation: http://localhost:8000/redoc"
echo "🏥 Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
