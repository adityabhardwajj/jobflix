"""
User and related models
"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, Enum, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    JOB_SEEKER = "JOB_SEEKER"
    EMPLOYER = "EMPLOYER"
    ADMIN = "ADMIN"


class WorkType(str, enum.Enum):
    """Work type enumeration"""
    FULL_TIME = "FULL_TIME"
    PART_TIME = "PART_TIME"
    CONTRACT = "CONTRACT"
    INTERNSHIP = "INTERNSHIP"
    FREELANCE = "FREELANCE"


class ExperienceLevel(str, enum.Enum):
    """Experience level enumeration"""
    ENTRY_LEVEL = "ENTRY_LEVEL"
    JUNIOR = "JUNIOR"
    MID_LEVEL = "MID_LEVEL"
    SENIOR = "SENIOR"
    LEAD = "LEAD"
    EXECUTIVE = "EXECUTIVE"


class SkillCategory(str, enum.Enum):
    """Skill category enumeration"""
    PROGRAMMING_LANGUAGE = "PROGRAMMING_LANGUAGE"
    FRAMEWORK = "FRAMEWORK"
    DATABASE = "DATABASE"
    CLOUD = "CLOUD"
    TOOL = "TOOL"
    SOFT_SKILL = "SOFT_SKILL"
    LANGUAGE = "LANGUAGE"
    OTHER = "OTHER"


class SkillLevel(str, enum.Enum):
    """Skill level enumeration"""
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"


# Association table for user skills
user_skills = Table(
    'user_skills',
    Base.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id'), primary_key=True),
    Column('skill_id', UUID(as_uuid=True), ForeignKey('skills.id'), primary_key=True),
    Column('level', Enum(SkillLevel), nullable=False),
    Column('years_experience', Integer, default=0),
    Column('created_at', DateTime(timezone=True), server_default=func.now()),
)


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.JOB_SEEKER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    job_alerts = relationship("JobAlert", back_populates="user", cascade="all, delete-orphan")
    company_users = relationship("CompanyUser", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("Skill", secondary=user_skills, back_populates="users")


class UserProfile(Base):
    """User profile model"""
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    current_role = Column(String(255), nullable=True)
    experience_years = Column(Integer, default=0, nullable=False)
    education = Column(Text, nullable=True)
    resume_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    website_url = Column(String(500), nullable=True)
    
    # Salary preferences
    desired_salary_min = Column(Integer, nullable=True)
    desired_salary_max = Column(Integer, nullable=True)
    desired_salary_currency = Column(String(3), default="USD", nullable=False)
    
    # Work preferences
    preferred_work_types = Column(ARRAY(Enum(WorkType)), default=[], nullable=False)
    preferred_locations = Column(ARRAY(String), default=[], nullable=False)
    remote_work = Column(Boolean, default=False, nullable=False)
    willing_to_relocate = Column(Boolean, default=False, nullable=False)
    
    # Availability
    available_from = Column(DateTime(timezone=True), nullable=True)
    notice_period_days = Column(Integer, default=30, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")


class Skill(Base):
    """Skill model"""
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(Enum(SkillCategory), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    users = relationship("User", secondary=user_skills, back_populates="skills")
    job_requirements = relationship("Job", secondary="job_requirements", back_populates="required_skills")


class UserPreferences(Base):
    """User preferences model"""
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True, nullable=False)
    push_notifications = Column(Boolean, default=True, nullable=False)
    sms_notifications = Column(Boolean, default=False, nullable=False)
    
    # Job alert preferences
    job_alerts_enabled = Column(Boolean, default=True, nullable=False)
    alert_frequency = Column(String(20), default="DAILY", nullable=False)  # DAILY, WEEKLY, MONTHLY
    
    # Privacy preferences
    profile_visibility = Column(String(20), default="PUBLIC", nullable=False)  # PUBLIC, PRIVATE, CONNECTIONS_ONLY
    show_salary = Column(Boolean, default=True, nullable=False)
    show_contact_info = Column(Boolean, default=False, nullable=False)
    
    # Search preferences
    preferred_industries = Column(ARRAY(String), default=[], nullable=False)
    preferred_company_sizes = Column(ARRAY(String), default=[], nullable=False)
    preferred_technologies = Column(ARRAY(String), default=[], nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User")
