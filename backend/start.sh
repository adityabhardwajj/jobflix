#!/bin/bash

# JobFlix FastAPI Backend Startup Script

set -e

echo "🚀 Starting JobFlix FastAPI Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_info "Creating virtual environment..."
    python -m venv venv
    print_status "Virtual environment created"
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate
print_status "Virtual environment activated"

# Check if requirements are installed
print_info "Installing/updating dependencies..."
pip install -r requirements.txt
print_status "Dependencies installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status ".env file created from template"
        print_warning "Please update .env file with your actual configuration!"
    else
        print_error ".env.example file not found!"
        exit 1
    fi
else
    print_status ".env file found"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    print_info "Creating uploads directory..."
    mkdir uploads
    print_status "Uploads directory created"
fi

# Run database migrations
print_info "Running database migrations..."
alembic upgrade head
print_status "Database migrations completed"

# Start the server
print_info "Starting FastAPI server..."
print_status "🎉 JobFlix API will be available at:"
print_info "   📍 API: http://localhost:8000"
print_info "   📚 Docs: http://localhost:8000/docs"
print_info "   📖 ReDoc: http://localhost:8000/redoc"
echo
print_info "Press Ctrl+C to stop the server"
echo

# Start uvicorn with auto-reload in development
uvicorn main:app --reload --host 0.0.0.0 --port 8000