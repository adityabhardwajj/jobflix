import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotifications } from '../useNotifications';
import { apiClient } from '@/lib/api';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    getNotifications: jest.fn(),
    markNotificationAsRead: jest.fn(),
    markAllNotificationsAsRead: jest.fn(),
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

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch notifications successfully', async () => {
    const mockNotifications = [
      {
        id: '1',
        title: 'New Job Match',
        message: 'You have a new job match!',
        type: 'job_match',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (apiClient.getNotifications as jest.Mock).mockResolvedValue({
      data: { data: mockNotifications },
      status: 200,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.notifications).toEqual(mockNotifications);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle API errors', async () => {
    (apiClient.getNotifications as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.notifications).toEqual([]);
  });

  it('should mark notification as read', async () => {
    const mockNotifications = [
      {
        id: '1',
        title: 'New Job Match',
        message: 'You have a new job match!',
        type: 'job_match',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (apiClient.getNotifications as jest.Mock).mockResolvedValue({
      data: { data: mockNotifications },
      status: 200,
    });

    (apiClient.markNotificationAsRead as jest.Mock).mockResolvedValue({
      data: { success: true },
      status: 200,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.markAsRead('1');
    });

    expect(apiClient.markNotificationAsRead).toHaveBeenCalledWith('1');
  });

  it('should mark all notifications as read', async () => {
    const mockNotifications = [
      {
        id: '1',
        title: 'New Job Match',
        message: 'You have a new job match!',
        type: 'job_match',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (apiClient.getNotifications as jest.Mock).mockResolvedValue({
      data: { data: mockNotifications },
      status: 200,
    });

    (apiClient.markAllNotificationsAsRead as jest.Mock).mockResolvedValue({
      data: { success: true },
      status: 200,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      result.current.markAllAsRead();
    });

    expect(apiClient.markAllNotificationsAsRead).toHaveBeenCalled();
  });

  it('should calculate stats correctly', async () => {
    const mockNotifications = [
      {
        id: '1',
        title: 'New Job Match',
        message: 'You have a new job match!',
        type: 'job_match',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Application Update',
        message: 'Your application status has been updated.',
        type: 'application_update',
        is_read: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    (apiClient.getNotifications as jest.Mock).mockResolvedValue({
      data: { data: mockNotifications },
      status: 200,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.stats).toEqual({
      total: 2,
      unread: 1,
      by_type: {
        job_match: 1,
        application_update: 1,
      },
    });
  });

  it('should handle filters correctly', async () => {
    const filters = { is_read: false, type: 'job_match' };

    (apiClient.getNotifications as jest.Mock).mockResolvedValue({
      data: { data: [] },
      status: 200,
    });

    renderHook(() => useNotifications(filters), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(apiClient.getNotifications).toHaveBeenCalledWith({
      page: 1,
      limit: 50,
      unread_only: true,
      type: 'job_match',
    });
  });
});
