'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Avatar,
} from '@heroui/react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase, 
  Calendar,
  ExternalLink,
  Heart,
  Share2
} from 'lucide-react';
import { Job } from '@/app/types/jobs';
import ApplyDrawer from '@/app/components/applications/ApplyDrawer';
import { useExistingApplication } from '@/app/hooks/useApplications';

interface JobDetailProps {
  job: Job;
  onBack?: () => void;
}

export default function JobDetail({ job, onBack }: JobDetailProps) {
  const [isApplyDrawerOpen, setIsApplyDrawerOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const {
    existingApplication,
    hasApplied,
    isLoading: checkingExisting,
  } = useExistingApplication(job.id);

  const handleApply = () => {
    setIsApplyDrawerOpen(true);
  };

  const handleApplySuccess = (applicationId: string) => {
    setIsApplyDrawerOpen(false);
    // Redirect to application detail page
    window.location.href = `/applications/${applicationId}`;
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save job functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company?.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getWorkTypeColor = (workType: string) => {
    switch (workType) {
      case 'FULL_TIME':
        return 'success';
      case 'PART_TIME':
        return 'warning';
      case 'CONTRACT':
        return 'secondary';
      case 'INTERNSHIP':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'ENTRY_LEVEL':
        return 'success';
      case 'MID_LEVEL':
        return 'warning';
      case 'SENIOR_LEVEL':
        return 'danger';
      case 'EXECUTIVE':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {job.company?.logo_url ? (
              <Avatar
                src={job.company.logo_url}
                alt={job.company.name}
                size="lg"
                className="flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Briefcase size={24} className="text-muted-fg" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-lg text-muted-fg">{job.company?.name}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-muted-fg">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-fg">
              <Clock size={16} />
              <span>{job.work_type?.join(', ')}</span>
            </div>
            {job.salary_min && job.salary_max && (
              <div className="flex items-center gap-2 text-muted-fg">
                <DollarSign size={16} />
                <span>${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            isIconOnly
            variant="flat"
            onPress={handleSaveJob}
            color={isSaved ? 'danger' : 'default'}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            onPress={handleShare}
          >
            <Share2 size={16} />
          </Button>
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <Briefcase size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-sm text-muted-fg">Work Type</div>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {job.work_type?.map((type) => (
                <Chip
                  key={type}
                  size="sm"
                  color={getWorkTypeColor(type)}
                  variant="flat"
                >
                  {type.replace('_', ' ')}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <Users size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-sm text-muted-fg">Experience Level</div>
            <Chip
              size="sm"
              color={getExperienceLevelColor(job.experience_level || '')}
              variant="flat"
              className="mt-1"
            >
              {job.experience_level?.replace('_', ' ')}
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <Calendar size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-sm text-muted-fg">Posted</div>
            <div className="text-sm font-medium mt-1">
              {new Date(job.created_at).toLocaleDateString()}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Job Description</h2>
        </CardHeader>
        <CardBody>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
        </CardBody>
      </Card>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Requirements</h2>
          </CardHeader>
          <CardBody>
            <ul className="list-disc list-inside space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="text-muted-fg">
                  {requirement}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {/* Screening Questions Preview */}
      {job.screening_questions && job.screening_questions.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Screening Questions</h2>
            <p className="text-sm text-muted-fg">
              You'll be asked to answer these questions when applying
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {job.screening_questions.map((question, index) => (
                <div key={question.id} className="border-b border-border pb-3 last:border-b-0">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {question.question}
                        {question.required && (
                          <span className="text-danger ml-1">*</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-fg mt-1">
                        {question.type.replace('_', ' ')} question
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Apply Button */}
      <div className="sticky bottom-4 z-10">
        <Card className="shadow-lg">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to Apply?</h3>
                <p className="text-sm text-muted-fg">
                  {hasApplied 
                    ? 'You have already applied to this position'
                    : 'Submit your application for this position'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {hasApplied && existingApplication ? (
                  <div className="flex items-center gap-2">
                    <Chip color="primary" variant="flat">
                      Applied
                    </Chip>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => window.location.href = `/applications/${existingApplication.id}`}
                    >
                      View Application
                    </Button>
                  </div>
                ) : (
                  <Button
                    color="primary"
                    size="lg"
                    onPress={handleApply}
                    isLoading={checkingExisting}
                    startContent={<Briefcase size={16} />}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Apply Drawer */}
      <ApplyDrawer
        isOpen={isApplyDrawerOpen}
        onClose={() => setIsApplyDrawerOpen(false)}
        job={job}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
}
