#!/usr/bin/env python3
"""
Database seeding script for JobFlix
Creates sample data for development and testing
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from app.core.database import AsyncSessionLocal
from app.models.job import Company, Job, Application, SavedJob, JobSkill
from app.models.user import User, UserSkill
from app.models.notification import Notification

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Sample data
SAMPLE_COMPANIES = [
    {
        "name": "TechCorp Solutions",
        "slug": "techcorp-solutions",
        "description": "Leading technology company specializing in cloud solutions and AI",
        "website": "https://techcorp.example.com",
        "industry": "TECHNOLOGY",
        "company_size": "LARGE",
        "headquarters": "San Francisco, CA",
        "founded_year": 2010,
        "is_verified": True
    },
    {
        "name": "InnovateLab",
        "slug": "innovatelab",
        "description": "Innovative startup working on cutting-edge fintech solutions",
        "website": "https://innovatelab.example.com",
        "industry": "FINANCE",
        "company_size": "STARTUP",
        "headquarters": "New York, NY",
        "founded_year": 2020,
        "is_verified": True
    },
    {
        "name": "HealthPlus Technologies",
        "slug": "healthplus-tech",
        "description": "Digital health platform improving patient care through technology",
        "website": "https://healthplus.example.com",
        "industry": "HEALTHCARE",
        "company_size": "MEDIUM",
        "headquarters": "Boston, MA",
        "founded_year": 2015,
        "is_verified": True
    },
    {
        "name": "GreenEnergy Corp",
        "slug": "greenenergy-corp",
        "description": "Renewable energy solutions for a sustainable future",
        "website": "https://greenenergy.example.com",
        "industry": "ENERGY",
        "company_size": "LARGE",
        "headquarters": "Austin, TX",
        "founded_year": 2008,
        "is_verified": True
    },
    {
        "name": "EduTech Academy",
        "slug": "edutech-academy",
        "description": "Educational technology platform revolutionizing online learning",
        "website": "https://edutech.example.com",
        "industry": "EDUCATION",
        "company_size": "SMALL",
        "headquarters": "Seattle, WA",
        "founded_year": 2018,
        "is_verified": True
    }
]

SAMPLE_USERS = [
    {
        "email": "john.developer@example.com",
        "password": "password123",
        "first_name": "John",
        "last_name": "Developer",
        "role": "JOB_SEEKER",
        "experience_level": "MID_LEVEL",
        "location": "San Francisco, CA",
        "bio": "Passionate full-stack developer with 5 years of experience",
        "skills": [
            {"skill_name": "Python", "skill_level": "ADVANCED"},
            {"skill_name": "JavaScript", "skill_level": "ADVANCED"},
            {"skill_name": "React", "skill_level": "INTERMEDIATE"},
            {"skill_name": "FastAPI", "skill_level": "ADVANCED"},
            {"skill_name": "PostgreSQL", "skill_level": "INTERMEDIATE"}
        ]
    },
    {
        "email": "sarah.designer@example.com",
        "password": "password123",
        "first_name": "Sarah",
        "last_name": "Designer",
        "role": "JOB_SEEKER",
        "experience_level": "SENIOR",
        "location": "New York, NY",
        "bio": "Creative UX/UI designer with a passion for user-centered design",
        "skills": [
            {"skill_name": "Figma", "skill_level": "EXPERT"},
            {"skill_name": "Adobe Creative Suite", "skill_level": "ADVANCED"},
            {"skill_name": "User Research", "skill_level": "ADVANCED"},
            {"skill_name": "Prototyping", "skill_level": "EXPERT"},
            {"skill_name": "HTML/CSS", "skill_level": "INTERMEDIATE"}
        ]
    },
    {
        "email": "mike.recruiter@techcorp.com",
        "password": "password123",
        "first_name": "Mike",
        "last_name": "Recruiter",
        "role": "EMPLOYER",
        "experience_level": "SENIOR",
        "location": "San Francisco, CA",
        "bio": "Senior technical recruiter at TechCorp Solutions"
    },
    {
        "email": "admin@jobflix.com",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "User",
        "role": "ADMIN",
        "experience_level": "EXECUTIVE",
        "location": "Remote",
        "bio": "JobFlix platform administrator"
    }
]

def generate_job_data(companies):
    """Generate sample job postings"""
    jobs = []
    
    for i, company in enumerate(companies):
        company_jobs = [
            {
                "title": "Senior Full Stack Developer",
                "slug": f"senior-fullstack-developer-{company['slug']}",
                "description": """We're looking for a Senior Full Stack Developer to join our growing team. 
                You'll work on cutting-edge projects using modern technologies and collaborate with 
                cross-functional teams to deliver high-quality software solutions.
                
                Responsibilities:
                - Develop and maintain web applications using React and Node.js
                - Design and implement RESTful APIs
                - Collaborate with designers and product managers
                - Mentor junior developers
                - Participate in code reviews and technical discussions""",
                "requirements": """Required Skills:
                - 5+ years of experience in full-stack development
                - Proficiency in JavaScript/TypeScript, React, Node.js
                - Experience with databases (PostgreSQL, MongoDB)
                - Knowledge of cloud platforms (AWS, Azure, or GCP)
                - Strong problem-solving skills
                - Excellent communication skills""",
                "benefits": """Benefits:
                - Competitive salary and equity
                - Health, dental, and vision insurance
                - 401(k) matching
                - Flexible work arrangements
                - Professional development budget
                - Unlimited PTO""",
                "job_type": "FULL_TIME",
                "experience_level": "SENIOR",
                "work_location": "HYBRID",
                "location": company["headquarters"],
                "salary_min": 120000,
                "salary_max": 180000,
                "status": "ACTIVE",
                "tags": '["JavaScript", "React", "Node.js", "PostgreSQL", "AWS"]'
            },
            {
                "title": "UX/UI Designer",
                "slug": f"ux-ui-designer-{company['slug']}",
                "description": """Join our design team as a UX/UI Designer and help create intuitive, 
                beautiful user experiences. You'll work closely with product managers and developers 
                to bring ideas to life.
                
                Responsibilities:
                - Create wireframes, prototypes, and high-fidelity designs
                - Conduct user research and usability testing
                - Collaborate with development teams on implementation
                - Maintain and evolve design systems
                - Present design concepts to stakeholders""",
                "requirements": """Required Skills:
                - 3+ years of UX/UI design experience
                - Proficiency in Figma, Sketch, or similar tools
                - Strong understanding of design principles
                - Experience with user research and testing
                - Portfolio showcasing design process and outcomes
                - Knowledge of HTML/CSS is a plus""",
                "benefits": """Benefits:
                - Competitive salary and benefits
                - Health and wellness programs
                - Remote-friendly work environment
                - Learning and development opportunities
                - Creative and collaborative team culture
                - Flexible working hours""",
                "job_type": "FULL_TIME",
                "experience_level": "MID_LEVEL",
                "work_location": "REMOTE",
                "location": "Remote",
                "salary_min": 90000,
                "salary_max": 130000,
                "status": "ACTIVE",
                "tags": '["Figma", "UI Design", "UX Research", "Prototyping", "Design Systems"]'
            }
        ]
        
        # Add entry-level position for some companies
        if i < 3:
            company_jobs.append({
                "title": "Junior Software Engineer",
                "slug": f"junior-software-engineer-{company['slug']}",
                "description": """Looking for a Junior Software Engineer to join our team. 
                This is a great opportunity for recent graduates or early-career developers to 
                grow their skills in a supportive environment.
                
                Responsibilities:
                - Write clean, maintainable code
                - Participate in code reviews
                - Learn new technologies and frameworks
                - Collaborate with senior team members
                - Contribute to testing and documentation""",
                "requirements": """Required Skills:
                - Bachelor's degree in Computer Science or related field
                - Basic knowledge of programming languages (Python, JavaScript, Java)
                - Understanding of version control (Git)
                - Eagerness to learn and grow
                - Strong problem-solving abilities
                - Good communication skills""",
                "benefits": """Benefits:
                - Mentorship from senior developers
                - Learning and development budget
                - Health and dental insurance
                - Flexible work schedule
                - Team building activities
                - Career growth opportunities""",
                "job_type": "FULL_TIME",
                "experience_level": "ENTRY_LEVEL",
                "work_location": "ON_SITE",
                "location": company["headquarters"],
                "salary_min": 70000,
                "salary_max": 90000,
                "status": "ACTIVE",
                "tags": '["Python", "JavaScript", "Git", "Entry Level", "Learning"]'
            })
        
        jobs.extend(company_jobs)
    
    return jobs

async def create_sample_data():
    """Create sample data in the database"""
    async with AsyncSessionLocal() as session:
        try:
            print("🌱 Creating sample companies...")
            
            # Create companies
            companies = []
            for company_data in SAMPLE_COMPANIES:
                company = Company(
                    id=str(uuid.uuid4()),
                    **company_data
                )
                session.add(company)
                companies.append(company)
            
            await session.commit()
            print(f"✅ Created {len(companies)} companies")
            
            # Create users
            print("👥 Creating sample users...")
            users = []
            for user_data in SAMPLE_USERS:
                skills_data = user_data.pop("skills", [])
                
                user = User(
                    id=str(uuid.uuid4()),
                    hashed_password=get_password_hash(user_data.pop("password")),
                    **user_data
                )
                session.add(user)
                users.append((user, skills_data))
            
            await session.commit()
            
            # Add user skills
            for user, skills_data in users:
                for skill_data in skills_data:
                    user_skill = UserSkill(
                        id=str(uuid.uuid4()),
                        user_id=user.id,
                        **skill_data
                    )
                    session.add(user_skill)
            
            await session.commit()
            print(f"✅ Created {len(users)} users with skills")
            
            # Create jobs
            print("💼 Creating sample jobs...")
            job_data_list = generate_job_data(SAMPLE_COMPANIES)
            jobs = []
            
            # Find employer user for posting jobs
            employer_user = next(user for user, _ in users if user.role == "EMPLOYER")
            
            for i, job_data in enumerate(job_data_list):
                company = companies[i % len(companies)]
                
                job = Job(
                    id=str(uuid.uuid4()),
                    company_id=company.id,
                    posted_by=employer_user.id,
                    application_deadline=datetime.utcnow() + timedelta(days=30),
                    **job_data
                )
                session.add(job)
                jobs.append(job)
            
            await session.commit()
            print(f"✅ Created {len(jobs)} job postings")
            
            # Create some applications
            print("📝 Creating sample applications...")
            job_seeker_users = [user for user, _ in users if user.role == "JOB_SEEKER"]
            
            application_count = 0
            for i, job in enumerate(jobs[:5]):  # Apply to first 5 jobs
                for j, user_data in enumerate(job_seeker_users[:2]):  # First 2 job seekers apply
                    user, _ = user_data
                    application = Application(
                        id=str(uuid.uuid4()),
                        job_id=job.id,
                        user_id=user.id,
                        status="PENDING" if j == 0 else "REVIEWING",
                        cover_letter=f"Dear Hiring Manager, I am very interested in the {job.title} position at {job.company_id}. I believe my skills would be a great fit for this role.",
                        applied_at=datetime.utcnow() - timedelta(days=j*2)
                    )
                    session.add(application)
                    application_count += 1
            
            await session.commit()
            print(f"✅ Created {application_count} job applications")
            
            # Create saved jobs
            print("⭐ Creating saved jobs...")
            saved_job_count = 0
            for user_data in job_seeker_users:
                user, _ = user_data
                # Save some random jobs
                for job in jobs[::3][:5]:  # Save every 3rd job, up to 5
                    saved_job = SavedJob(
                        id=str(uuid.uuid4()),
                        user_id=user.id,
                        job_id=job.id
                    )
                    session.add(saved_job)
                    saved_job_count += 1
            
            await session.commit()
            print(f"✅ Created {saved_job_count} saved jobs")
            
            # Create notifications
            print("🔔 Creating sample notifications...")
            notification_count = 0
            for user_data in job_seeker_users:
                user, _ = user_data
                notifications = [
                    {
                        "type": "NEW_JOB_MATCH",
                        "title": "New Job Match Found!",
                        "message": "We found a great job match based on your profile and preferences."
                    },
                    {
                        "type": "APPLICATION_UPDATE",
                        "title": "Application Status Update",
                        "message": "Your application for Senior Full Stack Developer has been reviewed."
                    },
                    {
                        "type": "SYSTEM",
                        "title": "Welcome to JobFlix!",
                        "message": "Complete your profile to get better job recommendations."
                    }
                ]
                
                for i, notif_data in enumerate(notifications):
                    notification = Notification(
                        id=str(uuid.uuid4()),
                        user_id=user.id,
                        is_read=i == 2,  # Mark welcome message as read
                        **notif_data
                    )
                    session.add(notification)
                    notification_count += 1
            
            await session.commit()
            print(f"✅ Created {notification_count} notifications")
            
            print("\n🎉 Sample data creation completed successfully!")
            print("\n📧 Test user accounts:")
            print("   Job Seeker 1: john.developer@example.com / password123")
            print("   Job Seeker 2: sarah.designer@example.com / password123")
            print("   Employer: mike.recruiter@techcorp.com / password123")
            print("   Admin: admin@jobflix.com / admin123")
            print("\n🏢 Sample companies and job postings created")
            print("📊 Database ready for testing!")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error creating sample data: {e}")
            raise
        finally:
            await session.close()

if __name__ == "__main__":
    print("🚀 JobFlix Database Seeding Script")
    print("=" * 40)
    asyncio.run(create_sample_data())
