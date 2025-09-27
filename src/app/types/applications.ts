export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  resume_url?: string;
  resume_file_id?: string;
  cover_letter?: string;
  screening_answers: ScreeningAnswer[];
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  job?: {
    id: string;
    title: string;
    company: {
      name: string;
      logo_url?: string;
    };
  };
}

export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'OFFER_MADE'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'ACCEPTED';

export interface ScreeningAnswer {
  question_id: string;
  question: string;
  answer: string;
  question_type: 'text' | 'multiple_choice' | 'yes_no' | 'file_upload';
  options?: string[];
  required: boolean;
}

export interface ApplicationDraft {
  id: string;
  job_id: string;
  user_id: string;
  resume_file_id?: string;
  resume_url?: string;
  cover_letter?: string;
  screening_answers: ScreeningAnswer[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface ApplicationStatusUpdate {
  id: string;
  application_id: string;
  status: ApplicationStatus;
  message?: string;
  created_at: string;
  updated_by?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatus[];
  job_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApplicationStats {
  total: number;
  by_status: Record<ApplicationStatus, number>;
  recent_applications: Application[];
}
