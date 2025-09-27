 # JobFlix FastAPI Backend

A comprehensive, high-performance backend API for the JobFlix job platform, built with FastAPI, SQLAlchemy, and PostgreSQL.

## 🚀 Features

### Core Features
- **User Management** - Complete user registration, authentication, and profile management
- **Job Management** - Full CRUD operations for job postings with advanced filtering
- **Company Management** - Company profiles and employee management
- **Application Tracking** - End-to-end application management system
- **AI-Powered Job Matching** - Intelligent job recommendations using GPT-4
- **Real-time Notifications** - Instant updates and alerts
- **Advanced Search** - Powerful search and filtering capabilities
- **File Upload** - Resume and document management
- **Email Integration** - Automated email notifications

### Technical Features
- **Async/Await** - Full async support for high performance
- **JWT Authentication** - Secure token-based authentication
- **Database Migrations** - Alembic for database schema management
- **Input Validation** - Pydantic models for request/response validation
- **Error Handling** - Comprehensive error handling and logging
- **API Documentation** - Automatic OpenAPI/Swagger documentation
- **Rate Limiting** - Built-in rate limiting for API protection
- **CORS Support** - Cross-origin resource sharing configuration
- **Structured Logging** - Advanced logging with structured data

## 🛠️ Technology Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Primary database
- **Alembic** - Database migration tool
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Token authentication
- **OpenAI GPT-4** - AI-powered job matching
- **Redis** - Caching and session storage
- **Celery** - Background task processing
- **Uvicorn** - ASGI server

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 13+
- Redis 6+
- OpenAI API key (for AI features)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

Required environment variables:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/jobflix
JWT_SECRET_KEY=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Database Setup

```bash
# Create database
createdb jobflix

# Run migrations
alembic upgrade head
```

### 4. Run the Application

```bash
# Development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/me` | Get current user info |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/profile` | Get user profile |
| POST | `/api/v1/users/profile` | Create user profile |
| PUT | `/api/v1/users/profile` | Update user profile |
| GET | `/api/v1/users/skills` | Get user skills |
| POST | `/api/v1/users/skills` | Add user skill |
| PUT | `/api/v1/users/skills/{id}` | Update user skill |
| DELETE | `/api/v1/users/skills/{id}` | Remove user skill |

### Job Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/jobs/` | Search jobs |
| GET | `/api/v1/jobs/{id}` | Get job details |
| POST | `/api/v1/jobs/` | Create job (employers) |
| PUT | `/api/v1/jobs/{id}` | Update job (employers) |
| DELETE | `/api/v1/jobs/{id}` | Delete job (employers) |
| GET | `/api/v1/jobs/saved/` | Get saved jobs |
| POST | `/api/v1/jobs/saved/` | Save job |
| DELETE | `/api/v1/jobs/saved/{id}` | Remove saved job |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/match-jobs` | AI job matching |
| POST | `/api/v1/ai/generate-job-description` | Generate job description |
| POST | `/api/v1/ai/optimize-resume` | Optimize resume for job |
| POST | `/api/v1/ai/generate-cover-letter` | Generate cover letter |

### Application Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/applications/` | Get user applications |
| POST | `/api/v1/applications/` | Apply for job |
| PUT | `/api/v1/applications/{id}` | Update application |

## 🔧 Development

### Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Code Quality

```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .

# Run tests
pytest
```

### Adding New Endpoints

1. Create schema in `app/schemas/`
2. Create model in `app/models/`
3. Create endpoint in `app/api/v1/endpoints/`
4. Add route to `app/api/v1/api.py`
5. Create migration if needed

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DEBUG=False
DATABASE_URL=postgresql+asyncpg://user:password@db:5432/jobflix
JWT_SECRET_KEY=your-production-secret-key
OPENAI_API_KEY=your-openai-api-key
REDIS_URL=redis://redis:6379
ALLOWED_HOSTS=["yourdomain.com"]
```

## 📊 Performance

- **Async Support** - Full async/await for high concurrency
- **Database Connection Pooling** - Optimized database connections
- **Caching** - Redis caching for frequently accessed data
- **Rate Limiting** - API protection against abuse
- **Background Tasks** - Celery for heavy operations

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Pydantic model validation
- **CORS Configuration** - Controlled cross-origin access
- **Rate Limiting** - Protection against brute force
- **SQL Injection Protection** - SQLAlchemy ORM protection

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## 📈 Monitoring

- **Structured Logging** - JSON-formatted logs
- **Health Checks** - `/health` endpoint
- **Error Tracking** - Comprehensive error handling
- **Performance Metrics** - Request timing and database queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the code examples in the endpoints

## 🔮 Future Enhancements

- **Real-time Chat** - WebSocket support for messaging
- **Video Interviews** - Integration with video calling APIs
- **Advanced Analytics** - Job market insights and trends
- **Mobile App API** - Optimized endpoints for mobile
- **Multi-language Support** - Internationalization
- **Advanced AI Features** - Resume scoring, interview prep
