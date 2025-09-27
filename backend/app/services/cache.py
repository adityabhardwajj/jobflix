"""
Caching service for blog API
"""

import json
import structlog
from typing import Any, Optional, Dict
from datetime import datetime, timedelta
import asyncio

logger = structlog.get_logger(__name__)


class CacheService:
    """Simple in-memory cache service (can be replaced with Redis later)"""
    
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._default_ttl = 900  # 15 minutes
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key not in self._cache:
            return None
        
        cache_entry = self._cache[key]
        
        # Check if expired
        if datetime.utcnow() > cache_entry['expires_at']:
            del self._cache[key]
            return None
        
        logger.debug("Cache hit", key=key)
        return cache_entry['value']
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        ttl = ttl or self._default_ttl
        expires_at = datetime.utcnow() + timedelta(seconds=ttl)
        
        self._cache[key] = {
            'value': value,
            'expires_at': expires_at,
            'created_at': datetime.utcnow()
        }
        
        logger.debug("Cache set", key=key, ttl=ttl)
    
    async def delete(self, key: str) -> None:
        """Delete key from cache"""
        if key in self._cache:
            del self._cache[key]
            logger.debug("Cache deleted", key=key)
    
    async def delete_pattern(self, pattern: str) -> None:
        """Delete all keys matching pattern"""
        keys_to_delete = [key for key in self._cache.keys() if pattern in key]
        for key in keys_to_delete:
            del self._cache[key]
        
        logger.debug("Cache pattern deleted", pattern=pattern, count=len(keys_to_delete))
    
    async def clear(self) -> None:
        """Clear all cache"""
        self._cache.clear()
        logger.debug("Cache cleared")
    
    def _generate_key(self, prefix: str, **kwargs) -> str:
        """Generate cache key from prefix and parameters"""
        if not kwargs:
            return prefix
        
        # Sort kwargs for consistent key generation
        sorted_kwargs = sorted(kwargs.items())
        key_parts = [f"{k}={v}" for k, v in sorted_kwargs if v is not None]
        return f"{prefix}:{'&'.join(key_parts)}"


# Global cache instance
cache_service = CacheService()


# Cache decorators
def cache_result(ttl: int = 900, key_prefix: str = ""):
    """Decorator to cache function results"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = cache_service._generate_key(
                f"{key_prefix}:{func.__name__}",
                **kwargs
            )
            
            # Try to get from cache
            cached_result = await cache_service.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache_service.set(cache_key, result, ttl)
            
            return result
        
        return wrapper
    return decorator


def invalidate_cache(pattern: str):
    """Decorator to invalidate cache after function execution"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            await cache_service.delete_pattern(pattern)
            return result
        
        return wrapper
    return decorator





