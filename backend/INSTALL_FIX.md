# 🔧 Installation Fix Guide

## Quick Fix for Installation Issues

The original `package.json` had some dependency version conflicts. Here's how to fix it:

### Option 1: Use the Fix Script (Recommended)

```bash
# Make the fix script executable
chmod +x fix-install.sh

# Run the fix script
./fix-install.sh
```

### Option 2: Manual Fix

1. **Backup current package.json**
   ```bash
   mv package.json package.json.backup
   ```

2. **Use simplified package.json**
   ```bash
   cp package-simple.json package.json
   ```

3. **Clean install**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Use simplified server file**
   ```bash
   cp src/index-simple.ts src/index.ts
   ```

### Option 3: Minimal Setup (Windows)

If you're on Windows and the scripts don't work:

1. **Delete the problematic files**
   ```cmd
   del package.json
   del package-lock.json
   rmdir /s node_modules
   ```

2. **Copy the simplified version**
   ```cmd
   copy package-simple.json package.json
   copy src\index-simple.ts src\index.ts
   ```

3. **Install dependencies**
   ```cmd
   npm install
   ```

## Start the Server

After fixing the installation:

```bash
# Start development server
npm run dev
```

## Test the API

```bash
# Health check
curl http://localhost:5000/health

# Get jobs
curl http://localhost:5000/api/v1/jobs

# Register user
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

## What's Included in Simplified Version

✅ **Core Features:**
- Express.js server
- JWT authentication
- Basic middleware (CORS, Helmet, Rate Limiting)
- TypeScript support
- Health check endpoint
- Job listing API
- User registration/login

✅ **Available Endpoints:**
- `GET /health` - Health check
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/jobs` - Get all jobs
- `GET /api/v1/jobs/:id` - Get job by ID

## Add More Features Later

Once the basic setup is working, you can add more features:

```bash
# Database support
npm install pg knex

# File upload
npm install multer aws-sdk

# Email notifications
npm install nodemailer

# Real-time features
npm install socket.io

# Additional utilities
npm install moment lodash
```

## Troubleshooting

### Still getting errors?
1. **Clear npm cache**: `npm cache clean --force`
2. **Use yarn instead**: `yarn install`
3. **Check Node.js version**: Make sure you have Node.js 18+

### Port already in use?
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

### TypeScript errors?
```bash
# Install TypeScript globally
npm install -g typescript

# Check TypeScript version
tsc --version
```

## Next Steps

1. ✅ **Get the server running**
2. 🔄 **Test the API endpoints**
3. 🔄 **Connect frontend to backend**
4. 🔄 **Add database integration**
5. 🔄 **Implement remaining features**

The simplified version gives you a solid foundation to build upon! 🚀 