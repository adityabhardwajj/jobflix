"""
Company management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import structlog

from app.core.database import get_async_db
from app.core.security import get_current_user_id, require_employer
from app.schemas.job import Company, CompanyCreate, CompanyUpdate
from app.models.job import Company as CompanyModel
from app.core.exceptions import NotFoundError

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=List[Company])
async def get_companies(
    db: AsyncSession = Depends(get_async_db)
):
    """Get all companies"""
    try:
        result = await db.execute(
            CompanyModel.__table__.select().where(CompanyModel.is_active == True)
        )
        companies_rows = result.fetchall()
        
        companies = [CompanyModel(**dict(row)) for row in companies_rows]
        return companies
        
    except Exception as e:
        logger.error("Get companies failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get companies"
        )


@router.get("/{company_id}", response_model=Company)
async def get_company(
    company_id: str,
    db: AsyncSession = Depends(get_async_db)
):
    """Get company by ID"""
    try:
        result = await db.execute(
            CompanyModel.__table__.select().where(CompanyModel.id == company_id)
        )
        company_row = result.fetchone()
        
        if not company_row:
            raise NotFoundError("Company not found")
        
        company = CompanyModel(**dict(company_row))
        return company
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Get company failed", error=str(e), company_id=company_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get company"
        )


@router.post("/", response_model=Company, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_data: CompanyCreate,
    current_user_id: str = Depends(require_employer),
    db: AsyncSession = Depends(get_async_db)
):
    """Create a new company"""
    try:
        # Create company
        company_dict = company_data.dict()
        company_dict["slug"] = f"{company_data.name.lower().replace(' ', '-')}"
        
        new_company = CompanyModel(**company_dict)
        db.add(new_company)
        await db.commit()
        await db.refresh(new_company)
        
        logger.info("Company created", company_id=str(new_company.id), user_id=current_user_id)
        return new_company
        
    except Exception as e:
        logger.error("Create company failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create company"
        )


@router.put("/{company_id}", response_model=Company)
async def update_company(
    company_id: str,
    company_data: CompanyUpdate,
    current_user_id: str = Depends(require_employer),
    db: AsyncSession = Depends(get_async_db)
):
    """Update company"""
    try:
        # Get existing company
        result = await db.execute(
            CompanyModel.__table__.select().where(CompanyModel.id == company_id)
        )
        company_row = result.fetchone()
        
        if not company_row:
            raise NotFoundError("Company not found")
        
        company = CompanyModel(**dict(company_row))
        
        # Update company with new data
        update_data = company_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(company, field, value)
        
        await db.commit()
        await db.refresh(company)
        
        logger.info("Company updated", company_id=company_id, user_id=current_user_id)
        return company
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Update company failed", error=str(e), company_id=company_id, user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update company"
        )
