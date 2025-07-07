# Jobflix Backend API

A comprehensive Node.js/Express backend API for the Jobflix job hunting platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access
- **Job Management**: CRUD operations for job listings
- **Application Tracking**: Manage job applications
- **Resume Management**: Upload and manage resumes
- **Interview Scheduling**: Schedule and manage interviews
- **Notifications**: Real-time notifications system
- **File Upload**: AWS S3 integration for document storage
- **Email Notifications**: Automated email alerts
- **Rate Limiting**: API rate limiting for security
- **Real-time Updates**: Socket.IO for live updates

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Knex.js
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Email**: SendGrid
- **Real-time**: Socket.IO
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Redis (optional, for caching)
- AWS Account (for S3)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   API_VERSION=v1

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=jobflix
   DB_USER=postgres
   DB_PASSWORD=your_password
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/jobflix

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_REFRESH_EXPIRES_IN=30d

   # AWS Configuration
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=jobflix-uploads

   # Email Configuration
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_FROM=noreply@jobflix.com
   EMAIL_FROM_NAME=Jobflix

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb jobflix

   # Run migrations
   npm run db:migrate

   # Seed data (optional)
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Job Endpoints

#### Get All Jobs
```http
GET /jobs?page=1&limit=10&search=developer&location=San Francisco
```

#### Get Job by ID
```http
GET /jobs/:id
```

#### Create Job (Recruiter Only)
```http
POST /jobs
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "description": "Job description...",
  "location": "San Francisco, CA",
  "salary": {
    "min": 100000,
    "max": 150000,
    "currency": "USD",
    "period": "yearly"
  },
  "jobType": "full-time",
  "experienceLevel": "senior"
}
```

### Application Endpoints

#### Get User Applications
```http
GET /applications
Authorization: Bearer your-jwt-token
```

#### Apply to Job
```http
POST /applications
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "jobId": "job-id",
  "resumeId": "resume-id",
  "coverLetter": "Cover letter text...",
  "answers": [
    {
      "questionId": "q1",
      "question": "Why do you want this job?",
      "answer": "I'm passionate about..."
    }
  ]
}
```

### Resume Endpoints

#### Get User Resumes
```http
GET /resumes
Authorization: Bearer your-jwt-token
```

#### Upload Resume
```http
POST /resumes/upload
Authorization: Bearer your-jwt-token
Content-Type: multipart/form-data

{
  "file": "resume.pdf",
  "name": "My Resume",
  "type": "resume",
  "description": "Updated resume"
}
```

### Interview Endpoints

#### Get User Interviews
```http
GET /interviews
Authorization: Bearer your-jwt-token
```

#### Schedule Interview
```http
POST /interviews
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "applicationId": "app-id",
  "date": "2024-01-25",
  "time": "14:00",
  "duration": 60,
  "type": "video",
  "timezone": "America/Los_Angeles"
}
```

### Notification Endpoints

#### Get User Notifications
```http
GET /notifications
Authorization: Bearer your-jwt-token
```

#### Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer your-jwt-token
```

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  headline VARCHAR(200),
  bio TEXT,
  location VARCHAR(200),
  website VARCHAR(500),
  linkedin VARCHAR(500),
  github VARCHAR(500),
  twitter VARCHAR(500),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'jobseeker',
  status VARCHAR(20) DEFAULT 'active',
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  company_id UUID REFERENCES companies(id),
  description TEXT NOT NULL,
  requirements TEXT[],
  responsibilities TEXT[],
  location VARCHAR(200) NOT NULL,
  remote_type VARCHAR(20) DEFAULT 'onsite',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'USD',
  salary_period VARCHAR(20) DEFAULT 'yearly',
  job_type VARCHAR(20) NOT NULL,
  experience_level VARCHAR(20),
  skills TEXT[],
  benefits TEXT[],
  application_deadline TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  views INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  recruiter_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Cross-origin request security
- **Helmet**: Security headers
- **Input Validation**: Request validation and sanitization
- **SQL Injection Protection**: Parameterized queries with Knex

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:reset     # Reset database

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-production-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
SENDGRID_API_KEY=your-sendgrid-key
```

### Docker Deployment
```bash
# Build image
docker build -t jobflix-backend .

# Run container
docker run -p 5000:5000 jobflix-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@jobflix.com or create an issue in the repository. 