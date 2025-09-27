"""
JobFlix FastAPI Demo - Simple version that works with Python 3.13
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Create FastAPI application
app = FastAPI(
    title="JobFlix API Demo",
    description="""
    ## JobFlix - AI-Powered Job Platform API Demo
    
    A demonstration of the JobFlix backend API with core features:
    
    * **User Management** - User registration and authentication
    * **Job Management** - Job posting and search functionality
    * **AI Features** - Job matching and recommendations
    * **Company Management** - Company profiles and management
    
    ### Authentication
    This is a demo version. In production, you would use JWT tokens.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class User(BaseModel):
    id: int
    email: str
    name: str
    role: str = "JOB_SEEKER"

class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    role: str = "JOB_SEEKER"

class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: str
    requirements: List[str] = []
    is_remote: bool = False

class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    description: str
    requirements: List[str] = []
    is_remote: bool = False

class Company(BaseModel):
    id: int
    name: str
    industry: str
    size: str
    website: Optional[str] = None
    description: str

class JobMatch(BaseModel):
    job: Job
    match_score: float
    match_reasons: List[str]

# In-memory storage (for demo purposes)
users_db = []
jobs_db = []
companies_db = []
next_user_id = 1
next_job_id = 1
next_company_id = 1

# Initialize with sample data
sample_companies = [
    {"name": "Google", "industry": "Technology", "size": "LARGE", "website": "https://google.com", "description": "A global technology company"},
    {"name": "Microsoft", "industry": "Technology", "size": "LARGE", "website": "https://microsoft.com", "description": "Leading technology corporation"},
    {"name": "StartupXYZ", "industry": "Technology", "size": "SMALL", "website": "https://startupxyz.com", "description": "Innovative startup company"},
]

sample_jobs = [
    {
        "title": "Senior Software Engineer",
        "company": "Google",
        "location": "San Francisco, CA",
        "salary_min": 150000,
        "salary_max": 200000,
        "description": "Design and develop scalable software solutions",
        "requirements": ["Python", "JavaScript", "5+ years experience"],
        "is_remote": True
    },
    {
        "title": "Frontend Developer",
        "company": "Microsoft",
        "location": "Seattle, WA",
        "salary_min": 120000,
        "salary_max": 160000,
        "description": "Build amazing user interfaces",
        "requirements": ["React", "TypeScript", "3+ years experience"],
        "is_remote": False
    },
    {
        "title": "Full Stack Developer",
        "company": "StartupXYZ",
        "location": "Remote",
        "salary_min": 80000,
        "salary_max": 120000,
        "description": "Work on cutting-edge products",
        "requirements": ["Node.js", "React", "2+ years experience"],
        "is_remote": True
    }
]

# Initialize sample data
for company_data in sample_companies:
    company = Company(id=next_company_id, **company_data)
    companies_db.append(company)
    next_company_id += 1

for job_data in sample_jobs:
    job = Job(id=next_job_id, **job_data)
    jobs_db.append(job)
    next_job_id += 1

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to JobFlix API Demo",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "status": "healthy",
        "features": [
            "User Management",
            "Job Management", 
            "Company Management",
            "AI Job Matching",
            "Search & Filtering"
        ]
    }

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "JobFlix API Demo",
        "version": "1.0.0",
        "users_count": len(users_db),
        "jobs_count": len(jobs_db),
        "companies_count": len(companies_db)
    }

# User endpoints
@app.post("/api/v1/auth/register", response_model=User)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    global next_user_id
    
    # Check if user already exists
    for user in users_db:
        if user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        id=next_user_id,
        email=user_data.email,
        name=user_data.name,
        role=user_data.role
    )
    users_db.append(new_user)
    next_user_id += 1
    
    return new_user

@app.get("/api/v1/users", response_model=List[User])
async def get_users():
    """Get all users"""
    return users_db

