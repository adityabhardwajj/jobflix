import { NextRequest, NextResponse } from 'next/server';
import { SavePayloadSchema } from '@/lib/schemas';

// In-memory storage for demo purposes
const savedJobs: Array<{ id: string; jobId: string; profileId: string; savedAt: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SavePayloadSchema.parse(body);
    
    // Check if already saved
    const existingSave = savedJobs.find(
      save => save.jobId === validatedData.jobId && save.profileId === validatedData.profileId
    );
    
    if (existingSave) {
      return NextResponse.json({
        success: false,
        error: 'Job already saved'
      }, { status: 400 });
    }
    
    // Save the job
    const savedJob = {
      id: `save-${Date.now()}`,
      jobId: validatedData.jobId,
      profileId: validatedData.profileId,
      savedAt: new Date().toISOString()
    };
    
    savedJobs.push(savedJob);
    
    // In a real app, you would:
    // 1. Save to database
    // 2. Update user's saved jobs list
    // 3. Send notification if enabled
    
    return NextResponse.json({
      success: true,
      data: {
        saved: true,
        savedAt: savedJob.savedAt
      }
    });
  } catch (error) {
    console.error('Error saving job:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to save job' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    
    if (!profileId) {
      return NextResponse.json(
        { success: false, error: 'Profile ID is required' },
        { status: 400 }
      );
    }
    
    // Get saved jobs for this profile
    const userSavedJobs = savedJobs.filter(save => save.profileId === profileId);
    
    return NextResponse.json({
      success: true,
      data: userSavedJobs
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch saved jobs' },
      { status: 500 }
    );
  }
}
