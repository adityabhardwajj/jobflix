"""
AI-powered endpoints for job matching and recommendations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import structlog
from openai import AsyncOpenAI
import json
from datetime import datetime

from app.core.database import get_async_db
from app.core.security import get_current_user_id
from app.core.config import settings
from app.core.exceptions import AIError, NotFoundError
from app.schemas.job import JobMatchRequest, JobMatchResponse, JobMatch
from app.schemas.user import UserWithProfile
from app.models.user import User as UserModel, UserProfile, UserSkill, Skill
from app.models.job import Job, Company, Application
from app.models.notification import JobAlert

logger = structlog.get_logger()
router = APIRouter()

# Initialize OpenAI client
if settings.OPENAI_API_KEY:
    openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


@router.post("/match-jobs", response_model=JobMatchResponse)
async def match_jobs(
    match_request: JobMatchRequest,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """AI-powered job matching based on user profile and preferences"""
    try:
        if not settings.OPENAI_API_KEY:
            raise AIError("AI service is not configured")
        
        # Get user with profile and skills
        user_result = await db.execute(
            UserModel.__table__.select().where(UserModel.id == current_user_id)
        )
        user_row = user_result.fetchone()
        
        if not user_row:
            raise NotFoundError("User not found")
        
        user = UserModel(**dict(user_row))
        
        # Get user profile
        profile_result = await db.execute(
            UserProfile.__table__.select().where(UserProfile.user_id == current_user_id)
        )
        profile_row = profile_result.fetchone()
        
        # Get user skills
        skills_result = await db.execute(
            UserSkill.__table__.select().where(UserSkill.user_id == current_user_id)
        )
        skills_rows = skills_result.fetchall()
        
        # Get available jobs
        jobs_query = Job.__table__.select().where(
            Job.status == "ACTIVE",
            Job.application_deadline > datetime.utcnow()
        ).limit(100)
        
        jobs_result = await db.execute(jobs_query)
        jobs_rows = jobs_result.fetchall()
        
        if not jobs_rows:
            return JobMatchResponse(
                matches=[],
                total_jobs_analyzed=0,
                total_matches=0,
                processing_time=0.0
            )
        
        # Get applied job IDs
        applied_result = await db.execute(
            Application.__table__.select().where(Application.user_id == current_user_id)
        )
        applied_rows = applied_result.fetchall()
        applied_job_ids = [row.job_id for row in applied_rows]
        
        # Filter out applied jobs if requested
        available_jobs = []
        for job_row in jobs_rows:
            job = Job(**dict(job_row))
            if not match_request.include_applied and job.id in applied_job_ids:
                continue
            available_jobs.append(job)
        
        if not available_jobs:
            return JobMatchResponse(
                matches=[],
                total_jobs_analyzed=len(jobs_rows),
                total_matches=0,
                processing_time=0.0
            )
        
        # Prepare user data for AI
        user_data = {
            "profile": {
                "bio": profile_row.bio if profile_row else None,
                "location": profile_row.location if profile_row else None,
                "current_role": profile_row.current_role if profile_row else None,
                "experience_years": profile_row.experience_years if profile_row else 0,
                "education": profile_row.education if profile_row else None,
                "desired_salary_min": profile_row.desired_salary_min if profile_row else None,
                "desired_salary_max": profile_row.desired_salary_max if profile_row else None,
                "preferred_work_types": profile_row.preferred_work_types if profile_row else [],
                "preferred_locations": profile_row.preferred_locations if profile_row else [],
                "remote_work": profile_row.remote_work if profile_row else False,
            },
            "skills": [
                {
                    "name": skill.name,
                    "level": skill.level,
                    "years_experience": skill.years_experience
                }
                for skill in skills_rows
            ]
        }
        
        # Prepare job data for AI
        job_data = []
        for job in available_jobs[:50]:  # Limit to 50 jobs for AI processing
            job_data.append({
                "id": str(job.id),
                "title": job.title,
                "description": job.description,
                "requirements": job.requirements,
                "responsibilities": job.responsibilities,
                "location": job.location,
                "work_type": job.work_type,
                "experience_level": job.experience_level,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "is_remote": job.is_remote,
                "tags": job.tags,
                "company_id": str(job.company_id)
            })
        
        # Create AI prompt
        prompt = f"""
        You are an expert AI job matcher. Analyze the following user profile and available jobs to provide intelligent job recommendations.
        
        User Profile:
        {json.dumps(user_data, indent=2)}
        
        Available Jobs:
        {json.dumps(job_data, indent=2)}
        
        For each job, provide:
        1. Match score (0.0 to 1.0)
        2. Match reasons (why this job is a good fit)
        3. Strengths (user's advantages for this role)
        4. Concerns (potential challenges or gaps)
        
        Only include jobs with match scores >= {match_request.min_match_score}.
        Return results in JSON format with this structure:
        {{
            "matches": [
                {{
                    "job_id": "job_id",
                    "match_score": 0.85,
                    "match_reasons": ["reason1", "reason2"],
                    "strengths": ["strength1", "strength2"],
                    "concerns": ["concern1", "concern2"]
                }}
            ]
        }}
        """
        
        # Call OpenAI API
        start_time = datetime.utcnow()
        
        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert AI job matcher. Provide accurate and helpful job matching results in JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Parse AI response
        ai_response = response.choices[0].message.content
        try:
            ai_data = json.loads(ai_response)
            ai_matches = ai_data.get("matches", [])
        except json.JSONDecodeError:
            logger.error("Failed to parse AI response", response=ai_response)
            ai_matches = []
        
        # Create job matches
        matches = []
        for ai_match in ai_matches[:match_request.limit]:
            job_id = ai_match.get("job_id")
            job = next((j for j in available_jobs if str(j.id) == job_id), None)
            
            if job:
                # Get company information
                company_result = await db.execute(
                    Company.__table__.select().where(Company.id == job.company_id)
                )
                company_row = company_result.fetchone()
                company = Company(**dict(company_row)) if company_row else None
                
                match = JobMatch(
                    job=job,
                    match_score=ai_match.get("match_score", 0.0),
                    match_reasons=ai_match.get("match_reasons", []),
                    strengths=ai_match.get("strengths", []),
                    concerns=ai_match.get("concerns", [])
                )
                matches.append(match)
        
        logger.info(
            "Job matching completed",
            user_id=current_user_id,
            total_jobs=len(available_jobs),
            matches_found=len(matches),
            processing_time=processing_time
        )
        
        return JobMatchResponse(
            matches=matches,
            total_jobs_analyzed=len(available_jobs),
            total_matches=len(matches),
            processing_time=processing_time
        )
        
    except AIError:
        raise
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Job matching failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Job matching failed"
        )


@router.post("/generate-job-description")
async def generate_job_description(
    job_title: str,
    company_name: str,
    requirements: List[str],
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Generate AI-powered job description"""
    try:
        if not settings.OPENAI_API_KEY:
            raise AIError("AI service is not configured")
        
        prompt = f"""
        Generate a professional job description for the following position:
        
        Job Title: {job_title}
        Company: {company_name}
        Key Requirements: {', '.join(requirements)}
        
        Please provide:
        1. A compelling job summary
        2. Detailed responsibilities
        3. Required qualifications
        4. Preferred qualifications
        5. Company benefits and culture highlights
        
        Format the response as a structured job description suitable for a job board.
        """
        
        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert HR professional and job description writer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        generated_description = response.choices[0].message.content
        
        logger.info("Job description generated", user_id=current_user_id, job_title=job_title)
        
        return {
            "job_description": generated_description,
            "job_title": job_title,
            "company_name": company_name
        }
        
    except AIError:
        raise
    except Exception as e:
        logger.error("Job description generation failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Job description generation failed"
        )


@router.post("/optimize-resume")
async def optimize_resume(
    resume_text: str,
    job_description: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Optimize resume for a specific job"""
    try:
        if not settings.OPENAI_API_KEY:
            raise AIError("AI service is not configured")
        
        prompt = f"""
        Analyze the following resume and job description to provide optimization suggestions:
        
        Resume:
        {resume_text}
        
        Job Description:
        {job_description}
        
        Please provide:
        1. Key strengths that match the job requirements
        2. Areas for improvement
        3. Suggested keywords to include
        4. Formatting and content suggestions
        5. A score (1-10) for how well the resume matches the job
        
        Provide actionable, specific recommendations.
        """
        
        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert resume writer and career coach."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1500
        )
        
        optimization_suggestions = response.choices[0].message.content
        
        logger.info("Resume optimization completed", user_id=current_user_id)
        
        return {
            "optimization_suggestions": optimization_suggestions,
            "resume_text": resume_text,
            "job_description": job_description
        }
        
    except AIError:
        raise
    except Exception as e:
        logger.error("Resume optimization failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Resume optimization failed"
        )


@router.post("/generate-cover-letter")
async def generate_cover_letter(
    job_title: str,
    company_name: str,
    user_profile: str,
    job_description: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Generate AI-powered cover letter"""
    try:
        if not settings.OPENAI_API_KEY:
            raise AIError("AI service is not configured")
        
        prompt = f"""
        Generate a professional cover letter for the following application:
        
        Job Title: {job_title}
        Company: {company_name}
        Job Description: {job_description}
        
        Applicant Profile:
        {user_profile}
        
        Please create a compelling cover letter that:
        1. Demonstrates enthusiasm for the role
        2. Highlights relevant experience and skills
        3. Shows knowledge of the company
        4. Is professional and well-structured
        5. Is approximately 3-4 paragraphs long
        
        Make it personalized and specific to this role and company.
        """
        
        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert cover letter writer and career coach."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        cover_letter = response.choices[0].message.content
        
        logger.info("Cover letter generated", user_id=current_user_id, job_title=job_title)
        
        return {
            "cover_letter": cover_letter,
            "job_title": job_title,
            "company_name": company_name
        }
        
    except AIError:
        raise
    except Exception as e:
        logger.error("Cover letter generation failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cover letter generation failed"
        )
