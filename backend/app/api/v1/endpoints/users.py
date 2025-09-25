"""
User management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import structlog

from app.core.database import get_async_db
from app.core.security import get_current_user_id
from app.schemas.user import (
    UserProfile, UserProfileCreate, UserProfileUpdate,
    UserSkill, UserSkillCreate, UserSkillUpdate,
    UserPreferences, UserPreferencesCreate, UserPreferencesUpdate,
    UserWithProfile
)
from app.models.user import User as UserModel, UserProfile as UserProfileModel, UserSkill as UserSkillModel, UserPreferences as UserPreferencesModel
from app.core.exceptions import NotFoundError

logger = structlog.get_logger()
router = APIRouter()


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get current user's profile"""
    try:
        result = await db.execute(
            UserProfileModel.__table__.select().where(UserProfileModel.user_id == current_user_id)
        )
        profile_row = result.fetchone()
        
        if not profile_row:
            raise NotFoundError("User profile not found")
        
        profile = UserProfileModel(**dict(profile_row))
        return profile
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Get user profile failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user profile"
        )


@router.post("/profile", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
async def create_user_profile(
    profile_data: UserProfileCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Create user profile"""
    try:
        # Check if profile already exists
        existing_result = await db.execute(
            UserProfileModel.__table__.select().where(UserProfileModel.user_id == current_user_id)
        )
        if existing_result.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User profile already exists"
            )
        
        # Create new profile
        profile_dict = profile_data.dict()
        profile_dict["user_id"] = current_user_id
        
        new_profile = UserProfileModel(**profile_dict)
        db.add(new_profile)
        await db.commit()
        await db.refresh(new_profile)
        
        logger.info("User profile created", user_id=current_user_id)
        return new_profile
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Create user profile failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user profile"
        )


@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Update user profile"""
    try:
        # Get existing profile
        result = await db.execute(
            UserProfileModel.__table__.select().where(UserProfileModel.user_id == current_user_id)
        )
        profile_row = result.fetchone()
        
        if not profile_row:
            raise NotFoundError("User profile not found")
        
        profile = UserProfileModel(**dict(profile_row))
        
        # Update profile with new data
        update_data = profile_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
        
        await db.commit()
        await db.refresh(profile)
        
        logger.info("User profile updated", user_id=current_user_id)
        return profile
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Update user profile failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )


@router.get("/skills", response_model=List[UserSkill])
async def get_user_skills(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get user's skills"""
    try:
        result = await db.execute(
            UserSkillModel.__table__.select().where(UserSkillModel.user_id == current_user_id)
        )
        skills_rows = result.fetchall()
        
        skills = [UserSkillModel(**dict(row)) for row in skills_rows]
        return skills
        
    except Exception as e:
        logger.error("Get user skills failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user skills"
        )


@router.post("/skills", response_model=UserSkill, status_code=status.HTTP_201_CREATED)
async def add_user_skill(
    skill_data: UserSkillCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Add a skill to user's profile"""
    try:
        # Check if skill already exists for user
        existing_result = await db.execute(
            UserSkillModel.__table__.select().where(
                UserSkillModel.user_id == current_user_id,
                UserSkillModel.skill_id == skill_data.skill_id
            )
        )
        if existing_result.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Skill already added to profile"
            )
        
        # Add new skill
        skill_dict = skill_data.dict()
        skill_dict["user_id"] = current_user_id
        
        new_skill = UserSkillModel(**skill_dict)
        db.add(new_skill)
        await db.commit()
        await db.refresh(new_skill)
        
        logger.info("User skill added", user_id=current_user_id, skill_id=str(skill_data.skill_id))
        return new_skill
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Add user skill failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add user skill"
        )


@router.put("/skills/{skill_id}", response_model=UserSkill)
async def update_user_skill(
    skill_id: str,
    skill_data: UserSkillUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Update user skill"""
    try:
        # Get existing skill
        result = await db.execute(
            UserSkillModel.__table__.select().where(
                UserSkillModel.id == skill_id,
                UserSkillModel.user_id == current_user_id
            )
        )
        skill_row = result.fetchone()
        
        if not skill_row:
            raise NotFoundError("User skill not found")
        
        skill = UserSkillModel(**dict(skill_row))
        
        # Update skill with new data
        update_data = skill_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(skill, field, value)
        
        await db.commit()
        await db.refresh(skill)
        
        logger.info("User skill updated", user_id=current_user_id, skill_id=skill_id)
        return skill
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Update user skill failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user skill"
        )


@router.delete("/skills/{skill_id}")
async def remove_user_skill(
    skill_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Remove skill from user's profile"""
    try:
        # Get existing skill
        result = await db.execute(
            UserSkillModel.__table__.select().where(
                UserSkillModel.id == skill_id,
                UserSkillModel.user_id == current_user_id
            )
        )
        skill_row = result.fetchone()
        
        if not skill_row:
            raise NotFoundError("User skill not found")
        
        # Delete skill
        await db.execute(
            UserSkillModel.__table__.delete().where(
                UserSkillModel.id == skill_id,
                UserSkillModel.user_id == current_user_id
            )
        )
        await db.commit()
        
        logger.info("User skill removed", user_id=current_user_id, skill_id=skill_id)
        return {"message": "Skill removed successfully"}
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Remove user skill failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove user skill"
        )


@router.get("/preferences", response_model=UserPreferences)
async def get_user_preferences(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get user preferences"""
    try:
        result = await db.execute(
            UserPreferencesModel.__table__.select().where(UserPreferencesModel.user_id == current_user_id)
        )
        preferences_row = result.fetchone()
        
        if not preferences_row:
            raise NotFoundError("User preferences not found")
        
        preferences = UserPreferencesModel(**dict(preferences_row))
        return preferences
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Get user preferences failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user preferences"
        )


@router.post("/preferences", response_model=UserPreferences, status_code=status.HTTP_201_CREATED)
async def create_user_preferences(
    preferences_data: UserPreferencesCreate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Create user preferences"""
    try:
        # Check if preferences already exist
        existing_result = await db.execute(
            UserPreferencesModel.__table__.select().where(UserPreferencesModel.user_id == current_user_id)
        )
        if existing_result.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User preferences already exist"
            )
        
        # Create new preferences
        preferences_dict = preferences_data.dict()
        preferences_dict["user_id"] = current_user_id
        
        new_preferences = UserPreferencesModel(**preferences_dict)
        db.add(new_preferences)
        await db.commit()
        await db.refresh(new_preferences)
        
        logger.info("User preferences created", user_id=current_user_id)
        return new_preferences
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Create user preferences failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user preferences"
        )


@router.put("/preferences", response_model=UserPreferences)
async def update_user_preferences(
    preferences_data: UserPreferencesUpdate,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Update user preferences"""
    try:
        # Get existing preferences
        result = await db.execute(
            UserPreferencesModel.__table__.select().where(UserPreferencesModel.user_id == current_user_id)
        )
        preferences_row = result.fetchone()
        
        if not preferences_row:
            raise NotFoundError("User preferences not found")
        
        preferences = UserPreferencesModel(**dict(preferences_row))
        
        # Update preferences with new data
        update_data = preferences_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(preferences, field, value)
        
        await db.commit()
        await db.refresh(preferences)
        
        logger.info("User preferences updated", user_id=current_user_id)
        return preferences
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Update user preferences failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user preferences"
        )
