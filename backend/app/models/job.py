"""
Job and company models
"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, Enum, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class JobStatus(str, enum.Enum):
    """Job status enumeration"""
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    CLOSED = "CLOSED"
    EXPIRED = "EXPIRED"


class ApplicationStatus(str, enum.Enum):
    """Application status enumeration"""
    PENDING = "PENDING"
    REVIEWING = "REVIEWING"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    INTERVIEWED = "INTERVIEWED"
    OFFERED = "OFFERED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class CompanySize(str, enum.Enum):
    """Company size enumeration"""
    STARTUP = "STARTUP"  # 1-10
    SMALL = "SMALL"      # 11-50
    MEDIUM = "MEDIUM"    # 51-200
    LARGE = "LARGE"      # 201-1000
    ENTERPRISE = "ENTERPRISE"  # 1000+


class Industry(str, enum.Enum):
    """Industry enumeration"""
    TECHNOLOGY = "TECHNOLOGY"
    FINANCE = "FINANCE"
    HEALTHCARE = "HEALTHCARE"
    EDUCATION = "EDUCATION"
    RETAIL = "RETAIL"
    MANUFACTURING = "MANUFACTURING"
    CONSULTING = "CONSULTING"
    MEDIA = "MEDIA"
    REAL_ESTATE = "REAL_ESTATE"
    TRANSPORTATION = "TRANSPORTATION"
    ENERGY = "ENERGY"
    GOVERNMENT = "GOVERNMENT"
    NON_PROFIT = "NON_PROFIT"
    OTHER = "OTHER"


# Association table for job requirements
job_requirements = Table(
    'job_requirements',
    Base.metadata,
    Column('job_id', UUID(as_uuid=True), ForeignKey('jobs.id'), primary_key=True),
    Column('skill_id', UUID(as_uuid=True), ForeignKey('skills.id'), primary_key=True),
    Column('is_required', Boolean, default=True),
    Column('years_experience', Integer, default=0),
)


class Company(Base):
    """Company model"""
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    industry = Column(Enum(Industry), nullable=False)
    size = Column(Enum(CompanySize), nullable=False)
    website = Column(String(500), nullable=True)
    logo_url = Column(String(500), nullable=True)
    headquarters = Column(String(255), nullable=True)
    founded_year = Column(Integer, nullable=True)
    employee_count = Column(Integer, nullable=True)
    
    # Social media
    linkedin_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    facebook_url = Column(String(500), nullable=True)
    
    # Company culture
    mission = Column(Text, nullable=True)
    values = Column(ARRAY(String), default=[], nullable=False)
    benefits = Column(ARRAY(String), default=[], nullable=False)
    
    # Verification
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")
    company_users = relationship("CompanyUser", back_populates="company", cascade="all, delete-orphan")


class CompanyUser(Base):
    """Company user relationship model"""
    __tablename__ = "company_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False)  # ADMIN, HR, RECRUITER, etc.
    is_admin = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="company_users")
    user = relationship("User", back_populates="company_users")


class Job(Base):
    """Job model"""
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(ARRAY(String), default=[], nullable=False)
    responsibilities = Column(ARRAY(String), default=[], nullable=False)
    benefits = Column(ARRAY(String), default=[], nullable=False)
    
    # Company and location
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    location = Column(String(255), nullable=False)
    is_remote = Column(Boolean, default=False, nullable=False)
    remote_percentage = Column(Integer, default=0, nullable=False)  # 0-100
    
    # Job details
    work_type = Column(ARRAY(String), default=[], nullable=False)  # FULL_TIME, PART_TIME, etc.
    experience_level = Column(String(50), nullable=False)  # ENTRY_LEVEL, SENIOR, etc.
    employment_type = Column(String(50), default="PERMANENT", nullable=False)  # PERMANENT, CONTRACT, etc.
    
    # Salary
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String(3), default="USD", nullable=False)
    salary_period = Column(String(20), default="YEARLY", nullable=False)  # YEARLY, MONTHLY, HOURLY
    equity_offered = Column(Boolean, default=False, nullable=False)
    
    # Application details
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    application_url = Column(String(500), nullable=True)
    application_email = Column(String(255), nullable=True)
    application_instructions = Column(Text, nullable=True)
    
    # Job status
    status = Column(Enum(JobStatus), default=JobStatus.DRAFT, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_urgent = Column(Boolean, default=False, nullable=False)
    
    # SEO and tags
    tags = Column(ARRAY(String), default=[], nullable=False)
    keywords = Column(ARRAY(String), default=[], nullable=False)
    
    # Metrics
    view_count = Column(Integer, default=0, nullable=False)
    application_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    company = relationship("Company", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")
    required_skills = relationship("Skill", secondary=job_requirements, back_populates="job_requirements")


class Application(Base):
    """Job application model"""
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    
    # Application details
    cover_letter = Column(Text, nullable=True)
    resume_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    
    # Status and tracking
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING, nullable=False)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    status_updated_at = Column(DateTime(timezone=True), nullable=True)
    status_updated_by = Column(UUID(as_uuid=True), nullable=True)
    
    # Interview details
    interview_scheduled_at = Column(DateTime(timezone=True), nullable=True)
    interview_notes = Column(Text, nullable=True)
    interview_feedback = Column(Text, nullable=True)
    
    # Offer details
    offer_made_at = Column(DateTime(timezone=True), nullable=True)
    offer_deadline = Column(DateTime(timezone=True), nullable=True)
    offer_accepted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Additional information
    expected_salary = Column(Integer, nullable=True)
    availability_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class SavedJob(Base):
    """Saved job model"""
    __tablename__ = "saved_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    
    # User notes and tags
    notes = Column(Text, nullable=True)
    tags = Column(ARRAY(String), default=[], nullable=False)
    priority = Column(String(20), default="MEDIUM", nullable=False)  # HIGH, MEDIUM, LOW
    
    # Tracking
    saved_at = Column(DateTime(timezone=True), server_default=func.now())
    last_viewed_at = Column(DateTime(timezone=True), nullable=True)
    view_count = Column(Integer, default=0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_jobs")
