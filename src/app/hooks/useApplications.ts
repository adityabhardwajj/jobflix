'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { 
  Application, 
  ApplicationDraft, 
  ApplicationFilters, 
  ApplicationStats,
  ScreeningAnswer 
} from '@/app/types/applications';

export function useApplications(filters: ApplicationFilters = {}) {
  const queryClient = useQueryClient();

  // Fetch applications
  const {
    data: applications,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const response = await apiClient.getApplications({
        page: filters.page || 1,
        limit: filters.limit || 20,
        status: filters.status?.[0], // Convert array to single status
        job_id: filters.job_id,
        search: filters.search,
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return (response.data as any)?.data || [];
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  // Fetch application stats
  const { data: stats } = useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      const response = await apiClient.getApplications();
      if (response.error) {
        throw new Error(response.error);
      }
      
      const apps = (response.data as any)?.data || [];
      const byStatus = apps.reduce((acc: Record<string, number>, app: Application) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      return {
        total: apps.length,
        by_status: byStatus,
        recent_applications: apps.slice(0, 5)
      } as ApplicationStats;
    },
    staleTime: 30000,
  });

  return {
    applications: applications || [],
    stats: stats || { total: 0, by_status: {}, recent_applications: [] },
    isLoading,
    error,
    refetch,
  };
}

export function useApplicationDraft(jobId: string) {
  const [draft, setDraft] = useState<ApplicationDraft | null>(null);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const queryClient = useQueryClient();

  // Create or get existing draft
  const createDraftMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiClient.createApplicationDraft(jobId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
      setDraft(data as ApplicationDraft);
    },
  });

  // Upload resume
  const uploadResumeMutation = useMutation({
    mutationFn: async ({ draftId, file }: { draftId: string; file: File }) => {
      const response = await apiClient.uploadResume(draftId, file);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (draft) {
        setDraft({ ...draft, resume_file_id: (data as any).file_id, resume_url: (data as any).url });
      }
    },
  });

  // Save screening answers
  const saveAnswersMutation = useMutation({
    mutationFn: async ({ draftId, answers }: { draftId: string; answers: ScreeningAnswer[] }) => {
      const response = await apiClient.saveScreeningAnswers(draftId, answers);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (draft) {
        setDraft({ ...draft, screening_answers: (data as any).screening_answers });
      }
    },
  });

  // Submit application
  const submitMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const response = await apiClient.submitApplication(draftId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Application;
    },
    onSuccess: () => {
      // Invalidate applications query
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-stats'] });
    },
  });

  // Auto-save functionality
  const autoSave = useCallback(
    debounce(async (draftData: Partial<ApplicationDraft>) => {
      if (!draft) return;
      
      setIsDraftSaving(true);
      try {
        const response = await apiClient.updateApplicationDraft(draft.id, draftData);
        if (response.error) {
          console.error('Auto-save failed:', response.error);
        } else {
          setDraft(prev => prev ? { ...prev, ...draftData } : null);
        }
      } catch (error) {
        console.error('Auto-save error:', error);
      } finally {
        setIsDraftSaving(false);
      }
    }, 2000),
    [draft]
  );

  // Actions
  const createDraft = useCallback((jobId: string) => {
    createDraftMutation.mutate(jobId);
  }, [createDraftMutation]);

  const uploadResume = useCallback((file: File) => {
    if (!draft) return;
    uploadResumeMutation.mutate({ draftId: draft.id, file });
  }, [draft, uploadResumeMutation]);

  const saveAnswers = useCallback((answers: ScreeningAnswer[]) => {
    if (!draft) return;
    saveAnswersMutation.mutate({ draftId: draft.id, answers });
  }, [draft, saveAnswersMutation]);

  const submit = useCallback(async () => {
    if (!draft) return;
    return submitMutation.mutateAsync(draft.id);
  }, [draft, submitMutation]);

  const updateDraft = useCallback((updates: Partial<ApplicationDraft>) => {
    if (!draft) return;
    
    setDraft(prev => prev ? { ...prev, ...updates } : null);
    autoSave(updates);
  }, [draft, autoSave]);

  return {
    draft,
    isDraftLoading: isDraftLoading || createDraftMutation.isPending,
    isDraftSaving,
    isUploading: uploadResumeMutation.isPending,
    isSubmitting: submitMutation.isPending,
    createDraft,
    uploadResume,
    saveAnswers,
    submit,
    updateDraft,
    error: createDraftMutation.error || uploadResumeMutation.error || 
           saveAnswersMutation.error || submitMutation.error,
  };
}

export function useApplicationStatus(applicationId: string) {
  const {
    data: application,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const response = await apiClient.getApplication(applicationId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data as Application;
    },
    enabled: !!applicationId,
    staleTime: 30000,
  });

  return {
    application,
    isLoading,
    error,
    refetch,
  };
}

// Check if user has already applied to a job
export function useExistingApplication(jobId: string) {
  const {
    data: existingApplication,
    isLoading,
    error
  } = useQuery({
    queryKey: ['existing-application', jobId],
    queryFn: async () => {
      const response = await apiClient.getApplications({ job_id: jobId });
      if (response.error) {
        throw new Error(response.error);
      }
      
      const applications = (response.data as any)?.data || [];
      // Find non-withdrawn, non-rejected applications
      return applications.find((app: Application) => 
        app.status !== 'WITHDRAWN' && app.status !== 'REJECTED'
      ) || null;
    },
    enabled: !!jobId,
    staleTime: 30000,
  });

  return {
    existingApplication,
    hasApplied: !!existingApplication,
    isLoading,
    error,
  };
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
