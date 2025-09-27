import { Job, UserProfile, ApplyPayload, SavePayload, ApiResponse } from './schemas';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Jobs API
  async getJobs(): Promise<ApiResponse<Job[]>> {
    return this.request<Job[]>('/jobs');
  }

  async getJob(id: string): Promise<ApiResponse<Job>> {
    return this.request<Job>(`/jobs/${id}`);
  }

  // Profile API
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile');
  }

  async updateProfile(profile: UserProfile): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Application API
  async applyToJob(payload: ApplyPayload): Promise<ApiResponse<{ applicationId: string }>> {
    return this.request<{ applicationId: string }>('/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async saveJob(payload: SavePayload): Promise<ApiResponse<{ saved: boolean }>> {
    return this.request<{ saved: boolean }>('/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getSavedJobs(): Promise<ApiResponse<Job[]>> {
    return this.request<Job[]>('/saved');
  }

  // Analytics API
  async trackSwipe(jobId: string, action: string): Promise<ApiResponse<void>> {
    return this.request<void>('/analytics/swipe', {
      method: 'POST',
      body: JSON.stringify({ jobId, action }),
    });
  }
}

export const apiClient = new ApiClient();

// Mock API responses for development
export const mockApiResponses = {
  jobs: {
    success: true,
    data: [] as Job[]
  },
  profile: {
    success: true,
    data: null as UserProfile | null
  },
  apply: {
    success: true,
    data: { applicationId: 'app-' + Date.now() }
  },
  save: {
    success: true,
    data: { saved: true }
  }
};