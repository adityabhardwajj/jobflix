"""
Application management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import structlog

from app.core.database import get_async_db
from app.core.security import get_current_user_id, require_employer
from app.schemas.job import Application, ApplicationCreate, ApplicationUpdate, ApplicationWithJob
from app.models.job import Application as ApplicationModel, Job as JobModel
from app.core.exceptions import NotFoundError, ConflictError

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=List[ApplicationWithJob])
async def get_user_applications(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get user's applications"""
    try:
        result = await db.execute(
            ApplicationModel.__table__.select().where(ApplicationModel.user_id == current_user_id)
        )
        applications_rows = result.fetchall()
        
        applications = []
        for app_row in applications_rows:
            application = ApplicationModel(**dict(app_row))
            
            # Get job
            job_result = await db.execute(
                JobModel.__table__.select().where(JobModel.id == application.job_id)
            )
            job_row = job_result.fetchone()
            job = JobModel(**dict(job_row)) if job_row else None
            
            if job:
                applications.append(ApplicationWithJob(application=application, job=job))
        
        return applications
        
    except Exception as e:
        logger.error("Get user applications failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get applications"
        )


@router.post("/", response_model=Application, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: ApplicationCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Apply for a job"""
    try:
        # Check if job exists
        job_result = await db.execute(
            JobModel.__table__.select().where(JobModel.id == application_data.job_id)
        )
        if not job_result.fetchone():
            raise NotFoundError("Job not found")
        
        # Check if already applied
        existing_result = await db.execute(
            ApplicationModel.__table__.select().where(
                ApplicationModel.user_id == current_user_id,
                ApplicationModel.job_id == application_data.job_id
            )
        )
        if existing_result.fetchone():
            raise ConflictError("Already applied for this job")
        
        # Create application
        application_dict = application_data.dict()
        application_dict["user_id"] = current_user_id
        
        new_application = ApplicationModel(**application_dict)
        db.add(new_application)
        await db.commit()
        await db.refresh(new_application)
        
        logger.info("Application created", application_id=str(new_application.id), user_id=current_user_id)
        return new_application
        
    except (NotFoundError, ConflictError):
        raise
    except Exception as e:
        logger.error("Create application failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create application"
        )


@router.put("/{application_id}", response_model=Application)
async def update_application(
    application_id: str,
    application_data: ApplicationUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Update application"""
    try:
        # Get existing application
        result = await db.execute(
            ApplicationModel.__table__.select().where(
                ApplicationModel.id == application_id,
                ApplicationModel.user_id == current_user_id
            )
        )
        application_row = result.fetchone()
        
        if not application_row:
            raise NotFoundError("Application not found")
        
        application = ApplicationModel(**dict(application_row))
        
        # Update application with new data
        update_data = application_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(application, field, value)
        
        await db.commit()
        await db.refresh(application)
        
        logger.info("Application updated", application_id=application_id, user_id=current_user_id)
        return application
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Update application failed", error=str(e), application_id=application_id, user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update application"
        )
