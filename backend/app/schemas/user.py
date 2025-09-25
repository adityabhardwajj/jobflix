"""
User-related Pydantic schemas
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
import enum

from app.models.user import UserRole, WorkType, ExperienceLevel, SkillCategory, SkillLevel


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: UserRole = UserRole.JOB_SEEKER


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserUpdate(BaseModel):
    """User update schema"""
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None


class UserInDB(UserBase):
    """User in database schema"""
    id: UUID
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDB):
    """User response schema"""
    pass


class UserProfileBase(BaseModel):
    """Base user profile schema"""
    bio: Optional[str] = None
    location: Optional[str] = None
    current_role: Optional[str] = None
    experience_years: int = 0
    education: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    website_url: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    """User profile creation schema"""
    desired_salary_min: Optional[int] = None
    desired_salary_max: Optional[int] = None
    desired_salary_currency: str = "USD"
    preferred_work_types: List[WorkType] = []
    preferred_locations: List[str] = []
    remote_work: bool = False
    willing_to_relocate: bool = False
    available_from: Optional[datetime] = None
    notice_period_days: int = 30


class UserProfileUpdate(UserProfileBase):
    """User profile update schema"""
    desired_salary_min: Optional[int] = None
    desired_salary_max: Optional[int] = None
    desired_salary_currency: Optional[str] = None
    preferred_work_types: Optional[List[WorkType]] = None
    preferred_locations: Optional[List[str]] = None
    remote_work: Optional[bool] = None
    willing_to_relocate: Optional[bool] = None
    available_from: Optional[datetime] = None
    notice_period_days: Optional[int] = None


class UserProfile(UserProfileBase):
    """User profile response schema"""
    id: UUID
    user_id: UUID
    desired_salary_min: Optional[int] = None
    desired_salary_max: Optional[int] = None
    desired_salary_currency: str
    preferred_work_types: List[WorkType]
    preferred_locations: List[str]
    remote_work: bool
    willing_to_relocate: bool
    available_from: Optional[datetime] = None
    notice_period_days: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SkillBase(BaseModel):
    """Base skill schema"""
    name: str = Field(..., min_length=1, max_length=100)
    category: SkillCategory
    description: Optional[str] = None


class SkillCreate(SkillBase):
    """Skill creation schema"""
    pass


class SkillUpdate(BaseModel):
    """Skill update schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[SkillCategory] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class Skill(SkillBase):
    """Skill response schema"""
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserSkillBase(BaseModel):
    """Base user skill schema"""
    skill_id: UUID
    level: SkillLevel
    years_experience: int = 0


class UserSkillCreate(UserSkillBase):
    """User skill creation schema"""
    pass


class UserSkillUpdate(BaseModel):
    """User skill update schema"""
    level: Optional[SkillLevel] = None
    years_experience: Optional[int] = None


class UserSkill(UserSkillBase):
    """User skill response schema"""
    id: UUID
    skill: Skill
    created_at: datetime

    class Config:
        from_attributes = True


class UserPreferencesBase(BaseModel):
    """Base user preferences schema"""
    email_notifications: bool = True
    push_notifications: bool = True
    sms_notifications: bool = False
    job_alerts_enabled: bool = True
    alert_frequency: str = "DAILY"
    profile_visibility: str = "PUBLIC"
    show_salary: bool = True
    show_contact_info: bool = False


class UserPreferencesCreate(UserPreferencesBase):
    """User preferences creation schema"""
    preferred_industries: List[str] = []
    preferred_company_sizes: List[str] = []
    preferred_technologies: List[str] = []


class UserPreferencesUpdate(BaseModel):
    """User preferences update schema"""
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    job_alerts_enabled: Optional[bool] = None
    alert_frequency: Optional[str] = None
    profile_visibility: Optional[str] = None
    show_salary: Optional[bool] = None
    show_contact_info: Optional[bool] = None
    preferred_industries: Optional[List[str]] = None
    preferred_company_sizes: Optional[List[str]] = None
    preferred_technologies: Optional[List[str]] = None


class UserPreferences(UserPreferencesBase):
    """User preferences response schema"""
    id: UUID
    user_id: UUID
    preferred_industries: List[str]
    preferred_company_sizes: List[str]
    preferred_technologies: List[str]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserWithProfile(User):
    """User with profile schema"""
    profile: Optional[UserProfile] = None
    skills: List[UserSkill] = []
    preferences: Optional[UserPreferences] = None


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Token data schema"""
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema"""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request schema"""
    email: EmailStr


class PasswordReset(BaseModel):
    """Password reset schema"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class ChangePasswordRequest(BaseModel):
    """Change password request schema"""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
