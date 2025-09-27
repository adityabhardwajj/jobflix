import { NextRequest, NextResponse } from 'next/server';
import { UserProfileSchema } from '@/lib/schemas';
import { defaultProfile } from '@/lib/sampleData';

// In-memory storage for demo purposes
let userProfile = defaultProfile;

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = UserProfileSchema.parse(body);
    
    // Calculate completion percentage
    const completion = calculateProfileCompletion(validatedData);
    const updatedProfile = { ...validatedData, completion };
    
    userProfile = updatedProfile;
    
    // In a real app, you would:
    // 1. Save to database
    // 2. Update user preferences
    // 3. Recalculate job matches
    // 4. Send profile update notification
    
    return NextResponse.json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid profile data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

function calculateProfileCompletion(profile: any): number {
  let completion = 0;
  const fields = [
    'name',
    'title', 
    'skills',
    'years',
    'location',
    'desiredSalary',
    'availability'
  ];
  
  fields.forEach(field => {
    if (field === 'skills') {
      if (profile[field] && profile[field].length > 0) {
        completion += 100 / fields.length;
      }
    } else if (profile[field] && profile[field] !== '') {
      completion += 100 / fields.length;
    }
  });
  
  return Math.round(completion);
}
