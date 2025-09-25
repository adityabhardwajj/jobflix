"""
Custom exceptions for JobFlix API
"""

from fastapi import HTTPException, status


class JobFlixException(HTTPException):
    """Base exception for JobFlix API"""
    
    def __init__(
        self,
        detail: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str = "JOBFLIX_ERROR"
    ):
        self.error_code = error_code
        super().__init__(status_code=status_code, detail=detail)


class AuthenticationError(JobFlixException):
    """Authentication related errors"""
    
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTH_ERROR"
        )


class AuthorizationError(JobFlixException):
    """Authorization related errors"""
    
    def __init__(self, detail: str = "Insufficient permissions"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="AUTHZ_ERROR"
        )


class ValidationError(JobFlixException):
    """Validation related errors"""
    
    def __init__(self, detail: str = "Validation failed"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR"
        )


class NotFoundError(JobFlixException):
    """Resource not found errors"""
    
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND"
        )


class ConflictError(JobFlixException):
    """Conflict related errors"""
    
    def __init__(self, detail: str = "Resource conflict"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_409_CONFLICT,
            error_code="CONFLICT"
        )


class RateLimitError(JobFlixException):
    """Rate limiting errors"""
    
    def __init__(self, detail: str = "Rate limit exceeded"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code="RATE_LIMIT"
        )


class ExternalServiceError(JobFlixException):
    """External service errors"""
    
    def __init__(self, detail: str = "External service error"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_502_BAD_GATEWAY,
            error_code="EXTERNAL_SERVICE_ERROR"
        )


class AIError(JobFlixException):
    """AI service errors"""
    
    def __init__(self, detail: str = "AI service error"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="AI_ERROR"
        )
