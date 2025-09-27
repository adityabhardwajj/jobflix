'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Pagination,
  Spinner,
} from '@heroui/react';
import { Search, Filter, Plus, Eye } from 'lucide-react';
import { useApplications } from '@/app/hooks/useApplications';
import { ApplicationFilters, ApplicationStatus } from '@/app/types/applications';
import { StatusBadge } from '@/app/components/applications/StatusTimeline';
import { formatDistanceToNow } from 'date-fns';

const statusOptions = [
  { key: 'all', label: 'All Status' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled' },
  { key: 'INTERVIEW_COMPLETED', label: 'Interview Completed' },
  { key: 'OFFER_MADE', label: 'Offer Made' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'WITHDRAWN', label: 'Withdrawn' },
];

export default function ApplicationsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ApplicationFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    applications,
    stats,
    isLoading,
    error,
    refetch,
  } = useApplications({
    ...filters,
    search: searchQuery || undefined,
    page: currentPage,
    limit: 10,
  });

  const handleFilterChange = (key: keyof ApplicationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewApplication = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  const handleBrowseJobs = () => {
    router.push('/jobs');
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-danger mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Applications</h2>
          <p className="text-muted-fg mb-6">
            There was an error loading your applications. Please try again.
          </p>
          <Button color="primary" onPress={() => refetch()}>
            Try Again
          </Button>
        </CardBody>
      </Card>
    </div>
  );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-fg">
            Track the status of your job applications
          </p>
        </div>
        <Button
          color="primary"
          onPress={handleBrowseJobs}
          startContent={<Plus size={16} />}
        >
          Browse Jobs
        </Button>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-fg">Total Applications</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-warning">
                {(stats.by_status as any)?.UNDER_REVIEW || 0}
              </div>
              <div className="text-sm text-muted-fg">Under Review</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-success">
                {(stats.by_status as any)?.SHORTLISTED || 0}
              </div>
              <div className="text-sm text-muted-fg">Shortlisted</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center">
              <div className="text-2xl font-bold text-danger">
                {(stats.by_status as any)?.REJECTED || 0}
              </div>
              <div className="text-sm text-muted-fg">Rejected</div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onValueChange={handleSearch}
              startContent={<Search size={16} />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by status"
              selectedKeys={filters.status ? [filters.status[0]] : ['all']}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleFilterChange('status', value);
              }}
              className="w-full sm:w-48"
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="text-muted-fg mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No Applications Found</h2>
            <p className="text-muted-fg mb-6">
              {searchQuery || Object.keys(filters).length > 0
                ? 'No applications match your current filters.'
                : "You haven't applied to any jobs yet."}
            </p>
            <Button
              color="primary"
              onPress={handleBrowseJobs}
              startContent={<Plus size={16} />}
            >
              Browse Jobs
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application: any) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold truncate">
                        {application.job?.title || 'Unknown Position'}
                      </h3>
                      <StatusBadge status={application.status as ApplicationStatus} />
                    </div>
                    
                    <p className="text-muted-fg mb-3">
                      {application.job?.company?.name || 'Unknown Company'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-fg">
                      <span>
                        Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                      </span>
                      {application.submitted_at && (
                        <span>
                          Submitted {formatDistanceToNow(new Date(application.submitted_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => handleViewApplication(application.id)}
                      startContent={<Eye size={14} />}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* Pagination */}
          {applications.length > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={Math.ceil(stats.total / 10)}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
