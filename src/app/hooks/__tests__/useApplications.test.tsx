import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApplications, useApplicationDraft, useExistingApplication } from '../useApplications';
import { apiClient } from '@/lib/api';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    getApplications: jest.fn(),
    createApplicationDraft: jest.fn(),
    uploadResume: jest.fn(),
    saveScreeningAnswers: jest.fn(),
    submitApplication: jest.fn(),
    updateApplicationDraft: jest.fn(),
  },
}));

// Mock React Query
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

describe('useApplications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch applications successfully', async () => {
    const mockApplications = [
      {
        id: '1',
        job_id: 'job-1',
        user_id: 'user-1',
        status: 'SUBMITTED',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (apiClient.getApplications as jest.Mock).mockResolvedValue({
      data: { data: mockApplications },
      status: 200,
    });

    const { result } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.applications).toEqual(mockApplications);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle API errors', async () => {
    (apiClient.getApplications as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const { result } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.applications).toEqual([]);
  });

  it('should calculate stats correctly', async () => {
    const mockApplications = [
      { id: '1', status: 'SUBMITTED' },
      { id: '2', status: 'UNDER_REVIEW' },
      { id: '3', status: 'REJECTED' },
    ];

    (apiClient.getApplications as jest.Mock).mockResolvedValue({
      data: { data: mockApplications },
      status: 200,
    });

    const { result } = renderHook(() => useApplications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.stats).toEqual({
        total: 3,
        by_status: {
          SUBMITTED: 1,
          UNDER_REVIEW: 1,
          REJECTED: 1,
        },
        recent_applications: mockApplications.slice(0, 5),
      });
    });
  });
});

describe('useApplicationDraft', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create draft successfully', async () => {
    const mockDraft = {
      id: 'draft-1',
      job_id: 'job-1',
      user_id: 'user-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    (apiClient.createApplicationDraft as jest.Mock).mockResolvedValue({
      data: mockDraft,
      status: 200,
    });

    const { result } = renderHook(() => useApplicationDraft('job-1'), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.createDraft('job-1');
    });

    await waitFor(() => {
      expect(result.current.draft).toEqual(mockDraft);
    });

    expect(result.current.isDraftLoading).toBe(false);
  });

  it('should upload resume successfully', async () => {
    const mockFile = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const mockDraft = { id: 'draft-1', job_id: 'job-1' };

    (apiClient.uploadResume as jest.Mock).mockResolvedValue({
      data: { file_id: 'file-1', url: 'https://example.com/resume.pdf' },
      status: 200,
    });

    const { result } = renderHook(() => useApplicationDraft('job-1'), {
      wrapper: createWrapper(),
    });

    // Mock draft state
    act(() => {
      result.current.draft = mockDraft;
    });

    await act(async () => {
      result.current.uploadResume(mockFile);
    });

    expect(apiClient.uploadResume).toHaveBeenCalledWith('draft-1', mockFile);
  });

  it('should save screening answers', async () => {
    const mockAnswers = [
      {
        question_id: 'q1',
        question: 'Why do you want this job?',
        answer: 'I am passionate about this role',
        question_type: 'text',
        required: true,
      },
    ];

    (apiClient.saveScreeningAnswers as jest.Mock).mockResolvedValue({
      data: { screening_answers: mockAnswers },
      status: 200,
    });

    const { result } = renderHook(() => useApplicationDraft('job-1'), {
      wrapper: createWrapper(),
    });

    // Mock draft state
    act(() => {
      result.current.draft = { id: 'draft-1', job_id: 'job-1' };
    });

    await act(async () => {
      result.current.saveAnswers(mockAnswers);
    });

    expect(apiClient.saveScreeningAnswers).toHaveBeenCalledWith('draft-1', mockAnswers);
  });

  it('should submit application', async () => {
    const mockApplication = {
      id: 'app-1',
      status: 'SUBMITTED',
    };

    (apiClient.submitApplication as jest.Mock).mockResolvedValue({
      data: mockApplication,
      status: 200,
    });

    const { result } = renderHook(() => useApplicationDraft('job-1'), {
      wrapper: createWrapper(),
    });

    // Mock draft state
    act(() => {
      result.current.draft = { id: 'draft-1', job_id: 'job-1' };
    });

    await act(async () => {
      result.current.submit();
    });

    expect(apiClient.submitApplication).toHaveBeenCalledWith('draft-1');
  });

  it('should handle auto-save with debounce', async () => {
    jest.useFakeTimers();

    const mockDraft = { id: 'draft-1', job_id: 'job-1' };
    (apiClient.updateApplicationDraft as jest.Mock).mockResolvedValue({
      data: mockDraft,
      status: 200,
    });

    const { result } = renderHook(() => useApplicationDraft('job-1'), {
      wrapper: createWrapper(),
    });

    // Mock draft state
    act(() => {
      result.current.draft = mockDraft;
    });

    // Trigger multiple updates quickly
    act(() => {
      result.current.updateDraft({ cover_letter: 'First update' });
    });

    act(() => {
      result.current.updateDraft({ cover_letter: 'Second update' });
    });

    act(() => {
      result.current.updateDraft({ cover_letter: 'Third update' });
    });

    // Fast-forward time to trigger debounced save
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(apiClient.updateApplicationDraft).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });
});

describe('useExistingApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect existing application', async () => {
    const mockApplications = [
      {
        id: 'app-1',
        job_id: 'job-1',
        status: 'SUBMITTED',
      },
    ];

    (apiClient.getApplications as jest.Mock).mockResolvedValue({
      data: { data: mockApplications },
      status: 200,
    });

    const { result } = renderHook(() => useExistingApplication('job-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.hasApplied).toBe(true);
      expect(result.current.existingApplication).toEqual(mockApplications[0]);
    });
  });

  it('should not detect withdrawn/rejected applications', async () => {
    const mockApplications = [
      {
        id: 'app-1',
        job_id: 'job-1',
        status: 'WITHDRAWN',
      },
      {
        id: 'app-2',
        job_id: 'job-1',
        status: 'REJECTED',
      },
    ];

    (apiClient.getApplications as jest.Mock).mockResolvedValue({
      data: { data: mockApplications },
      status: 200,
    });

    const { result } = renderHook(() => useExistingApplication('job-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.hasApplied).toBe(false);
      expect(result.current.existingApplication).toBeNull();
    });
  });

  it('should handle no applications', async () => {
    (apiClient.getApplications as jest.Mock).mockResolvedValue({
      data: { data: [] },
      status: 200,
    });

    const { result } = renderHook(() => useExistingApplication('job-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.hasApplied).toBe(false);
      expect(result.current.existingApplication).toBeNull();
    });
  });
});
