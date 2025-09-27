/**
 * API Configuration and utilities for connecting to FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * API Client class for making requests to the FastAPI backend
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get authentication token from session
   */
  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    try {
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      return (session as any)?.accessToken || null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Make HTTP request with authentication
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;
      
      // Don't set Content-Type for FormData, let browser set it
      const isFormData = options.body instanceof FormData;
      const headers = {
        ...(isFormData ? {} : this.defaultHeaders),
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || data.message || 'Request failed',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 500,
      };
    }
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User profile endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserSkills() {
    return this.request('/users/skills');
  }

  async addUserSkill(skillData: { skill_name: string; skill_level: string; years_of_experience?: number }) {
    return this.request('/users/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateUserSkill(skillId: string, skillData: any) {
    return this.request(`/users/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
  }

  async deleteUserSkill(skillId: string) {
    return this.request(`/users/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  // Job endpoints
  async getJobs(params: {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    work_type?: string[];
    experience_level?: string;
    salary_min?: number;
    salary_max?: number;
    company_id?: string;
    is_remote?: boolean;
    is_featured?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return this.request(`/jobs/?${searchParams.toString()}`);
  }

  async getJob(jobId: string) {
    return this.request(`/jobs/${jobId}`);
  }

  async createJob(jobData: any) {
    return this.request('/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId: string, jobData: any) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId: string) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Saved jobs endpoints
  async getSavedJobs() {
    return this.request('/jobs/saved/');
  }

  async saveJob(jobId: string) {
    return this.request('/jobs/saved/', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    });
  }

  async unsaveJob(jobId: string) {
    return this.request(`/jobs/saved/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Application endpoints
  async getApplications(params: { page?: number; limit?: number; status?: string; job_id?: string; search?: string } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/applications/?${searchParams.toString()}`);
  }

  async getApplication(applicationId: string) {
    return this.request(`/applications/${applicationId}`);
  }

  async createApplication(applicationData: {
    job_id: string;
    cover_letter?: string;
    resume_url?: string;
    portfolio_url?: string;
    linkedin_url?: string;
  }) {
    return this.request('/applications/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplication(applicationId: string, applicationData: any) {
    return this.request(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  }

  // Application draft endpoints
  async createApplicationDraft(jobId: string) {
    return this.request('/applications/draft', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    });
  }

  async getApplicationDraft(draftId: string) {
    return this.request(`/applications/draft/${draftId}`);
  }

  async updateApplicationDraft(draftId: string, draftData: any) {
    return this.request(`/applications/draft/${draftId}`, {
      method: 'PUT',
      body: JSON.stringify(draftData),
    });
  }

  // Resume upload
  async uploadResume(draftId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('draft_id', draftId);

    return this.request('/applications/upload-resume', {
      method: 'POST',
      body: formData,
    });
  }

  // Screening answers
  async saveScreeningAnswers(draftId: string, answers: any[]) {
    return this.request('/applications/screening-answers', {
      method: 'POST',
      body: JSON.stringify({ draft_id: draftId, answers }),
    });
  }

  // Submit application
  async submitApplication(draftId: string) {
    return this.request('/applications/submit', {
      method: 'POST',
      body: JSON.stringify({ draft_id: draftId }),
    });
  }

  // Company endpoints
  async getCompanies(params: { page?: number; limit?: number; search?: string } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/companies/?${searchParams.toString()}`);
  }

  async getCompany(companyId: string) {
    return this.request(`/companies/${companyId}`);
  }

  // Notification endpoints
  async getNotifications(params: { page?: number; limit?: number; unread_only?: boolean } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`/notifications/?${searchParams.toString()}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true }),
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  // AI endpoints
  async getJobMatches(userPreferences?: any) {
    return this.request('/ai/match-jobs', {
      method: 'POST',
      body: JSON.stringify(userPreferences || {}),
    });
  }

  async optimizeResume(jobId: string, resumeData: any) {
    return this.request('/ai/optimize-resume', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, ...resumeData }),
    });
  }

  async generateCoverLetter(jobId: string, userData: any) {
    return this.request('/ai/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId, ...userData }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
