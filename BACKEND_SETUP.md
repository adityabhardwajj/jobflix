# JobFlix Backend Setup Guide

## 🚀 Overview

This guide will help you set up the complete backend infrastructure for JobFlix, including database, authentication, APIs, and AI features.

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Google OAuth credentials

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Update `.env` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jobflix?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# JWT
JWT_SECRET="your-jwt-secret-key"
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `jobflix`
3. Update `DATABASE_URL` in `.env`

#### Option B: Cloud Database (Recommended)
- **Supabase**: Free PostgreSQL hosting
- **Railway**: Simple database deployment
- **PlanetScale**: MySQL-compatible (requires schema adjustments)

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Push Database Schema

```bash
npm run db:push
```

### 6. Seed Database (Optional)

```bash
npm run db:seed
```

## 🏗️ Backend Architecture

### Database Schema

The backend uses Prisma with PostgreSQL and includes:

- **Users**: Job seekers, employers, and admins
- **Companies**: Company profiles and information
- **Jobs**: Job postings with detailed requirements
- **Applications**: Job application tracking
- **Interviews**: Interview scheduling and management
- **Notifications**: Real-time notifications system
- **Skills**: User skills and proficiency levels

### API Endpoints

#### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

#### Jobs
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create new job (employers)
- `GET /api/jobs/[id]` - Get specific job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

#### Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]` - Update application status

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/skills` - Get user skills
- `POST /api/users/skills` - Add skill

#### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/companies/[id]` - Get company details

#### AI Features
- `POST /api/ai/match-jobs` - AI-powered job matching
- `POST /api/ask-assistant` - AI assistant chat

#### Search & Discovery
- `GET /api/search` - Advanced search
- `GET /api/saved-jobs` - Saved jobs management
- `GET /api/notifications` - User notifications

#### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

## 🔐 Authentication & Authorization

### NextAuth.js Integration

The backend uses NextAuth.js for authentication with:

- **Google OAuth** provider
- **JWT** session strategy
- **Prisma** adapter for database sessions
- **Role-based** access control (Job Seeker, Employer, Admin)

### Protected Routes

Middleware protects the following routes:
- `/dashboard/*` - User dashboard
- `/profile/*` - User profile management
- `/applications/*` - Job applications
- `/api/users/*` - User management APIs
- `/api/applications/*` - Application APIs
- `/api/ai/*` - AI features

## 🤖 AI Features

### Job Matching Algorithm

The AI job matching system:

1. **Analyzes user profile** (skills, experience, preferences)
2. **Compares with job requirements** using OpenAI GPT-4
3. **Calculates match scores** (0-100) with detailed reasoning
4. **Provides strengths and concerns** for each match
5. **Returns ranked job recommendations**

### AI Assistant

- **Context-aware responses** about job searching
- **Career advice** and guidance
- **Platform-specific** information
- **Rate limiting** to prevent abuse

## 📊 Database Management

### Prisma Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Database Schema Updates

1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` for development
3. Run `npm run db:migrate` for production

## 🔧 Development

### Running the Backend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### API Testing

Use tools like:
- **Postman** - API testing and documentation
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension

### Database Management

- **Prisma Studio**: Visual database editor
- **pgAdmin**: PostgreSQL administration
- **DBeaver**: Universal database tool

## 🚀 Deployment

### Environment Setup

1. **Database**: Set up production PostgreSQL
2. **Environment Variables**: Configure all required variables
3. **Domain**: Update `NEXTAUTH_URL` and `APP_URL`
4. **SSL**: Ensure HTTPS for production

### Deployment Platforms

- **Vercel**: Recommended for Next.js apps
- **Railway**: Full-stack deployment
- **Heroku**: Traditional PaaS
- **AWS**: Custom infrastructure

### Production Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Error monitoring set up
- [ ] Backup strategy implemented

## 📈 Monitoring & Analytics

### Recommended Tools

- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and logging
- **Google Analytics**: User behavior tracking
- **PostHog**: Product analytics

### Key Metrics to Track

- API response times
- Error rates
- User authentication success
- Job application completion rates
- AI matching accuracy

## 🔒 Security Best Practices

### API Security

- **Rate limiting** on all endpoints
- **Input validation** and sanitization
- **SQL injection** prevention (Prisma ORM)
- **CORS** configuration
- **Authentication** on protected routes

### Data Protection

- **Password hashing** with bcrypt
- **JWT token** security
- **Environment variable** protection
- **Database connection** encryption
- **API key** rotation

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Verify database server is running
   - Check network connectivity

2. **Authentication Issues**
   - Verify Google OAuth credentials
   - Check `NEXTAUTH_SECRET` is set
   - Ensure callback URLs are correct

3. **AI Features Not Working**
   - Verify `OPENAI_API_KEY` is valid
   - Check API rate limits
   - Monitor error logs

4. **Build Errors**
   - Run `npm run db:generate`
   - Check TypeScript errors
   - Verify all dependencies installed

### Getting Help

- Check the [Prisma documentation](https://www.prisma.io/docs)
- Review [NextAuth.js guides](https://next-auth.js.org)
- Consult [Next.js API routes](https://nextjs.org/docs/api-routes/introduction)

## 🎯 Next Steps

After setting up the backend:

1. **Test all API endpoints**
2. **Set up monitoring and logging**
3. **Configure email notifications**
4. **Implement file upload for resumes**
5. **Add real-time features with WebSockets**
6. **Set up automated testing**
7. **Deploy to production**

---

**Happy coding! 🚀**

For questions or issues, please refer to the documentation or create an issue in the repository.


