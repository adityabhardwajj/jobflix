import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ApplyDrawer from '../ApplyDrawer';
import { Job } from '@/app/types/jobs';

// Mock the hooks
jest.mock('@/app/hooks/useApplications', () => ({
  useApplicationDraft: jest.fn(),
  useExistingApplication: jest.fn(),
}));

const mockJob: Job = {
  id: 'job-1',
  title: 'Software Engineer',
  company: {
    id: 'company-1',
    name: 'Tech Corp',
    logo_url: 'https://example.com/logo.png',
  },
  location: 'San Francisco, CA',
  work_type: ['FULL_TIME'],
  experience_level: 'MID_LEVEL',
  salary_min: 80000,
  salary_max: 120000,
  description: 'Great job opportunity',
  requirements: ['React', 'TypeScript'],
  screening_questions: [
    {
      id: 'q1',
      question: 'Why do you want this job?',
      type: 'text',
      required: true,
    },
    {
      id: 'q2',
      question: 'Do you have 3+ years experience?',
      type: 'yes_no',
      required: true,
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ApplyDrawer', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render apply drawer when open', () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    
    useApplicationDraft.mockReturnValue({
      draft: null,
      isDraftLoading: false,
      isDraftSaving: false,
      isUploading: false,
      isSubmitting: false,
      createDraft: jest.fn(),
      uploadResume: jest.fn(),
      saveAnswers: jest.fn(),
      submit: jest.fn(),
      updateDraft: jest.fn(),
      error: null,
    });

    useExistingApplication.mockReturnValue({
      existingApplication: null,
      hasApplied: false,
      isLoading: false,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Apply to Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  it('should show existing application when user has already applied', () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    
    useApplicationDraft.mockReturnValue({
      draft: null,
      isDraftLoading: false,
      createDraft: jest.fn(),
    });

    useExistingApplication.mockReturnValue({
      existingApplication: {
        id: 'app-1',
        status: 'SUBMITTED',
        created_at: '2024-01-01T00:00:00Z',
      },
      hasApplied: true,
      isLoading: false,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Already Applied')).toBeInTheDocument();
    expect(screen.getByText('You have already applied to this position')).toBeInTheDocument();
    expect(screen.getByText('View Application')).toBeInTheDocument();
  });

  it('should handle file upload', async () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    const mockUploadResume = jest.fn();
    
    useApplicationDraft.mockReturnValue({
      draft: { id: 'draft-1', job_id: 'job-1' },
      isDraftLoading: false,
      isUploading: false,
      uploadResume: mockUploadResume,
    });

    useExistingApplication.mockReturnValue({
      existingApplication: null,
      hasApplied: false,
      isLoading: false,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/choose file/i);
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadResume).toHaveBeenCalledWith(file);
    });
  });

  it('should handle screening questions', async () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    const mockSaveAnswers = jest.fn();
    
    useApplicationDraft.mockReturnValue({
      draft: { id: 'draft-1', job_id: 'job-1' },
      isDraftLoading: false,
      saveAnswers: mockSaveAnswers,
    });

    useExistingApplication.mockReturnValue({
      existingApplication: null,
      hasApplied: false,
      isLoading: false,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    // Navigate to screening questions step
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton); // Skip cover letter step

    expect(screen.getByText('Screening Questions')).toBeInTheDocument();
    expect(screen.getByText('Why do you want this job?')).toBeInTheDocument();
    expect(screen.getByText('Do you have 3+ years experience?')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    const mockSubmit = jest.fn().mockResolvedValue({ id: 'app-1' });
    
    useApplicationDraft.mockReturnValue({
      draft: { 
        id: 'draft-1', 
        job_id: 'job-1',
        resume_file_id: 'file-1',
      },
      isDraftLoading: false,
      isSubmitting: false,
      submit: mockSubmit,
    });

    useExistingApplication.mockReturnValue({
      existingApplication: null,
      hasApplied: false,
      isLoading: false,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    // Navigate to review step
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton); // Resume step
    fireEvent.click(nextButton); // Cover letter step
    fireEvent.click(nextButton); // Screening questions step

    // Submit application
    const submitButton = screen.getByText('Submit Application');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  it('should show loading states', () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    
    useApplicationDraft.mockReturnValue({
      draft: null,
      isDraftLoading: true,
      isDraftSaving: true,
      isUploading: true,
      isSubmitting: true,
      createDraft: jest.fn(),
    });

    useExistingApplication.mockReturnValue({
      existingApplication: null,
      hasApplied: false,
      isLoading: true,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('should handle errors', () => {
    const { useApplicationDraft, useExistingApplication } = require('@/app/hooks/useApplications');
    
    useApplicationDraft.mockReturnValue({
      draft: null,
      isDraftLoading: false,
      error: new Error('Failed to create draft'),
    });

    useExistingApplication.mockReturnValue({
      existingApplication: null,
      hasApplied: false,
      isLoading: false,
      error: null,
    });

    render(
      <ApplyDrawer
        isOpen={true}
        onClose={mockOnClose}
        job={mockJob}
        onSuccess={mockOnSuccess}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Failed to create draft')).toBeInTheDocument();
  });
});
