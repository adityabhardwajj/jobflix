"""
Job management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import structlog
from datetime import datetime

from app.core.database import get_async_db
from app.core.security import get_current_user_id, require_employer
from app.schemas.job import (
    Job, JobCreate, JobUpdate, JobWithCompany,
    JobSearchFilters, JobSearchResponse,
    SavedJob, SavedJobCreate, SavedJobUpdate, SavedJobWithJob
)
from app.models.job import Job as JobModel, SavedJob as SavedJobModel, Company as CompanyModel
from app.core.exceptions import NotFoundError, AuthorizationError

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=JobSearchResponse)
async def search_jobs(
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    work_type: Optional[List[str]] = Query(None),
    experience_level: Optional[str] = Query(None),
    salary_min: Optional[int] = Query(None),
    salary_max: Optional[int] = Query(None),
    company_id: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),
    is_featured: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_async_db)
):
    """Search and filter jobs"""
    try:
        # Build query
        jobs_query = JobModel.__table__.select().where(JobModel.status == "ACTIVE")
        
        # Apply filters
        if query:
            jobs_query = jobs_query.where(
                JobModel.title.ilike(f"%{query}%") |
                JobModel.description.ilike(f"%{query}%")
            )
        
        if location:
            jobs_query = jobs_query.where(JobModel.location.ilike(f"%{location}%"))
        
        if is_remote is not None:
            jobs_query = jobs_query.where(JobModel.is_remote == is_remote)
        
        if is_featured is not None:
            jobs_query = jobs_query.where(JobModel.is_featured == is_featured)
        
        if company_id:
            jobs_query = jobs_query.where(JobModel.company_id == company_id)
        
        # Get total count
        count_result = await db.execute(
            f"SELECT COUNT(*) FROM ({jobs_query}) as count_query"
        )
        total = count_result.scalar()
        
        # Apply pagination
        offset = (page - 1) * page_size
        jobs_query = jobs_query.offset(offset).limit(page_size)
        
        # Execute query
        jobs_result = await db.execute(jobs_query)
        jobs_rows = jobs_result.fetchall()
        
        # Get companies for jobs
        jobs = []
        for job_row in jobs_rows:
            job = JobModel(**dict(job_row))
            
            # Get company
            company_result = await db.execute(
                CompanyModel.__table__.select().where(CompanyModel.id == job.company_id)
            )
            company_row = company_result.fetchone()
            company = CompanyModel(**dict(company_row)) if company_row else None
            
            jobs.append(JobWithCompany(job=job, company=company))
        
        total_pages = (total + page_size - 1) // page_size
        
        return JobSearchResponse(
            jobs=jobs,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )
        
    except Exception as e:
        logger.error("Job search failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Job search failed"
        )


@router.get("/{job_id}", response_model=JobWithCompany)
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_async_db)
):
    """Get job by ID"""
    try:
        # Get job
        job_result = await db.execute(
            JobModel.__table__.select().where(JobModel.id == job_id)
        )
        job_row = job_result.fetchone()
        
        if not job_row:
            raise NotFoundError("Job not found")
        
        job = JobModel(**dict(job_row))
        
        # Get company
        company_result = await db.execute(
            CompanyModel.__table__.select().where(CompanyModel.id == job.company_id)
        )
        company_row = company_result.fetchone()
        company = CompanyModel(**dict(company_row)) if company_row else None
        
        # Increment view count
        job.view_count += 1
        await db.commit()
        
        return JobWithCompany(job=job, company=company)
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Get job failed", error=str(e), job_id=job_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job"
        )


@router.post("/", response_model=Job, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: JobCreate,
    current_user_id: str = Depends(require_employer),
    db: AsyncSession = Depends(get_async_db)
):
    """Create a new job posting"""
    try:
        # Create job
        job_dict = job_data.dict()
        job_dict["slug"] = f"{job_data.title.lower().replace(' ', '-')}-{int(datetime.utcnow().timestamp())}"
        
        new_job = JobModel(**job_dict)
        db.add(new_job)
        await db.commit()
        await db.refresh(new_job)
        
        logger.info("Job created", job_id=str(new_job.id), user_id=current_user_id)
        return new_job
        
    except Exception as e:
        logger.error("Create job failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create job"
        )


@router.put("/{job_id}", response_model=Job)
async def update_job(
    job_id: str,
    job_data: JobUpdate,
    current_user_id: str = Depends(require_employer),
    db: AsyncSession = Depends(get_async_db)
):
    """Update job posting"""
    try:
        # Get existing job
        job_result = await db.execute(
            JobModel.__table__.select().where(JobModel.id == job_id)
        )
        job_row = job_result.fetchone()
        
        if not job_row:
            raise NotFoundError("Job not found")
        
        job = JobModel(**dict(job_row))
        
        # Update job with new data
        update_data = job_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(job, field, value)
        
        await db.commit()
        await db.refresh(job)
        
        logger.info("Job updated", job_id=job_id, user_id=current_user_id)
        return job
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Update job failed", error=str(e), job_id=job_id, user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update job"
        )


@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    current_user_id: str = Depends(require_employer),
    db: AsyncSession = Depends(get_async_db)
):
    """Delete job posting"""
    try:
        # Get existing job
        job_result = await db.execute(
            JobModel.__table__.select().where(JobModel.id == job_id)
        )
        job_row = job_result.fetchone()
        
        if not job_row:
            raise NotFoundError("Job not found")
        
        # Delete job
        await db.execute(
            JobModel.__table__.delete().where(JobModel.id == job_id)
        )
        await db.commit()
        
        logger.info("Job deleted", job_id=job_id, user_id=current_user_id)
        return {"message": "Job deleted successfully"}
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Delete job failed", error=str(e), job_id=job_id, user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete job"
        )


@router.get("/saved/", response_model=List[SavedJobWithJob])
async def get_saved_jobs(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get user's saved jobs"""
    try:
        result = await db.execute(
            SavedJobModel.__table__.select().where(SavedJobModel.user_id == current_user_id)
        )
        saved_jobs_rows = result.fetchall()
        
        saved_jobs = []
        for saved_job_row in saved_jobs_rows:
            saved_job = SavedJobModel(**dict(saved_job_row))
            
            # Get job
            job_result = await db.execute(
                JobModel.__table__.select().where(JobModel.id == saved_job.job_id)
            )
            job_row = job_result.fetchone()
            job = JobModel(**dict(job_row)) if job_row else None
            
            if job:
                saved_jobs.append(SavedJobWithJob(saved_job=saved_job, job=job))
        
        return saved_jobs
        
    except Exception as e:
        logger.error("Get saved jobs failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get saved jobs"
        )


