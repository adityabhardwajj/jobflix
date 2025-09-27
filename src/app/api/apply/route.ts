import { NextRequest, NextResponse } from 'next/server';
import { ApplyPayloadSchema } from '@/lib/schemas';

// In-memory storage for demo purposes
const applications: Array<{ id: string; jobId: string; profileId: string; appliedAt: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ApplyPayloadSchema.parse(body);
    
    // Check if already applied
    const existingApplication = applications.find(
      app => app.jobId === validatedData.jobId && app.profileId === validatedData.profileId
    );
    
    if (existingApplication) {
      return NextResponse.json({
        success: false,
        error: 'Already applied to this job'
      }, { status: 400 });
    }
    
    // Create new application
    const application = {
      id: `app-${Date.now()}`,
      jobId: validatedData.jobId,
      profileId: validatedData.profileId,
      appliedAt: new Date().toISOString()
    };
    
    applications.push(application);
    
    // In a real app, you would:
    // 1. Save to database
    // 2. Send notification to recruiter
    // 3. Update job application count
    // 4. Send confirmation email
    
    return NextResponse.json({
      success: true,
      data: {
        applicationId: application.id,
        appliedAt: application.appliedAt
      }
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to apply to job' },
      { status: 500 }
    );
  }
}
