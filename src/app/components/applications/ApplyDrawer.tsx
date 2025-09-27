'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Progress,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Spinner,
} from '@heroui/react';
import { 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  CheckCircle, 
  Upload,
  X,
  AlertCircle
} from 'lucide-react';
import { useApplicationDraft, useExistingApplication } from '@/app/hooks/useApplications';
import { ApplicationDraft, ScreeningAnswer } from '@/app/types/applications';
import { Job } from '@/app/types/jobs';

interface ApplyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onSuccess?: (applicationId: string) => void;
}

const steps = [
  {
    id: 'resume',
    title: 'Resume',
    description: 'Upload your resume or select an existing one',
    icon: FileText,
    required: true,
  },
  {
    id: 'cover_letter',
    title: 'Cover Letter',
    description: 'Write a personalized cover letter',
    icon: MessageSquare,
    required: false,
  },
  {
    id: 'screening',
    title: 'Screening Questions',
    description: 'Answer job-specific questions',
    icon: HelpCircle,
    required: true,
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your application before submitting',
    icon: CheckCircle,
    required: true,
  },
];

export default function ApplyDrawer({ isOpen, onClose, job, onSuccess }: ApplyDrawerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ApplicationDraft>>({});
  const [screeningAnswers, setScreeningAnswers] = useState<ScreeningAnswer[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const {
    draft,
    isDraftLoading,
    isDraftSaving,
    isUploading,
    isSubmitting,
    createDraft,
    uploadResume,
    saveAnswers,
    submit,
    updateDraft,
    error: draftError,
  } = useApplicationDraft(job.id);

  const {
    existingApplication,
    hasApplied,
    isLoading: checkingExisting,
  } = useExistingApplication(job.id);

  // Initialize draft when drawer opens
  useEffect(() => {
    if (isOpen && !draft && !hasApplied) {
      createDraft(job.id);
    }
  }, [isOpen, draft, hasApplied, createDraft, job.id]);

  // Load screening questions from job
  useEffect(() => {
    if (job.screening_questions && job.screening_questions.length > 0) {
      const questions = job.screening_questions.map(q => ({
        question_id: q.id,
        question: q.question,
        answer: '',
        question_type: q.type,
        options: q.options,
        required: q.required,
      }));
      setScreeningAnswers(questions);
    }
  }, [job.screening_questions]);

  // Auto-save form data
  useEffect(() => {
    if (draft && Object.keys(formData).length > 0) {
      updateDraft(formData);
    }
  }, [formData, draft, updateDraft]);

  const handleFileUpload = async (file: File) => {
    if (!draft) return;
    
    setUploadedFile(file);
    uploadResume(file);
  };

  const handleScreeningAnswerChange = (questionId: string, answer: string) => {
    setScreeningAnswers(prev => 
      prev.map(q => 
        q.question_id === questionId 
          ? { ...q, answer }
          : q
      )
    );
  };

  const handleSaveAnswers = () => {
    if (!draft) return;
    saveAnswers(screeningAnswers);
  };

  const handleSubmit = async () => {
    if (!draft) return;
    
    try {
      const result = await submit();
      if (result && onSuccess) {
        onSuccess(result.id);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Resume
        return draft?.resume_file_id || uploadedFile;
      case 1: // Cover letter (optional)
        return true;
      case 2: // Screening questions
        return screeningAnswers.every(q => !q.required || q.answer.trim());
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const canProceed = isStepValid(currentStep);
  const canSubmit = isStepValid(0) && isStepValid(2) && !isSubmitting;

  // Show existing application if user has already applied
  if (hasApplied && existingApplication) {
    return (
      <Drawer isOpen={isOpen} onClose={onClose} size="lg">
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="text-warning" size={24} />
              <div>
                <h2 className="text-xl font-semibold">Already Applied</h2>
                <p className="text-muted-fg">
                  You have already applied to this position
                </p>
              </div>
            </div>
          </DrawerHeader>
          <DrawerBody>
            <Card>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Application Status</h3>
                    <Chip 
                      color={getStatusColor(existingApplication.status)}
                      variant="flat"
                    >
                      {existingApplication.status.replace('_', ' ')}
                    </Chip>
                  </div>
                  <div>
                    <h3 className="font-medium">Applied Date</h3>
                    <p className="text-muted-fg">
                      {new Date(existingApplication.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {existingApplication.submitted_at && (
                    <div>
                      <h3 className="font-medium">Submitted Date</h3>
                      <p className="text-muted-fg">
                        {new Date(existingApplication.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button 
              color="primary" 
              onPress={() => {
                onClose();
                // Navigate to application details
                window.location.href = `/applications/${existingApplication.id}`;
              }}
            >
              View Application
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Apply to {job.title}</h2>
              <p className="text-muted-fg">{job.company?.name}</p>
            </div>
            {isDraftSaving && (
              <div className="flex items-center gap-2 text-sm text-muted-fg">
                <Spinner size="sm" />
                Saving...
              </div>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <Progress 
              value={(currentStep + 1) / steps.length * 100} 
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-fg">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{steps[currentStep].title}</span>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* Step content */}
          {currentStep === 0 && (
            <ResumeStep
              draft={draft}
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
          )}

          {currentStep === 1 && (
            <CoverLetterStep
              coverLetter={formData.cover_letter || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, cover_letter: value }))}
            />
          )}

          {currentStep === 2 && (
            <ScreeningStep
              questions={screeningAnswers}
              onChange={handleScreeningAnswerChange}
              onSave={handleSaveAnswers}
            />
          )}

          {currentStep === 3 && (
            <ReviewStep
              draft={draft}
              formData={formData}
              screeningAnswers={screeningAnswers}
              job={job}
            />
          )}

          {draftError && (
            <div className="flex items-center gap-2 text-danger text-sm">
              <AlertCircle size={16} />
              {draftError.message}
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          <div className="flex justify-between w-full">
            <Button 
              variant="flat" 
              onPress={prevStep}
              isDisabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  color="primary" 
                  onPress={nextStep}
                  isDisabled={!canProceed}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  color="primary" 
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!canSubmit}
                >
                  Submit Application
                </Button>
              )}
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Resume Step Component
function ResumeStep({ 
  draft, 
  uploadedFile, 
  onFileUpload, 
  isUploading 
}: {
  draft: ApplicationDraft | null;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Resume Upload</h3>
        <p className="text-muted-fg mb-4">
          Upload your resume or select from existing files
        </p>
      </div>

      {/* File upload */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <Upload size={48} className="mx-auto mb-4 text-muted-fg" />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
          disabled={isUploading}
        />
        <label 
          htmlFor="resume-upload" 
          className="cursor-pointer"
        >
          <Button 
            color="primary" 
            variant="flat"
            isLoading={isUploading}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </label>
        <p className="text-sm text-muted-fg mt-2">
          PDF, DOC, DOCX up to 10MB
        </p>
      </div>

      {/* Uploaded file info */}
      {uploadedFile && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-fg">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Chip color="success" size="sm">Uploaded</Chip>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Existing resume */}
      {draft?.resume_url && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Current Resume</p>
                  <p className="text-sm text-muted-fg">
                    {draft.resume_url.split('/').pop()}
                  </p>
                </div>
              </div>
              <Chip color="primary" size="sm">Selected</Chip>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Cover Letter Step Component
function CoverLetterStep({ 
  coverLetter, 
  onChange 
}: {
  coverLetter: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Cover Letter</h3>
        <p className="text-muted-fg mb-4">
          Write a personalized cover letter for this position (optional)
        </p>
      </div>

      <Textarea
        placeholder="Dear Hiring Manager..."
        value={coverLetter}
        onValueChange={onChange}
        minRows={8}
        maxRows={12}
        className="w-full"
      />
      
      <div className="text-sm text-muted-fg">
        {coverLetter.length} characters
      </div>
    </div>
  );
}

// Screening Questions Step Component
function ScreeningStep({ 
  questions, 
  onChange, 
  onSave 
}: {
  questions: ScreeningAnswer[];
  onChange: (questionId: string, answer: string) => void;
  onSave: () => void;
}) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <HelpCircle size={48} className="mx-auto mb-4 text-muted-fg" />
        <h3 className="text-lg font-medium mb-2">No Screening Questions</h3>
        <p className="text-muted-fg">
          This job doesn't have any additional screening questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Screening Questions</h3>
        <p className="text-muted-fg mb-4">
          Please answer the following questions to complete your application
        </p>
      </div>

      {questions.map((question, index) => (
        <Card key={question.question_id}>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="font-medium text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium">
                    {question.question}
                    {question.required && (
                      <span className="text-danger ml-1">*</span>
                    )}
                  </p>
                </div>
              </div>

              {question.question_type === 'text' && (
                <Textarea
                  placeholder="Your answer..."
                  value={question.answer}
                  onValueChange={(value) => onChange(question.question_id, value)}
                  minRows={3}
                />
              )}

              {question.question_type === 'multiple_choice' && (
                <Select
                  placeholder="Select an option"
                  selectedKeys={question.answer ? [question.answer] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    onChange(question.question_id, value);
                  }}
                >
                  {question.options?.map((option) => (
                    <SelectItem key={option}>
                      {option}
                    </SelectItem>
                  )) || []}
                </Select>
              )}

              {question.question_type === 'yes_no' && (
                <div className="flex gap-4">
                  <Button
                    variant={question.answer === 'Yes' ? 'solid' : 'flat'}
                    color={question.answer === 'Yes' ? 'success' : 'default'}
                    size="sm"
                    onPress={() => onChange(question.question_id, 'Yes')}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={question.answer === 'No' ? 'solid' : 'flat'}
                    color={question.answer === 'No' ? 'danger' : 'default'}
                    size="sm"
                    onPress={() => onChange(question.question_id, 'No')}
                  >
                    No
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}

      <Button 
        color="primary" 
        variant="flat" 
        onPress={onSave}
        className="w-full"
      >
        Save Answers
      </Button>
    </div>
  );
}

// Review Step Component
function ReviewStep({ 
  draft, 
  formData, 
  screeningAnswers, 
  job 
}: {
  draft: ApplicationDraft | null;
  formData: Partial<ApplicationDraft>;
  screeningAnswers: ScreeningAnswer[];
  job: Job;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Review Your Application</h3>
        <p className="text-muted-fg">
          Please review all information before submitting
        </p>
      </div>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Job Details</h4>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            <p><strong>Position:</strong> {job.title}</p>
            <p><strong>Company:</strong> {job.company?.name}</p>
            <p><strong>Location:</strong> {job.location}</p>
          </div>
        </CardBody>
      </Card>

      {/* Resume */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Resume</h4>
        </CardHeader>
        <CardBody>
          {draft?.resume_url ? (
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span>Resume uploaded</span>
              <Chip color="success" size="sm">✓</Chip>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle size={16} />
              <span>Resume required</span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Cover Letter */}
      {formData.cover_letter && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Cover Letter</h4>
          </CardHeader>
          <CardBody>
            <div className="bg-muted/50 p-3 rounded text-sm">
              {formData.cover_letter}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Screening Questions */}
      {screeningAnswers.length > 0 && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Screening Questions</h4>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {screeningAnswers.map((q, index) => (
                <div key={q.question_id} className="border-b border-border pb-3 last:border-b-0">
                  <p className="font-medium text-sm mb-1">
                    {index + 1}. {q.question}
                  </p>
                  <p className="text-muted-fg text-sm">
                    {q.answer || <em>No answer provided</em>}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// Helper function for status colors
function getStatusColor(status: string) {
  switch (status) {
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      return 'primary';
    case 'SHORTLISTED':
    case 'INTERVIEW_SCHEDULED':
      return 'warning';
    case 'OFFER_MADE':
    case 'ACCEPTED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    case 'WITHDRAWN':
      return 'default';
    default:
      return 'default';
  }
}
