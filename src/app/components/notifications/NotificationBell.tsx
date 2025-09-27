'use client';

import { useState, useEffect } from 'react';
import { Button, Badge } from '@heroui/react';
import { Bell } from 'lucide-react';
import { useNotificationBadge } from '@/app/hooks/useNotifications';
import Inbox from './Inbox';

export default function NotificationBell() {
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const unreadCount = useNotificationBadge();

  // Keyboard shortcut: g n to open inbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'n' && event.metaKey) {
        event.preventDefault();
        setIsInboxOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Button
        isIconOnly
        variant="flat"
        className="relative bg-transparent hover:bg-muted"
        onPress={() => setIsInboxOpen(true)}
        aria-label="Open notifications"
      >
        <Bell size={20} className="text-muted-fg" />
        {unreadCount > 0 && (
          <Badge
            color="danger"
            size="sm"
            className="absolute -top-1 -right-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <Inbox
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
      />
    </>
  );
}
