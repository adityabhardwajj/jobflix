export interface Job {
  id: string;
  title: string;
  company?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  location: string;
  work_type: WorkType[];
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string[];
  screening_questions?: ScreeningQuestion[];
  is_remote?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export type WorkType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';

export type ExperienceLevel = 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';

export interface ScreeningQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple_choice' | 'yes_no' | 'file_upload';
  required: boolean;
  options?: string[];
}

export interface JobFilters {
  search?: string;
  location?: string;
  work_type?: WorkType[];
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  is_remote?: boolean;
  is_featured?: boolean;
  company_id?: string;
}

export interface JobStats {
  total: number;
  by_work_type: Record<WorkType, number>;
  by_experience_level: Record<ExperienceLevel, number>;
  by_location: Record<string, number>;
  average_salary: number;
}
