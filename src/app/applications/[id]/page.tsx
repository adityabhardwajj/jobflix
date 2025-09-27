'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
} from '@heroui/react';
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useApplicationStatus } from '@/app/hooks/useApplications';
import StatusTimeline from '@/app/components/applications/StatusTimeline';
import { ApplicationStatusUpdate } from '@/app/types/applications';

// Simple confetti effect
function ConfettiEffect() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][
                Math.floor(Math.random() * 5)
              ],
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    application,
    isLoading,
    error,
    refetch,
  } = useApplicationStatus(applicationId);

  // Show confetti for newly submitted applications
  useEffect(() => {
    if (application && (application as any)?.status === 'SUBMITTED' && (application as any)?.submitted_at) {
      const submittedTime = new Date((application as any).submitted_at).getTime();
      const now = Date.now();
      const timeDiff = now - submittedTime;
      
      // Show confetti if application was submitted within the last 5 minutes
      if (timeDiff < 5 * 60 * 1000) {
        setShowConfetti(true);
      }
    }
  }, [application]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-fg">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-danger mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Application Not Found</h2>
            <p className="text-muted-fg mb-6">
              The application you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              color="primary"
              onPress={() => router.push('/applications')}
              startContent={<ArrowLeft size={16} />}
            >
              Back to Applications
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Mock status updates for timeline
  const statusUpdates: ApplicationStatusUpdate[] = [
    {
      id: '1',
      application_id: (application as any)?.id || '',
      status: 'SUBMITTED',
      message: 'Your application has been received and is being reviewed.',
      created_at: (application as any)?.submitted_at || (application as any)?.created_at || new Date().toISOString(),
    },
    {
      id: '2',
      application_id: (application as any)?.id || '',
      status: 'UNDER_REVIEW',
      message: 'Your application is currently under review by our hiring team.',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {showConfetti && <ConfettiEffect />}
      
      {/* Success Header */}
      {(application as any)?.status === 'SUBMITTED' && (
        <Card className="border-success/20 bg-success/5">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <CheckCircle size={32} className="text-success" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-success mb-2">
                  Application Submitted Successfully!
                </h1>
                <p className="text-muted-fg">
                  Thank you for applying to {(application as any)?.job?.title} at {(application as any)?.job?.company?.name}. 
                  We'll review your application and get back to you soon.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Job Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{(application as any)?.job?.title}</h3>
                  <p className="text-muted-fg">{(application as any)?.job?.company?.name}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-fg">Application ID</p>
                    <p className="font-mono text-sm">{(application as any)?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-fg">Applied Date</p>
                    <p>{new Date((application as any)?.created_at).toLocaleDateString()}</p>
                  </div>
                  {(application as any)?.submitted_at && (
                    <div>
                      <p className="text-sm text-muted-fg">Submitted Date</p>
                      <p>{new Date((application as any).submitted_at).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Application Content */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Application Details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {(application as any)?.cover_letter && (
                <div>
                  <h3 className="font-medium mb-2">Cover Letter</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{(application as any).cover_letter}</p>
                  </div>
                </div>
              )}

              {(application as any)?.resume_url && (
                <div>
                  <h3 className="font-medium mb-2">Resume</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<ExternalLink size={14} />}
                      onPress={() => window.open((application as any).resume_url, '_blank')}
                    >
                      View Resume
                    </Button>
                  </div>
                </div>
              )}

              {(application as any)?.screening_answers && (application as any).screening_answers.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Screening Questions</h3>
                  <div className="space-y-3">
                    {(application as any).screening_answers.map((answer: any, index: number) => (
                      <div key={answer.question_id} className="border-b border-border pb-3 last:border-b-0">
                        <p className="font-medium text-sm mb-1">
                          {index + 1}. {answer.question}
                        </p>
                        <p className="text-muted-fg text-sm">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <StatusTimeline
            statusUpdates={statusUpdates}
            currentStatus={(application as any)?.status}
          />

          {/* Actions */}
          <Card>
            <CardHeader>
              <h3 className="font-medium">Actions</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <Button
                variant="flat"
                className="w-full"
                onPress={() => router.push('/applications')}
                startContent={<ArrowLeft size={16} />}
              >
                Back to Applications
              </Button>
              
              <Button
                variant="flat"
                className="w-full"
                onPress={() => router.push('/jobs')}
                startContent={<ExternalLink size={16} />}
              >
                Browse More Jobs
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
