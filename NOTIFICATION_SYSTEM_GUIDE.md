# JobFlix Notification System Implementation Guide

## Overview

This guide covers the complete implementation of the JobFlix notification system, including UI components, real-time updates, web push notifications, and backend integration.

## 🏗️ Architecture

### Frontend Components
- **NotificationBell**: Bell icon with unread count badge
- **Inbox**: Modal with notification list, filters, and actions
- **Settings Page**: User notification preferences
- **Hooks**: `useNotifications`, `usePushNotifications`
- **Real-time**: WebSocket/EventSource integration

### Backend Integration
- **API Routes**: RESTful endpoints for CRUD operations
- **Real-time**: WebSocket server for live updates
- **Push Notifications**: VAPID key management and subscription handling

## 📦 Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "date-fns": "^2.30.0",
    "web-push": "^3.6.7"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "jest": "^29.0.0"
  }
}
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```env
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=your_email@example.com

# API Configuration
API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 2. Service Worker Registration

Add to your `src/app/layout.tsx`:

```typescript
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 3. VAPID Key Generation

Generate VAPID keys using the `web-push` library:

```bash
npx web-push generate-vapid-keys
```

### 4. Backend API Endpoints

Ensure your FastAPI backend has these endpoints:

```python
# /api/v1/notifications/
GET    /notifications/                    # List notifications
POST   /notifications/                    # Create notification
PATCH  /notifications/{id}                # Update notification
DELETE /notifications/{id}                # Delete notification
PATCH  /notifications/mark-all-read      # Mark all as read
POST   /notifications/subscribe          # Subscribe to push
POST   /notifications/unsubscribe         # Unsubscribe from push
GET    /notifications/settings            # Get user settings
PUT    /notifications/settings            # Update user settings
POST   /notifications/test               # Send test notification
```

## 🎯 Usage Examples

### Basic Notification Hook

```typescript
import { useNotifications } from '@/app/hooks/useNotifications';

function MyComponent() {
  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  return (
    <div>
      <p>Unread: {stats.unread}</p>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          {!notification.is_read && (
            <button onClick={() => markAsRead(notification.id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Push Notifications

```typescript
import { usePushNotifications } from '@/lib/push';

function NotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    subscribe,
    unsubscribe
  } = usePushNotifications();

  return (
    <div>
      {isSupported && (
        <button onClick={isSubscribed ? unsubscribe : subscribe}>
          {isSubscribed ? 'Disable' : 'Enable'} Push Notifications
        </button>
      )}
    </div>
  );
}
```

### Real-time Updates

```typescript
import { useRealtimeConnection } from '@/lib/realtime';

function NotificationProvider() {
  const { isConnected, on } = useRealtimeConnection();

  useEffect(() => {
    const unsubscribe = on('notification.created', (data) => {
      console.log('New notification:', data);
      // Update UI or show toast
    });

    return unsubscribe;
  }, [on]);

  return (
    <div>
      Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Specific test files
npm test useNotifications.test.ts
npm test realtime.test.ts
npm test push.test.ts
```

### Test Coverage

The test suite covers:
- ✅ Notification fetching and state management
- ✅ Mark as read functionality
- ✅ Real-time connection handling
- ✅ Push notification subscription
- ✅ Error handling and edge cases

## 🔄 Real-time Integration

### WebSocket Server (Backend)

```python
# Example FastAPI WebSocket endpoint
@app.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket, token: str):
    await websocket.accept()
    
    # Verify token and get user
    user = verify_token(token)
    
    # Add to connection pool
    connection_manager.add_connection(user.id, websocket)
    
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.remove_connection(user.id)
```

### EventSource Fallback

```typescript
// Automatic fallback when WebSocket fails
const eventSource = new EventSource('/api/notifications/stream');
eventSource.addEventListener('notification.created', (event) => {
  const data = JSON.parse(event.data);
  // Handle notification
});
```

## 📱 Push Notification Flow

1. **User subscribes**: Browser requests permission
2. **VAPID subscription**: Creates push subscription with VAPID keys
3. **Server storage**: Subscription saved to database
4. **Notification trigger**: Backend sends push via web-push library
5. **Service worker**: Receives push and shows notification
6. **User interaction**: Click opens app to relevant page

## 🎨 UI Components

### Notification Bell
- Shows unread count badge
- Keyboard shortcut: `Cmd/Ctrl + N`
- Opens inbox modal

### Inbox Modal
- Filter by type and read status
- Search functionality
- Mark as read actions
- Real-time updates

### Settings Page
- Toggle notification types
- Push notification controls
- Test notification buttons
- Permission status display

## 🚀 Deployment Notes

### Production Checklist
- [ ] VAPID keys configured
- [ ] Service worker registered
- [ ] HTTPS enabled (required for push)
- [ ] WebSocket server running
- [ ] Database migrations applied
- [ ] Environment variables set

### Performance Considerations
- Use React Query for caching
- Implement pagination for large notification lists
- Debounce search and filter inputs
- Lazy load notification content
- Optimize service worker bundle size

## 🔧 Troubleshooting

### Common Issues

1. **Push notifications not working**
   - Check HTTPS requirement
   - Verify VAPID keys
   - Check browser permissions

2. **Real-time connection fails**
   - Verify WebSocket server
   - Check CORS settings
   - Test EventSource fallback

3. **Notifications not updating**
   - Check React Query cache
   - Verify API endpoints
   - Check authentication tokens

### Debug Tools

```typescript
// Enable debug logging
localStorage.setItem('debug', 'notifications:*');

// Check service worker status
navigator.serviceWorker.getRegistrations().then(console.log);

// Test push subscription
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(console.log);
});
```

## 📊 Monitoring

### Key Metrics
- Notification delivery rate
- User engagement with notifications
- Push subscription conversion
- Real-time connection stability

### Analytics Events
```typescript
// Track notification interactions
analytics.track('notification_clicked', {
  notification_id: id,
  notification_type: type,
  user_id: userId
});
```

## 🔐 Security Considerations

- Validate all notification data
- Sanitize user input
- Rate limit notification creation
- Secure VAPID key storage
- Implement CSRF protection
- Audit notification access

## 📚 Additional Resources

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [React Query Documentation](https://tanstack.com/query/latest)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

This implementation provides a complete, production-ready notification system for JobFlix with real-time updates, push notifications, and comprehensive user controls.
