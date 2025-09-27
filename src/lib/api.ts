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

  async updateJob(id: string, data: any): Promise<ApiResponse<Job>> {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getApplications(filters: any = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request<any[]>(`/applications?${queryParams}`);
  }

  async getApplication(applicationId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/applications/${applicationId}`);
  }

  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard/stats');
  }

  async getNotifications(filters: any = {}): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request<any[]>(`/notifications?${queryParams}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<any>> {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Profile API
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile');
  }

  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile');
  }

  async updateProfile(profile: UserProfile): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async updateUserProfile(profile: UserProfile): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async getUserSkills(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/users/skills');
  }

  async addUserSkill(skill: string): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/users/skills', {
      method: 'POST',
      body: JSON.stringify({ skill }),
    });
  }

  // Application API
  async applyToJob(payload: ApplyPayload): Promise<ApiResponse<{ applicationId: string }>> {
    return this.request<{ applicationId: string }>('/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createApplicationDraft(jobId: string): Promise<ApiResponse<any>> {
    return this.request<any>('/applications/draft', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async updateApplicationDraft(draftId: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/applications/draft/${draftId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadResume(draftId: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('draftId', draftId);
    
    return this.request<any>('/applications/upload-resume', {
      method: 'POST',
      body: formData,
    });
  }

  async saveScreeningAnswers(draftId: string, answers: any[]): Promise<ApiResponse<any>> {
    return this.request<any>('/applications/screening-answers', {
      method: 'POST',
      body: JSON.stringify({ draftId, answers }),
    });
  }

  async submitApplication(draftId: string): Promise<ApiResponse<any>> {
    return this.request<any>('/applications/submit', {
      method: 'POST',
      body: JSON.stringify({ draftId }),
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