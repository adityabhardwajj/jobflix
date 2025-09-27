export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'job_match' | 'application_update' | 'system' | 'reminder';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  job_match_notifications: boolean;
  application_update_notifications: boolean;
  system_notifications: boolean;
  reminder_notifications: boolean;
}

export interface NotificationFilters {
  type?: string;
  is_read?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: Record<string, number>;
}
