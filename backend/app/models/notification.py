"""
Notification and alert models
"""

from sqlalchemy import Column, String, DateTime, Boolean, Text, Integer, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class NotificationType(str, enum.Enum):
    """Notification type enumeration"""
    NEW_APPLICATION = "NEW_APPLICATION"
    APPLICATION_STATUS_UPDATE = "APPLICATION_STATUS_UPDATE"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    JOB_ALERT = "JOB_ALERT"
    NEW_JOB_MATCH = "NEW_JOB_MATCH"
    COMPANY_UPDATE = "COMPANY_UPDATE"
    SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT"
    PROFILE_VIEW = "PROFILE_VIEW"
    CONNECTION_REQUEST = "CONNECTION_REQUEST"
    MESSAGE = "MESSAGE"


class AlertFrequency(str, enum.Enum):
    """Alert frequency enumeration"""
    IMMEDIATE = "IMMEDIATE"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class NotificationPriority(str, enum.Enum):
    """Notification priority enumeration"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class Notification(Base):
    """Notification model"""
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Notification content
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(Text, nullable=True)  # JSON data for additional context
    
    # Status and delivery
    is_read = Column(Boolean, default=False, nullable=False)
    is_sent = Column(Boolean, default=False, nullable=False)
    priority = Column(Enum(NotificationPriority), default=NotificationPriority.MEDIUM, nullable=False)
    
    # Delivery channels
    email_sent = Column(Boolean, default=False, nullable=False)
    push_sent = Column(Boolean, default=False, nullable=False)
    sms_sent = Column(Boolean, default=False, nullable=False)
    
    # Related entities
    related_job_id = Column(UUID(as_uuid=True), nullable=True)
    related_application_id = Column(UUID(as_uuid=True), nullable=True)
    related_company_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Links and actions
    action_url = Column(String(500), nullable=True)
    action_text = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")


class JobAlert(Base):
    """Job alert model"""
    __tablename__ = "job_alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Alert criteria
    name = Column(String(255), nullable=False)
    keywords = Column(ARRAY(String), default=[], nullable=False)
    location = Column(String(255), nullable=True)
    work_type = Column(ARRAY(String), default=[], nullable=False)
    experience_level = Column(String(50), nullable=True)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String(3), default="USD", nullable=False)
    
    # Company filters
    company_ids = Column(ARRAY(UUID), default=[], nullable=False)
    company_sizes = Column(ARRAY(String), default=[], nullable=False)
    industries = Column(ARRAY(String), default=[], nullable=False)
    
    # Alert settings
    frequency = Column(Enum(AlertFrequency), default=AlertFrequency.DAILY, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    max_results = Column(Integer, default=10, nullable=False)
    
    # Tracking
    last_sent_at = Column(DateTime(timezone=True), nullable=True)
    total_sent = Column(Integer, default=0, nullable=False)
    total_matches = Column(Integer, default=0, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="job_alerts")


class EmailTemplate(Base):
    """Email template model"""
    __tablename__ = "email_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    subject = Column(String(255), nullable=False)
    body_html = Column(Text, nullable=False)
    body_text = Column(Text, nullable=True)
    variables = Column(ARRAY(String), default=[], nullable=False)  # Available template variables
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class NotificationSettings(Base):
    """User notification settings model"""
    __tablename__ = "notification_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    
    # Email settings
    email_enabled = Column(Boolean, default=True, nullable=False)
    email_new_applications = Column(Boolean, default=True, nullable=False)
    email_application_updates = Column(Boolean, default=True, nullable=False)
    email_job_alerts = Column(Boolean, default=True, nullable=False)
    email_company_updates = Column(Boolean, default=True, nullable=False)
    email_system_announcements = Column(Boolean, default=True, nullable=False)
    
    # Push notification settings
    push_enabled = Column(Boolean, default=True, nullable=False)
    push_new_applications = Column(Boolean, default=True, nullable=False)
    push_application_updates = Column(Boolean, default=True, nullable=False)
    push_job_alerts = Column(Boolean, default=True, nullable=False)
    push_company_updates = Column(Boolean, default=False, nullable=False)
    push_system_announcements = Column(Boolean, default=True, nullable=False)
    
    # SMS settings
    sms_enabled = Column(Boolean, default=False, nullable=False)
    sms_urgent_updates = Column(Boolean, default=True, nullable=False)
    sms_interview_reminders = Column(Boolean, default=True, nullable=False)
    
    # Frequency settings
    digest_frequency = Column(String(20), default="DAILY", nullable=False)  # DAILY, WEEKLY, MONTHLY
    quiet_hours_start = Column(String(5), nullable=True)  # HH:MM format
    quiet_hours_end = Column(String(5), nullable=True)    # HH:MM format
    timezone = Column(String(50), default="UTC", nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User")
