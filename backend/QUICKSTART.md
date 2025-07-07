# 🚀 Quick Start Guide

Get the Jobflix backend running in 5 minutes!

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional - can run with mock data)

## Quick Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

4. **Test the API**
   ```bash
   curl http://localhost:5000/health
   ```

## Manual Setup (if script fails)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp env.example .env
   ```

3. **Start server**
   ```bash
   npm run dev
   ```

## Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Get Jobs
```bash
curl http://localhost:5000/api/v1/jobs
```

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "jobseeker"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Available Endpoints

- `GET /health` - Health check
- `GET /api/v1/jobs` - Get all jobs
- `GET /api/v1/jobs/:id` - Get job by ID
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token

## Mock Data

The API comes with mock data for:
- 3 sample jobs (Google, Netflix, Airbnb)
- 1 sample user (john@example.com / password)

## Next Steps

1. **Connect to PostgreSQL** - Update `.env` with database credentials
2. **Run migrations** - `npm run db:migrate`
3. **Add real data** - Replace mock data with database queries
4. **Deploy** - Set up production environment

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database connection issues
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Create database: `createdb jobflix`

### Permission denied on setup script
```bash
chmod +x setup.sh
```

## Development Tips

- Use `npm run dev` for development with auto-reload
- Check logs in terminal for debugging
- Use Postman or curl for API testing
- Mock data is in route files for easy modification 