"""Create core JobFlix tables

Revision ID: 002_create_core_tables
Revises: 001_create_blog_tables
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002_create_core_tables'
down_revision = '001_create_blog_tables'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types for PostgreSQL (will be ignored by SQLite)
    try:
        # User roles enum
        op.execute("CREATE TYPE user_role AS ENUM ('JOB_SEEKER', 'EMPLOYER', 'ADMIN')")
        
        # Job status enum
        op.execute("CREATE TYPE job_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED')")
        
        # Application status enum
        op.execute("CREATE TYPE application_status AS ENUM ('PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')")
        
        # Company size enum
        op.execute("CREATE TYPE company_size AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE')")
        
        # Industry enum
        op.execute("CREATE TYPE industry AS ENUM ('TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'MANUFACTURING', 'CONSULTING', 'MEDIA', 'REAL_ESTATE', 'TRANSPORTATION', 'ENERGY', 'GOVERNMENT', 'NON_PROFIT')")
        
        # Experience level enum
        op.execute("CREATE TYPE experience_level AS ENUM ('ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE')")
        
        # Job type enum
        op.execute("CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE')")
        
        # Work location enum
        op.execute("CREATE TYPE work_location AS ENUM ('REMOTE', 'ON_SITE', 'HYBRID')")
        
        # Skill level enum
        op.execute("CREATE TYPE skill_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')")
        
        # Notification type enum
        op.execute("CREATE TYPE notification_type AS ENUM ('APPLICATION_UPDATE', 'NEW_JOB_MATCH', 'MESSAGE', 'REMINDER', 'SYSTEM')")
    except Exception:
        # SQLite doesn't support enums, so we'll use CHECK constraints instead
        pass

    # Companies table
    op.create_table(
        'companies',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), unique=True, nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('website', sa.String(500), nullable=True),
        sa.Column('logo_url', sa.String(500), nullable=True),
        sa.Column('industry', sa.String(50), nullable=True),
        sa.Column('company_size', sa.String(20), nullable=True),
        sa.Column('founded_year', sa.Integer, nullable=True),
        sa.Column('headquarters', sa.String(200), nullable=True),
        sa.Column('linkedin_url', sa.String(500), nullable=True),
        sa.Column('twitter_url', sa.String(500), nullable=True),
        sa.Column('is_verified', sa.Boolean, default=False),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Users table (extends existing with more fields)
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('first_name', sa.String(100), nullable=True),
        sa.Column('last_name', sa.String(100), nullable=True),
        sa.Column('phone_number', sa.String(20), nullable=True),
        sa.Column('profile_picture_url', sa.String(500), nullable=True),
        sa.Column('resume_url', sa.String(500), nullable=True),
        sa.Column('linkedin_url', sa.String(500), nullable=True),
        sa.Column('github_url', sa.String(500), nullable=True),
        sa.Column('portfolio_url', sa.String(500), nullable=True),
        sa.Column('bio', sa.Text, nullable=True),
        sa.Column('location', sa.String(200), nullable=True),
        sa.Column('role', sa.String(20), nullable=False, default='JOB_SEEKER'),
        sa.Column('experience_level', sa.String(20), nullable=True),
        sa.Column('desired_salary_min', sa.Integer, nullable=True),
        sa.Column('desired_salary_max', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('is_verified', sa.Boolean, default=False),
        sa.Column('email_verified', sa.Boolean, default=False),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # User skills table
    op.create_table(
        'user_skills',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('skill_name', sa.String(100), nullable=False),
        sa.Column('skill_level', sa.String(20), nullable=False, default='INTERMEDIATE'),
        sa.Column('years_of_experience', sa.Integer, nullable=True),
        sa.Column('is_primary', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Jobs table
    op.create_table(
        'jobs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('requirements', sa.Text, nullable=True),
        sa.Column('benefits', sa.Text, nullable=True),
        sa.Column('company_id', sa.String(36), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('department', sa.String(100), nullable=True),
        sa.Column('job_type', sa.String(20), nullable=False, default='FULL_TIME'),
        sa.Column('experience_level', sa.String(20), nullable=False),
        sa.Column('work_location', sa.String(20), nullable=False, default='ON_SITE'),
        sa.Column('location', sa.String(200), nullable=True),
        sa.Column('salary_min', sa.Integer, nullable=True),
        sa.Column('salary_max', sa.Integer, nullable=True),
        sa.Column('salary_currency', sa.String(3), nullable=True, default='USD'),
        sa.Column('remote_ok', sa.Boolean, default=False),
        sa.Column('visa_sponsorship', sa.Boolean, default=False),
        sa.Column('urgent', sa.Boolean, default=False),
        sa.Column('status', sa.String(20), nullable=False, default='DRAFT'),
        sa.Column('posted_by', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('application_deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('external_url', sa.String(500), nullable=True),
        sa.Column('view_count', sa.Integer, default=0),
        sa.Column('application_count', sa.Integer, default=0),
        sa.Column('tags', sa.Text, nullable=True),  # JSON string for tags
        sa.Column('is_featured', sa.Boolean, default=False),
        sa.Column('featured_until', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Job skills required table
    op.create_table(
        'job_skills',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('job_id', sa.String(36), sa.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False),
        sa.Column('skill_name', sa.String(100), nullable=False),
        sa.Column('required_level', sa.String(20), nullable=False, default='INTERMEDIATE'),
        sa.Column('is_required', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Applications table
    op.create_table(
        'applications',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('job_id', sa.String(36), sa.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(30), nullable=False, default='PENDING'),
        sa.Column('cover_letter', sa.Text, nullable=True),
        sa.Column('resume_url', sa.String(500), nullable=True),
        sa.Column('additional_documents', sa.Text, nullable=True),  # JSON string
        sa.Column('answers', sa.Text, nullable=True),  # JSON string for screening questions
        sa.Column('notes', sa.Text, nullable=True),  # Internal notes from recruiters
        sa.Column('applied_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Saved jobs table
    op.create_table(
        'saved_jobs',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('job_id', sa.String(36), sa.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.UniqueConstraint('user_id', 'job_id', name='unique_user_job_save')
    )

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.String(30), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('data', sa.Text, nullable=True),  # JSON string for additional data
        sa.Column('is_read', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Create indexes for better performance
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_role', 'users', ['role'])
    op.create_index('idx_jobs_company', 'jobs', ['company_id'])
    op.create_index('idx_jobs_status', 'jobs', ['status'])
    op.create_index('idx_jobs_location', 'jobs', ['location'])
    op.create_index('idx_jobs_created', 'jobs', ['created_at'])
    op.create_index('idx_applications_user', 'applications', ['user_id'])
    op.create_index('idx_applications_job', 'applications', ['job_id'])
    op.create_index('idx_applications_status', 'applications', ['status'])
    op.create_index('idx_notifications_user', 'notifications', ['user_id'])
    op.create_index('idx_notifications_unread', 'notifications', ['user_id', 'is_read'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_notifications_unread')
    op.drop_index('idx_notifications_user')
    op.drop_index('idx_applications_status')
    op.drop_index('idx_applications_job')
    op.drop_index('idx_applications_user')
    op.drop_index('idx_jobs_created')
    op.drop_index('idx_jobs_location')
    op.drop_index('idx_jobs_status')
    op.drop_index('idx_jobs_company')
    op.drop_index('idx_users_role')
    op.drop_index('idx_users_email')

    # Drop tables
    op.drop_table('notifications')
    op.drop_table('saved_jobs')
    op.drop_table('applications')
    op.drop_table('job_skills')
    op.drop_table('jobs')
    op.drop_table('user_skills')
    op.drop_table('users')
    op.drop_table('companies')

    # Drop enum types for PostgreSQL
    try:
        op.execute("DROP TYPE IF EXISTS notification_type")
        op.execute("DROP TYPE IF EXISTS skill_level")
        op.execute("DROP TYPE IF EXISTS work_location")
        op.execute("DROP TYPE IF EXISTS job_type")
        op.execute("DROP TYPE IF EXISTS experience_level")
        op.execute("DROP TYPE IF EXISTS industry")
        op.execute("DROP TYPE IF EXISTS company_size")
        op.execute("DROP TYPE IF EXISTS application_status")
        op.execute("DROP TYPE IF EXISTS job_status")
        op.execute("DROP TYPE IF EXISTS user_role")
    except Exception:
        pass