@router.post("/saved/", response_model=SavedJob, status_code=status.HTTP_201_CREATED)
async def save_job(
    saved_job_data: SavedJobCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Save a job"""
    try:
        # Check if job exists
        job_result = await db.execute(
            JobModel.__table__.select().where(JobModel.id == saved_job_data.job_id)
        )
        if not job_result.fetchone():
            raise NotFoundError("Job not found")
        
        # Check if already saved
        existing_result = await db.execute(
            SavedJobModel.__table__.select().where(
                SavedJobModel.user_id == current_user_id,
                SavedJobModel.job_id == saved_job_data.job_id
            )
        )
        if existing_result.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Job already saved"
            )
        
        # Save job
        saved_job_dict = saved_job_data.dict()
        saved_job_dict["user_id"] = current_user_id
        
        new_saved_job = SavedJobModel(**saved_job_dict)
        db.add(new_saved_job)
        await db.commit()
        await db.refresh(new_saved_job)
        
        logger.info("Job saved", job_id=str(saved_job_data.job_id), user_id=current_user_id)
        return new_saved_job
        
    except (NotFoundError, HTTPException):
        raise
    except Exception as e:
        logger.error("Save job failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save job"
        )


@router.delete("/saved/{saved_job_id}")
async def unsave_job(
    saved_job_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Remove saved job"""
    try:
        # Get saved job
        result = await db.execute(
            SavedJobModel.__table__.select().where(
                SavedJobModel.id == saved_job_id,
                SavedJobModel.user_id == current_user_id
            )
        )
        saved_job_row = result.fetchone()
        
        if not saved_job_row:
            raise NotFoundError("Saved job not found")
        
        # Delete saved job
        await db.execute(
            SavedJobModel.__table__.delete().where(
                SavedJobModel.id == saved_job_id,
                SavedJobModel.user_id == current_user_id
            )
        )
        await db.commit()
        
        logger.info("Job unsaved", saved_job_id=saved_job_id, user_id=current_user_id)
        return {"message": "Job removed from saved jobs"}
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Unsave job failed", error=str(e), saved_job_id=saved_job_id, user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove saved job"
        )