@app.get("/api/v1/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Get user by ID"""
    for user in users_db:
        if user.id == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

# Job endpoints
@app.get("/api/v1/jobs", response_model=List[Job])
async def get_jobs(
    search: Optional[str] = None,
    location: Optional[str] = None,
    company: Optional[str] = None,
    remote: Optional[bool] = None
):
    """Get jobs with optional filtering"""
    filtered_jobs = jobs_db.copy()
    
    if search:
        filtered_jobs = [
            job for job in filtered_jobs 
            if search.lower() in job.title.lower() or search.lower() in job.description.lower()
        ]
    
    if location:
        filtered_jobs = [
            job for job in filtered_jobs 
            if location.lower() in job.location.lower()
        ]
    
    if company:
        filtered_jobs = [
            job for job in filtered_jobs 
            if company.lower() in job.company.lower()
        ]
    
    if remote is not None:
        filtered_jobs = [
            job for job in filtered_jobs 
            if job.is_remote == remote
        ]
    
    return filtered_jobs

@app.get("/api/v1/jobs/{job_id}", response_model=Job)
async def get_job(job_id: int):
    """Get job by ID"""
    for job in jobs_db:
        if job.id == job_id:
            return job
    raise HTTPException(status_code=404, detail="Job not found")

@app.post("/api/v1/jobs", response_model=Job)
async def create_job(job_data: JobCreate):
    """Create a new job"""
    global next_job_id
    
    new_job = Job(id=next_job_id, **job_data.dict())
    jobs_db.append(new_job)
    next_job_id += 1
    
    return new_job

# Company endpoints
@app.get("/api/v1/companies", response_model=List[Company])
async def get_companies():
    """Get all companies"""
    return companies_db

@app.get("/api/v1/companies/{company_id}", response_model=Company)
async def get_company(company_id: int):
    """Get company by ID"""
    for company in companies_db:
        if company.id == company_id:
            return company
    raise HTTPException(status_code=404, detail="Company not found")

# AI endpoints
@app.post("/api/v1/ai/match-jobs", response_model=List[JobMatch])
async def match_jobs(
    user_skills: List[str],
    preferred_location: Optional[str] = None,
    min_salary: Optional[int] = None,
    max_results: int = 5
):
    """AI-powered job matching (demo version)"""
    matches = []
    
    for job in jobs_db:
        # Simple matching logic (in production, this would use AI)
        match_score = 0.0
        match_reasons = []
        
        # Check skills match
        job_skills = [req.lower() for req in job.requirements]
        user_skills_lower = [skill.lower() for skill in user_skills]
        
        skill_matches = sum(1 for skill in user_skills_lower if any(skill in req for req in job_skills))
        if skill_matches > 0:
            match_score += 0.4
            match_reasons.append(f"Matches {skill_matches} required skills")
        
        # Check location preference
        if preferred_location and preferred_location.lower() in job.location.lower():
            match_score += 0.3
            match_reasons.append("Location matches preference")
        elif job.is_remote:
            match_score += 0.2
            match_reasons.append("Remote work available")
        
        # Check salary range
        if min_salary and job.salary_min and job.salary_min >= min_salary:
            match_score += 0.3
            match_reasons.append("Salary meets expectations")
        
        # Only include jobs with decent match scores
        if match_score >= 0.3:
            matches.append(JobMatch(
                job=job,
                match_score=round(match_score, 2),
                match_reasons=match_reasons
            ))
    
    # Sort by match score and return top results
    matches.sort(key=lambda x: x.match_score, reverse=True)
    return matches[:max_results]

@app.post("/api/v1/ai/generate-job-description")
async def generate_job_description(
    job_title: str,
    company_name: str,
    requirements: List[str]
):
    """Generate AI job description (demo version)"""
    description = f"""
# {job_title} at {company_name}

## Job Description
We are looking for a talented {job_title} to join our team at {company_name}. 
This is an exciting opportunity to work on cutting-edge projects and make a real impact.

## Key Responsibilities
- Develop and maintain high-quality software solutions
- Collaborate with cross-functional teams
- Participate in code reviews and technical discussions
- Contribute to architectural decisions

## Required Skills
{chr(10).join(f"- {req}" for req in requirements)}

## What We Offer
- Competitive salary and benefits
- Flexible work arrangements
- Professional development opportunities
- Collaborative and innovative work environment

## How to Apply
Please submit your resume and cover letter through our application portal.
    """.strip()
    
    return {
        "job_description": description,
        "job_title": job_title,
        "company_name": company_name,
        "generated_by": "JobFlix AI Demo"
    }

# Search endpoint
@app.get("/api/v1/search")
async def search(
    q: str,
    type: str = "jobs"
):
    """Universal search endpoint"""
    if type == "jobs":
        results = [
            job for job in jobs_db 
            if q.lower() in job.title.lower() or 
               q.lower() in job.company.lower() or 
               q.lower() in job.description.lower()
        ]
        return {"type": "jobs", "results": results, "count": len(results)}
    
    elif type == "companies":
        results = [
            company for company in companies_db 
            if q.lower() in company.name.lower() or 
               q.lower() in company.industry.lower() or 
               q.lower() in company.description.lower()
        ]
        return {"type": "companies", "results": results, "count": len(results)}
    
    else:
        raise HTTPException(status_code=400, detail="Invalid search type")

if __name__ == "__main__":
    print("🚀 Starting JobFlix FastAPI Demo...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 ReDoc Documentation: http://localhost:8000/redoc")
    print("🏥 Health Check: http://localhost:8000/health")
    print("")
    print("Press Ctrl+C to stop the server")
    print("")
    
    uvicorn.run(
        "demo_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )





