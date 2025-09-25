"""
Job-related Pydantic schemas
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
import enum

from app.models.job import JobStatus, ApplicationStatus, CompanySize, Industry


class CompanyBase(BaseModel):
    """Base company schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    industry: Industry
    size: CompanySize
    website: Optional[str] = None
    logo_url: Optional[str] = None
    headquarters: Optional[str] = None
    founded_year: Optional[int] = None
    employee_count: Optional[int] = None


class CompanyCreate(CompanyBase):
    """Company creation schema"""
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    facebook_url: Optional[str] = None
    mission: Optional[str] = None
    values: List[str] = []
    benefits: List[str] = []


class CompanyUpdate(BaseModel):
    """Company update schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    industry: Optional[Industry] = None
    size: Optional[CompanySize] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    headquarters: Optional[str] = None
    founded_year: Optional[int] = None
    employee_count: Optional[int] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    facebook_url: Optional[str] = None
    mission: Optional[str] = None
    values: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = None


class Company(CompanyBase):
    """Company response schema"""
    id: UUID
    slug: str
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    facebook_url: Optional[str] = None
    mission: Optional[str] = None
    values: List[str]
    benefits: List[str]
    is_verified: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CompanyUserBase(BaseModel):
    """Base company user schema"""
    company_id: UUID
    user_id: UUID
    role: str = Field(..., min_length=1, max_length=50)
    is_admin: bool = False


class CompanyUserCreate(CompanyUserBase):
    """Company user creation schema"""
    pass


class CompanyUserUpdate(BaseModel):
    """Company user update schema"""
    role: Optional[str] = Field(None, min_length=1, max_length=50)
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None


class CompanyUser(CompanyUserBase):
    """Company user response schema"""
    id: UUID
    is_active: bool
    joined_at: datetime
    left_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobBase(BaseModel):
    """Base job schema"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    requirements: List[str] = []
    responsibilities: List[str] = []
    benefits: List[str] = []
    location: str = Field(..., min_length=1, max_length=255)
    is_remote: bool = False
    remote_percentage: int = Field(0, ge=0, le=100)
    work_type: List[str] = []
    experience_level: str = Field(..., min_length=1, max_length=50)
    employment_type: str = "PERMANENT"


class JobCreate(JobBase):
    """Job creation schema"""
    company_id: UUID
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    salary_currency: str = "USD"
    salary_period: str = "YEARLY"
    equity_offered: bool = False
    application_deadline: Optional[datetime] = None
    application_url: Optional[str] = None
    application_email: Optional[str] = None
    application_instructions: Optional[str] = None
    is_featured: bool = False
    is_urgent: bool = False
    tags: List[str] = []
    keywords: List[str] = []
    required_skill_ids: List[UUID] = []

    @validator('salary_max')
    def validate_salary_range(cls, v, values):
        if v is not None and 'salary_min' in values and values['salary_min'] is not None:
            if v < values['salary_min']:
                raise ValueError('Maximum salary must be greater than minimum salary')
        return v


class JobUpdate(BaseModel):
    """Job update schema"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    requirements: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    is_remote: Optional[bool] = None
    remote_percentage: Optional[int] = Field(None, ge=0, le=100)
    work_type: Optional[List[str]] = None
    experience_level: Optional[str] = Field(None, min_length=1, max_length=50)
    employment_type: Optional[str] = None
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    salary_currency: Optional[str] = None
    salary_period: Optional[str] = None
    equity_offered: Optional[bool] = None
    application_deadline: Optional[datetime] = None
    application_url: Optional[str] = None
    application_email: Optional[str] = None
    application_instructions: Optional[str] = None
    status: Optional[JobStatus] = None
    is_featured: Optional[bool] = None
    is_urgent: Optional[bool] = None
    tags: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    required_skill_ids: Optional[List[UUID]] = None


class Job(JobBase):
    """Job response schema"""
    id: UUID
    slug: str
    company_id: UUID
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str
    salary_period: str
    equity_offered: bool
    application_deadline: Optional[datetime] = None
    application_url: Optional[str] = None
    application_email: Optional[str] = None
    application_instructions: Optional[str] = None
    status: JobStatus
    is_featured: bool
    is_urgent: bool
    tags: List[str]
    keywords: List[str]
    view_count: int
    application_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobWithCompany(Job):
    """Job with company information schema"""
    company: Company


class ApplicationBase(BaseModel):
    """Base application schema"""
    job_id: UUID
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    """Application creation schema"""
    expected_salary: Optional[int] = Field(None, ge=0)
    availability_date: Optional[datetime] = None
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    """Application update schema"""
    status: Optional[ApplicationStatus] = None
    interview_scheduled_at: Optional[datetime] = None
    interview_notes: Optional[str] = None
    interview_feedback: Optional[str] = None
    offer_made_at: Optional[datetime] = None
    offer_deadline: Optional[datetime] = None
    offer_accepted_at: Optional[datetime] = None
    notes: Optional[str] = None


class Application(ApplicationBase):
    """Application response schema"""
    id: UUID
    user_id: UUID
    status: ApplicationStatus
    applied_at: datetime
    status_updated_at: Optional[datetime] = None
    status_updated_by: Optional[UUID] = None
    interview_scheduled_at: Optional[datetime] = None
    interview_notes: Optional[str] = None
    interview_feedback: Optional[str] = None
    offer_made_at: Optional[datetime] = None
    offer_deadline: Optional[datetime] = None
    offer_accepted_at: Optional[datetime] = None
    expected_salary: Optional[int] = None
    availability_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ApplicationWithJob(Application):
    """Application with job information schema"""
    job: Job


class SavedJobBase(BaseModel):
    """Base saved job schema"""
    job_id: UUID
    notes: Optional[str] = None
    tags: List[str] = []
    priority: str = "MEDIUM"


class SavedJobCreate(SavedJobBase):
    """Saved job creation schema"""
    pass


class SavedJobUpdate(BaseModel):
    """Saved job update schema"""
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    priority: Optional[str] = None


class SavedJob(SavedJobBase):
    """Saved job response schema"""
    id: UUID
    user_id: UUID
    saved_at: datetime
    last_viewed_at: Optional[datetime] = None
    view_count: int

    class Config:
        from_attributes = True


class SavedJobWithJob(SavedJob):
    """Saved job with job information schema"""
    job: Job


class JobSearchFilters(BaseModel):
    """Job search filters schema"""
    query: Optional[str] = None
    location: Optional[str] = None
    work_type: Optional[List[str]] = None
    experience_level: Optional[str] = None
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    company_id: Optional[UUID] = None
    industry: Optional[Industry] = None
    company_size: Optional[CompanySize] = None
    is_remote: Optional[bool] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_urgent: Optional[bool] = None
    posted_after: Optional[datetime] = None
    posted_before: Optional[datetime] = None


class JobSearchResponse(BaseModel):
    """Job search response schema"""
    jobs: List[JobWithCompany]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool


class JobMatchRequest(BaseModel):
    """Job match request schema"""
    user_id: UUID
    limit: int = Field(10, ge=1, le=50)
    include_applied: bool = False
    min_match_score: float = Field(0.6, ge=0.0, le=1.0)


class JobMatch(BaseModel):
    """Job match schema"""
    job: JobWithCompany
    match_score: float = Field(..., ge=0.0, le=1.0)
    match_reasons: List[str] = []
    strengths: List[str] = []
    concerns: List[str] = []


class JobMatchResponse(BaseModel):
    """Job match response schema"""
    matches: List[JobMatch]
    total_jobs_analyzed: int
    total_matches: int
    processing_time: float
