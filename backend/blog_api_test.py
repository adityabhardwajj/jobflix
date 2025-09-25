"""
Simple Blog API test without database dependencies
"""

from fastapi import FastAPI, HTTPException
from typing import List, Optional
from datetime import datetime
import uvicorn

app = FastAPI(
    title="JobFlix Blog API Test",
    description="Simple Blog API for testing without database",
    version="1.0.0",
)

# Mock data for testing
mock_posts = [
    {
        "id": 1,
        "slug": "openai-releases-gpt-5",
        "title": "OpenAI Releases GPT-5 with Enhanced Multimodal Capabilities",
        "excerpt": "The latest iteration of GPT brings unprecedented improvements in image understanding and generation.",
        "content_html": "<p>OpenAI has announced the release of GPT-5...</p>",
        "cover_image_url": "https://example.com/gpt5.jpg",
        "source_name": "TechCrunch",
        "source_url": "https://techcrunch.com/gpt5",
        "author": "John Doe",
        "published_at": "2024-01-15T10:00:00Z",
        "tags": ["AI", "OpenAI", "GPT", "Machine Learning"],
        "canonical_url": "https://techcrunch.com/gpt5",
        "og_title": "OpenAI Releases GPT-5",
        "og_description": "Enhanced multimodal capabilities in latest GPT release",
        "og_image": "https://example.com/gpt5-og.jpg",
        "is_published": True,
        "is_featured": True,
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
    },
    {
        "id": 2,
        "slug": "nextjs-15-server-components",
        "title": "Next.js 15 Introduces Revolutionary Server Components",
        "excerpt": "The latest version of Next.js brings significant performance improvements and new features.",
        "content_html": "<p>Next.js 15 has been released with major updates...</p>",
        "cover_image_url": "https://example.com/nextjs15.jpg",
        "source_name": "Vercel Blog",
        "source_url": "https://vercel.com/blog/nextjs15",
        "author": "Jane Smith",
        "published_at": "2024-01-14T15:30:00Z",
        "tags": ["Next.js", "React", "Web Development", "Performance"],
        "canonical_url": "https://vercel.com/blog/nextjs15",
        "og_title": "Next.js 15 Server Components",
        "og_description": "Revolutionary server components in Next.js 15",
        "og_image": "https://example.com/nextjs15-og.jpg",
        "is_published": True,
        "is_featured": False,
        "created_at": "2024-01-14T15:30:00Z",
        "updated_at": "2024-01-14T15:30:00Z"
    },
    {
        "id": 3,
        "slug": "docker-container-security",
        "title": "Docker Announces New Container Security Features",
        "excerpt": "Enhanced security scanning and runtime protection features make Docker containers more secure.",
        "content_html": "<p>Docker has introduced new security features...</p>",
        "cover_image_url": "https://example.com/docker-security.jpg",
        "source_name": "Docker Blog",
        "source_url": "https://docker.com/blog/security",
        "author": "Mike Johnson",
        "published_at": "2024-01-13T09:15:00Z",
        "tags": ["Docker", "Security", "DevOps", "Containers"],
        "canonical_url": "https://docker.com/blog/security",
        "og_title": "Docker Container Security",
        "og_description": "New security features for Docker containers",
        "og_image": "https://example.com/docker-security-og.jpg",
        "is_published": True,
        "is_featured": False,
        "created_at": "2024-01-13T09:15:00Z",
        "updated_at": "2024-01-13T09:15:00Z"
    }
]

