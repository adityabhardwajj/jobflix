"""
Authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta, datetime
import structlog

from app.core.database import get_async_db
from app.core.security import (
    create_access_token, 
    create_refresh_token, 
    verify_password, 
    get_password_hash,
    verify_token,
    get_current_user_id
)
from app.core.config import settings
from app.schemas.user import (
    UserCreate, 
    User, 
    LoginRequest, 
    Token, 
    RefreshTokenRequest,
    PasswordResetRequest,
    PasswordReset,
    ChangePasswordRequest
)
from app.models.user import User as UserModel
from app.core.exceptions import AuthenticationError, NotFoundError

logger = structlog.get_logger()
router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.execute(
            UserModel.__table__.select().where(UserModel.email == user_data.email)
        )
        if existing_user.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username is taken (if provided)
        if user_data.username:
            existing_username = await db.execute(
                UserModel.__table__.select().where(UserModel.username == user_data.username)
            )
            if existing_username.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        user_dict = user_data.dict(exclude={"password"})
        user_dict["hashed_password"] = hashed_password
        
        new_user = UserModel(**user_dict)
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        logger.info("User registered successfully", user_id=str(new_user.id), email=user_data.email)
        return new_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Registration failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Login user and return JWT tokens"""
    try:
        # Find user by email
        result = await db.execute(
            UserModel.__table__.select().where(UserModel.email == login_data.email)
        )
        user_row = result.fetchone()
        
        if not user_row:
            raise AuthenticationError("Invalid email or password")
        
        user = UserModel(**dict(user_row))
        
        # Verify password
        if not verify_password(login_data.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")
        
        # Check if user is active
        if not user.is_active:
            raise AuthenticationError("Account is deactivated")
        
        # Create tokens
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        # Update last login
        user.last_login = datetime.utcnow()
        await db.commit()
        
        logger.info("User logged in successfully", user_id=str(user.id), email=user.email)
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error("Login failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        user_id = verify_token(refresh_data.refresh_token)
        if not user_id:
            raise AuthenticationError("Invalid refresh token")
        
        # Check if user exists and is active
        result = await db.execute(
            UserModel.__table__.select().where(
                UserModel.id == user_id,
                UserModel.is_active == True
            )
        )
        user_row = result.fetchone()
        
        if not user_row:
            raise AuthenticationError("User not found or inactive")
        
        # Create new tokens
        access_token = create_access_token(subject=user_id)
        new_refresh_token = create_refresh_token(subject=user_id)
        
        logger.info("Token refreshed successfully", user_id=user_id)
        
        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except AuthenticationError:
        raise
    except Exception as e:
        logger.error("Token refresh failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )


@router.post("/logout")
async def logout():
    """Logout user (client should discard tokens)"""
    return {"message": "Successfully logged out"}


@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """Request password reset"""
    try:
        # Check if user exists
        result = await db.execute(
            UserModel.__table__.select().where(UserModel.email == request.email)
        )
        user_row = result.fetchone()
        
        if not user_row:
            # Don't reveal if email exists or not
            return {"message": "If the email exists, a password reset link has been sent"}
        
        # TODO: Implement email sending logic
        # For now, just log the request
        logger.info("Password reset requested", email=request.email)
        
        return {"message": "If the email exists, a password reset link has been sent"}
        
    except Exception as e:
        logger.error("Password reset request failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset request failed"
        )


@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordReset,
    db: AsyncSession = Depends(get_async_db)
):
    """Reset password using reset token"""
    try:
        # TODO: Implement token verification and password reset logic
        # For now, just return success
        logger.info("Password reset attempted", token=reset_data.token[:10] + "...")
        
        return {"message": "Password reset successfully"}
        
    except Exception as e:
        logger.error("Password reset failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset failed"
        )


@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Change user password"""
    try:
        # Get current user
        result = await db.execute(
            UserModel.__table__.select().where(UserModel.id == current_user_id)
        )
        user_row = result.fetchone()
        
        if not user_row:
            raise NotFoundError("User not found")
        
        user = UserModel(**dict(user_row))
        
        # Verify current password
        if not verify_password(password_data.current_password, user.hashed_password):
            raise AuthenticationError("Current password is incorrect")
        
        # Update password
        user.hashed_password = get_password_hash(password_data.new_password)
        await db.commit()
        
        logger.info("Password changed successfully", user_id=current_user_id)
        
        return {"message": "Password changed successfully"}
        
    except (AuthenticationError, NotFoundError):
        raise
    except Exception as e:
        logger.error("Password change failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed"
        )


@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get current user information"""
    try:
        result = await db.execute(
            UserModel.__table__.select().where(UserModel.id == current_user_id)
        )
        user_row = result.fetchone()
        
        if not user_row:
            raise NotFoundError("User not found")
        
        user = UserModel(**dict(user_row))
        return user
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Get current user failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information"
        )
