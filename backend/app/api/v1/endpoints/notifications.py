"""
Notification management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import structlog
from datetime import datetime

from app.core.database import get_async_db
from app.core.security import get_current_user_id
from app.models.notification import Notification as NotificationModel
from app.core.exceptions import NotFoundError

logger = structlog.get_logger()
router = APIRouter()


@router.get("/", response_model=List[NotificationModel])
async def get_notifications(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Get user's notifications"""
    try:
        result = await db.execute(
            NotificationModel.__table__.select().where(
                NotificationModel.user_id == current_user_id
            ).order_by(NotificationModel.created_at.desc()).limit(50)
        )
        notifications_rows = result.fetchall()
        
        notifications = [NotificationModel(**dict(row)) for row in notifications_rows]
        return notifications
        
    except Exception as e:
        logger.error("Get notifications failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get notifications"
        )


@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Mark notification as read"""
    try:
        # Get notification
        result = await db.execute(
            NotificationModel.__table__.select().where(
                NotificationModel.id == notification_id,
                NotificationModel.user_id == current_user_id
            )
        )
        notification_row = result.fetchone()
        
        if not notification_row:
            raise NotFoundError("Notification not found")
        
        notification = NotificationModel(**dict(notification_row))
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        
        await db.commit()
        
        logger.info("Notification marked as read", notification_id=notification_id, user_id=current_user_id)
        return {"message": "Notification marked as read"}
        
    except NotFoundError:
        raise
    except Exception as e:
        logger.error("Mark notification read failed", error=str(e), notification_id=notification_id, user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark notification as read"
        )


@router.put("/read-all")
async def mark_all_notifications_read(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_async_db)
):
    """Mark all notifications as read"""
    try:
        # Update all unread notifications
        await db.execute(
            NotificationModel.__table__.update().where(
                NotificationModel.user_id == current_user_id,
                NotificationModel.is_read == False
            ).values(
                is_read=True,
                read_at=datetime.utcnow()
            )
        )
        await db.commit()
        
        logger.info("All notifications marked as read", user_id=current_user_id)
        return {"message": "All notifications marked as read"}
        
    except Exception as e:
        logger.error("Mark all notifications read failed", error=str(e), user_id=current_user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark all notifications as read"
        )