# Mock jobs data
mock_jobs = [
    {
        "id": 1,
        "title": "Senior Frontend Developer",
        "company": "TechCorp Inc.",
        "salary": "$120,000 - $150,000",
        "location": "San Francisco, CA",
        "type": "Full-time",
        "logo": "https://logo.clearbit.com/google.com",
        "accentColor": "border-blue-500",
        "role": "frontend",
        "roleColor": "#3B82F6",
        "description": "We're looking for a Senior Frontend Developer to join our growing team and build amazing user experiences.",
        "requirements": ["React", "TypeScript", "5+ years experience", "Team leadership"],
        "postedDate": "2 days ago",
        "experience": "Senior",
        "skills": ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
        "isRemote": True,
        "isUrgent": True,
        "salary_min": 120000,
        "salary_max": 150000,
        "published_at": "2024-01-15T10:00:00Z",
        "created_at": "2024-01-15T10:00:00Z"
    },
    {
        "id": 2,
        "title": "Backend Engineer",
        "company": "StartupXYZ",
        "salary": "$90,000 - $120,000",
        "location": "New York, NY",
        "type": "Full-time",
        "logo": "https://logo.clearbit.com/microsoft.com",
        "accentColor": "border-green-500",
        "role": "backend",
        "roleColor": "#10B981",
        "description": "Join our backend team to build scalable microservices and APIs that power our platform.",
        "requirements": ["Node.js", "Python", "AWS", "3+ years experience"],
        "postedDate": "1 week ago",
        "experience": "Mid-level",
        "skills": ["Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
        "isRemote": False,
        "isUrgent": False,
        "salary_min": 90000,
        "salary_max": 120000,
        "published_at": "2024-01-08T15:30:00Z",
        "created_at": "2024-01-08T15:30:00Z"
    },
    {
        "id": 3,
        "title": "Full Stack Developer",
        "company": "Innovation Labs",
        "salary": "$95,000 - $125,000",
        "location": "Remote",
        "type": "Full-time",
        "logo": "https://logo.clearbit.com/netflix.com",
        "accentColor": "border-red-500",
        "role": "fullstack",
        "roleColor": "#EF4444",
        "description": "Build end-to-end solutions for our cutting-edge platform using modern technologies.",
        "requirements": ["React", "Node.js", "MongoDB", "3+ years experience"],
        "postedDate": "1 day ago",
        "experience": "Mid-level",
        "skills": ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
        "isRemote": True,
        "isUrgent": False,
        "salary_min": 95000,
        "salary_max": 125000,
        "published_at": "2024-01-14T09:15:00Z",
        "created_at": "2024-01-14T09:15:00Z"
    },
    {
        "id": 4,
        "title": "DevOps Engineer",
        "company": "CloudTech Solutions",
        "salary": "$100,000 - $130,000",
        "location": "Austin, TX",
        "type": "Full-time",
        "logo": "https://logo.clearbit.com/amazon.com",
        "accentColor": "border-orange-500",
        "role": "devops",
        "roleColor": "#F59E0B",
        "description": "Build and maintain our cloud infrastructure using modern DevOps practices and tools.",
        "requirements": ["AWS", "Kubernetes", "Terraform", "4+ years experience"],
        "postedDate": "5 days ago",
        "experience": "Senior",
        "skills": ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
        "isRemote": False,
        "isUrgent": True,
        "salary_min": 100000,
        "salary_max": 130000,
        "published_at": "2024-01-10T11:20:00Z",
        "created_at": "2024-01-10T11:20:00Z"
    },
    {
        "id": 5,
        "title": "Data Scientist",
        "company": "Analytics Pro",
        "salary": "$110,000 - $140,000",
        "location": "Boston, MA",
        "type": "Full-time",
        "logo": "https://logo.clearbit.com/spotify.com",
        "accentColor": "border-indigo-500",
        "role": "data",
        "roleColor": "#6366F1",
        "description": "Transform data into actionable insights using machine learning and statistical analysis.",
        "requirements": ["Python", "Machine Learning", "SQL", "PhD preferred"],
        "postedDate": "4 days ago",
        "experience": "Senior",
        "skills": ["Python", "R", "SQL", "Machine Learning", "Statistics"],
        "isRemote": False,
        "isUrgent": False,
        "salary_min": 110000,
        "salary_max": 140000,
        "published_at": "2024-01-11T14:45:00Z",
        "created_at": "2024-01-11T14:45:00Z"
    }
]

# Mock companies data
mock_companies = [
    {
        "id": 1,
        "name": "TechCorp Inc.",
        "industry": "Technology",
        "size": "LARGE",
        "website": "https://techcorp.com",
        "description": "Leading technology company focused on innovation",
        "logo": "https://logo.clearbit.com/google.com",
        "location": "San Francisco, CA",
        "founded": 2010,
        "employees": "1000-5000"
    },
    {
        "id": 2,
        "name": "StartupXYZ",
        "industry": "Technology",
        "size": "SMALL",
        "website": "https://startupxyz.com",
        "description": "Innovative startup building the future",
        "logo": "https://logo.clearbit.com/microsoft.com",
        "location": "New York, NY",
        "founded": 2020,
        "employees": "10-50"
    },
    {
        "id": 3,
        "name": "Innovation Labs",
        "industry": "Technology",
        "size": "MEDIUM",
        "website": "https://innovationlabs.com",
        "description": "Research and development company",
        "logo": "https://logo.clearbit.com/netflix.com",
        "location": "Remote",
        "founded": 2015,
        "employees": "100-500"
    }
]

@app.get("/")
async def root():
    return {
        "message": "JobFlix Blog API Test",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "endpoints": {
            "posts": "/api/v1/blog/posts",
            "post_by_id": "/api/v1/blog/posts/{id}",
            "stats": "/api/v1/blog/stats",
            "jobs": "/api/v1/jobs",
            "companies": "/api/v1/companies",
            "dashboard_stats": "/api/v1/dashboard/stats"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "JobFlix Blog API Test",
        "version": "1.0.0",
        "posts_count": len(mock_posts),
        "jobs_count": len(mock_jobs),
        "companies_count": len(mock_companies)
    }

@app.get("/api/v1/blog/posts")
async def get_posts(
    page: int = 1,
    page_size: int = 20,
    source: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    featured_only: bool = False
):
    """Get paginated list of blog posts with filtering"""
    
    # Apply filters
    filtered_posts = mock_posts.copy()
    
    if source:
        filtered_posts = [p for p in filtered_posts if source.lower() in p["source_name"].lower()]
    
    if tag:
        filtered_posts = [p for p in filtered_posts if tag.lower() in [t.lower() for t in p["tags"]]]
    
    if search:
        search_lower = search.lower()
        filtered_posts = [p for p in filtered_posts 
                         if search_lower in p["title"].lower() or search_lower in p["excerpt"].lower()]
    
    if featured_only:
        filtered_posts = [p for p in filtered_posts if p["is_featured"]]
    
    # Apply pagination
    total = len(filtered_posts)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_posts = filtered_posts[start:end]
    
    # Calculate pagination info
    total_pages = (total + page_size - 1) // page_size
    has_next = page < total_pages
    has_prev = page > 1
    
    return {
        "posts": paginated_posts,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": has_next,
        "has_prev": has_prev
    }

@app.get("/api/v1/blog/posts/{post_id}")
async def get_post(post_id: int):
    """Get a single blog post by ID"""
    
    post = next((p for p in mock_posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return post

@app.get("/api/v1/blog/stats")
async def get_blog_stats():
    """Get blog statistics"""
    
    total_posts = len(mock_posts)
    published_posts = len([p for p in mock_posts if p["is_published"]])
    featured_posts = len([p for p in mock_posts if p["is_featured"]])
    
    # Posts by source
    sources = {}
    for post in mock_posts:
        source = post["source_name"]
        sources[source] = sources.get(source, 0) + 1
    
    return {
        "total_posts": total_posts,
        "published_posts": published_posts,
        "featured_posts": featured_posts,
        "posts_by_source": sources
    }

@app.post("/api/v1/blog/sources/ingest")
async def ingest_news():
    """Mock news ingestion endpoint"""
    
    return {
        "success": True,
        "message": "Mock ingestion completed successfully",
        "articles_processed": 3,
        "new_articles": 2,
        "updated_articles": 1
    }

# Jobs API endpoints
@app.get("/api/v1/jobs")
async def get_jobs(
    page: int = 1,
    page_size: int = 20,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    experience: Optional[str] = None,
    search: Optional[str] = None,
    remote_only: bool = False
):
    """Get paginated list of jobs with filtering"""
    
    # Apply filters
    filtered_jobs = mock_jobs.copy()
    
    if location:
        filtered_jobs = [j for j in filtered_jobs if location.lower() in j["location"].lower()]
    
    if job_type:
        filtered_jobs = [j for j in filtered_jobs if job_type.lower() in j["type"].lower()]
    
    if experience:
        filtered_jobs = [j for j in filtered_jobs if experience.lower() in j["experience"].lower()]
    
    if search:
        search_lower = search.lower()
        filtered_jobs = [j for j in filtered_jobs 
                        if search_lower in j["title"].lower() or 
                           search_lower in j["company"].lower() or
                           any(search_lower in skill.lower() for skill in j["skills"])]
    
    if remote_only:
        filtered_jobs = [j for j in filtered_jobs if j["isRemote"]]
    
    # Apply pagination
    total = len(filtered_jobs)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_jobs = filtered_jobs[start:end]
    
    # Calculate pagination info
    total_pages = (total + page_size - 1) // page_size
    has_next = page < total_pages
    has_prev = page > 1
    
    return {
        "jobs": paginated_jobs,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": has_next,
        "has_prev": has_prev
    }

@app.get("/api/v1/jobs/{job_id}")
async def get_job(job_id: int):
    """Get a single job by ID"""
    
    job = next((j for j in mock_jobs if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return job

@app.get("/api/v1/companies")
async def get_companies():
    """Get list of companies"""
    
    return {
        "companies": mock_companies,
        "total": len(mock_companies)
    }

@app.get("/api/v1/companies/{company_id}")
async def get_company(company_id: int):
    """Get a single company by ID"""
    
    company = next((c for c in mock_companies if c["id"] == company_id), None)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return company

@app.get("/api/v1/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    
    total_jobs = len(mock_jobs)
    remote_jobs = len([j for j in mock_jobs if j["isRemote"]])
    urgent_jobs = len([j for j in mock_jobs if j["isUrgent"]])
    
    # Jobs by experience level
    experience_stats = {}
    for job in mock_jobs:
        exp = job["experience"]
        experience_stats[exp] = experience_stats.get(exp, 0) + 1
    
    # Jobs by location
    location_stats = {}
    for job in mock_jobs:
        loc = job["location"]
        location_stats[loc] = location_stats.get(loc, 0) + 1
    
    # Average salary
    salaries = [job["salary_min"] for job in mock_jobs if job.get("salary_min")]
    avg_salary = sum(salaries) // len(salaries) if salaries else 0
    
    return {
        "total_jobs": total_jobs,
        "remote_jobs": remote_jobs,
        "urgent_jobs": urgent_jobs,
        "total_companies": len(mock_companies),
        "total_posts": len(mock_posts),
        "experience_distribution": experience_stats,
        "location_distribution": location_stats,
        "average_salary": avg_salary,
        "recent_jobs": [j for j in mock_jobs if "1 day" in j["postedDate"] or "2 days" in j["postedDate"]]
    }

if __name__ == "__main__":
    print("🚀 Starting JobFlix Blog API Test...")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔍 ReDoc Documentation: http://localhost:8000/redoc")
    print("🏥 Health Check: http://localhost:8000/health")
    print("📰 Blog Posts: http://localhost:8000/api/v1/blog/posts")
    print("📊 Blog Stats: http://localhost:8000/api/v1/blog/stats")
    uvicorn.run(app, host="0.0.0.0", port=8000)
