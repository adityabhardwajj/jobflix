'use client';

import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { 
  FileText, 
  Clock, 
  Eye, 
  CheckCircle, 
  Calendar, 
  UserCheck, 
  Gift, 
  XCircle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ApplicationStatus, ApplicationStatusUpdate } from '@/app/types/applications';
import { formatDistanceToNow } from 'date-fns';

interface StatusTimelineProps {
  statusUpdates: ApplicationStatusUpdate[];
  currentStatus: ApplicationStatus;
  className?: string;
}

const statusConfig = {
  DRAFT: {
    icon: FileText,
    color: 'default' as const,
    label: 'Draft',
    description: 'Application is being prepared',
  },
  SUBMITTED: {
    icon: CheckCircle,
    color: 'primary' as const,
    label: 'Submitted',
    description: 'Application has been submitted',
  },
  UNDER_REVIEW: {
    icon: Eye,
    color: 'primary' as const,
    label: 'Under Review',
    description: 'Application is being reviewed',
  },
  SHORTLISTED: {
    icon: CheckCircle2,
    color: 'warning' as const,
    label: 'Shortlisted',
    description: 'You have been shortlisted',
  },
  INTERVIEW_SCHEDULED: {
    icon: Calendar,
    color: 'warning' as const,
    label: 'Interview Scheduled',
    description: 'Interview has been scheduled',
  },
  INTERVIEW_COMPLETED: {
    icon: UserCheck,
    color: 'warning' as const,
    label: 'Interview Completed',
    description: 'Interview has been completed',
  },
  OFFER_MADE: {
    icon: Gift,
    color: 'success' as const,
    label: 'Offer Made',
    description: 'Job offer has been extended',
  },
  ACCEPTED: {
    icon: CheckCircle2,
    color: 'success' as const,
    label: 'Accepted',
    description: 'Offer has been accepted',
  },
  REJECTED: {
    icon: XCircle,
    color: 'danger' as const,
    label: 'Rejected',
    description: 'Application was not successful',
  },
  WITHDRAWN: {
    icon: RotateCcw,
    color: 'default' as const,
    label: 'Withdrawn',
    description: 'Application has been withdrawn',
  },
};

export default function StatusTimeline({ 
  statusUpdates, 
  currentStatus, 
  className 
}: StatusTimelineProps) {
  // Sort status updates by date (newest first)
  const sortedUpdates = [...statusUpdates].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get the current status config
  const currentStatusConfig = statusConfig[currentStatus];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <currentStatusConfig.icon 
              size={20} 
              className="text-primary" 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Application Status</h3>
            <p className="text-sm text-muted-fg">
              {currentStatusConfig.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <currentStatusConfig.icon 
                size={20} 
                className={`text-${currentStatusConfig.color}`}
              />
              <div>
                <p className="font-medium">{currentStatusConfig.label}</p>
                <p className="text-sm text-muted-fg">
                  Current status
                </p>
              </div>
            </div>
            <Chip 
              color={currentStatusConfig.color}
              variant="flat"
              size="sm"
            >
              {currentStatusConfig.label}
            </Chip>
          </div>

          {/* Timeline */}
          {sortedUpdates.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-fg mb-3">
                Status History
              </h4>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                
                {sortedUpdates.map((update, index) => {
                  const config = statusConfig[update.status];
                  const isLatest = index === 0;
                  
                  return (
                    <div key={update.id} className="relative flex items-start gap-4 pb-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        isLatest 
                          ? `bg-${config.color} text-white` 
                          : 'bg-muted border-2 border-border'
                      }`}>
                        <config.icon size={16} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">
                            {config.label}
                          </p>
                          {isLatest && (
                            <Chip 
                              color={config.color}
                              size="sm"
                              variant="flat"
                            >
                              Latest
                            </Chip>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-fg mb-1">
                          {config.description}
                        </p>
                        
                        {update.message && (
                          <p className="text-sm text-muted-fg italic">
                            "{update.message}"
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-fg">
                          {formatDistanceToNow(new Date(update.created_at), { 
                            addSuffix: true 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No updates message */}
          {sortedUpdates.length === 0 && (
            <div className="text-center py-6 text-muted-fg">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No status updates yet</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// Compact version for smaller spaces
export function StatusTimelineCompact({ 
  currentStatus, 
  className 
}: {
  currentStatus: ApplicationStatus;
  className?: string;
}) {
  const config = statusConfig[currentStatus];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <config.icon 
        size={16} 
        className={`text-${config.color}`}
      />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}

// Status badge component
export function StatusBadge({ 
  status, 
  size = 'sm' 
}: {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  const config = statusConfig[status];

  return (
    <Chip 
      color={config.color}
      variant="flat"
      size={size}
      startContent={<config.icon size={14} />}
    >
      {config.label}
    </Chip>
  );
}
