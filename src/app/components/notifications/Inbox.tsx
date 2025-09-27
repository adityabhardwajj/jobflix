'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Spinner,
  Divider,
} from '@heroui/react';
import { Bell, Check, CheckCheck, Filter, Search, X } from 'lucide-react';
import { useNotifications } from '@/app/hooks/useNotifications';
import { Notification, NotificationFilters } from '@/app/types/notifications';
import { formatDistanceToNow } from 'date-fns';

interface InboxProps {
  isOpen: boolean;
  onClose: () => void;
}

const notificationTypeLabels = {
  job_match: 'Job Match',
  application_update: 'Application Update',
  system: 'System',
  reminder: 'Reminder',
};

const notificationTypeColors = {
  job_match: 'success',
  application_update: 'primary',
  system: 'warning',
  reminder: 'secondary',
} as const;

export default function Inbox({ isOpen, onClose }: InboxProps) {
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useNotifications(filters);

  // Filter notifications by search query
  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(query) ||
      notification.message.toLowerCase().includes(query)
    );
  });

  const handleFilterChange = (key: keyof NotificationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return '🎯';
      case 'application_update':
        return '📝';
      case 'system':
        return '⚙️';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      className="max-h-[80vh]"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              <span className="text-lg font-semibold">Notifications</span>
              {stats.unread > 0 && (
                <Chip size="sm" color="danger" variant="solid">
                  {stats.unread}
                </Chip>
              )}
            </div>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={handleMarkAllAsRead}
              isLoading={isMarkingAllAsRead}
              startContent={<CheckCheck size={16} />}
              isDisabled={stats.unread === 0}
            >
              Mark All Read
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className="gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Search size={16} />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by type"
              selectedKeys={filters.type ? [filters.type] : ['all']}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleFilterChange('type', value);
              }}
              className="w-full sm:w-48"
            >
              <SelectItem key="all">All Types</SelectItem>
              <SelectItem key="job_match">Job Matches</SelectItem>
              <SelectItem key="application_update">Application Updates</SelectItem>
              <SelectItem key="system">System</SelectItem>
              <SelectItem key="reminder">Reminders</SelectItem>
            </Select>
            <Select
              placeholder="Filter by status"
              selectedKeys={filters.is_read !== undefined ? [filters.is_read.toString()] : ['all']}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleFilterChange('is_read', value === 'all' ? undefined : value === 'true');
              }}
              className="w-full sm:w-48"
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="false">Unread</SelectItem>
              <SelectItem key="true">Read</SelectItem>
            </Select>
          </div>

          <Divider />

          {/* Notifications List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-fg">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications found</p>
                <p className="text-sm">
                  {searchQuery || Object.keys(filters).length > 0
                    ? 'Try adjusting your filters or search query'
                    : "You're all caught up!"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    notification.is_read
                      ? 'bg-card border-border'
                      : 'bg-primary/5 border-primary/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm ${
                            notification.is_read ? 'text-muted-fg' : 'text-fg'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-fg mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Chip
                              size="sm"
                              color={notificationTypeColors[notification.type]}
                              variant="flat"
                            >
                              {notificationTypeLabels[notification.type]}
                            </Chip>
                            <span className="text-xs text-muted-fg">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => handleMarkAsRead(notification.id)}
                            startContent={<Check size={14} />}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
