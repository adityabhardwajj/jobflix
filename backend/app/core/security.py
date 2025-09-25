"""
Security utilities for authentication and authorization
"""

from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import structlog

from app.core.config import settings
from app.core.exceptions import AuthenticationError, AuthorizationError

logger = structlog.get_logger()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token scheme
security = HTTPBearer()


def create_access_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT refresh token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.JWT_SECRET_KEY, 
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_token(token: str) -> Optional[str]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "access":
            return None
            
        return user_id
    except JWTError:
        return None


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user ID from JWT token"""
    token = credentials.credentials
    user_id = verify_token(token)
    
    if user_id is None:
        raise AuthenticationError("Invalid authentication credentials")
    
    return user_id


async def get_current_user(
    current_user_id: str = Depends(get_current_user_id)
) -> str:
    """Get current user (placeholder for user service integration)"""
    # This would typically fetch user from database
    # For now, just return the user ID
    return current_user_id


def require_roles(*allowed_roles: str):
    """Decorator to require specific user roles"""
    def role_checker(current_user_id: str = Depends(get_current_user_id)):
        # This would typically check user roles from database
        # For now, just return the user ID
        # In a real implementation, you'd fetch user roles and check them
        return current_user_id
    
    return role_checker


def require_job_seeker(current_user_id: str = Depends(get_current_user_id)):
    """Require job seeker role"""
    # Placeholder for role checking
    return current_user_id


def require_employer(current_user_id: str = Depends(get_current_user_id)):
    """Require employer role"""
    # Placeholder for role checking
    return current_user_id


def require_admin(current_user_id: str = Depends(get_current_user_id)):
    """Require admin role"""
    # Placeholder for role checking
    return current_user_id
