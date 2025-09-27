import { NextRequest, NextResponse } from 'next/server';
import { sampleJobs } from '@/lib/sampleData';
import { calculateCompatibility } from '@/lib/match';
import { Job } from '@/lib/schemas';

// In-memory storage for demo purposes
let jobs = [...sampleJobs];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    
    // In a real app, you'd fetch from database and calculate compatibility
    // For demo, we'll use sample data with mock compatibility scores
    const jobsWithCompatibility = jobs.map(job => ({
      ...job,
      compatibility: Math.floor(Math.random() * 40) + 60 // Mock compatibility 60-100
    }));

    return NextResponse.json({
      success: true,
      data: jobsWithCompatibility,
      total: jobsWithCompatibility.length
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: body.title,
      company: body.company,
      logoUrl: body.logoUrl,
      salaryRange: body.salaryRange,
      location: body.location,
      tags: body.tags,
      description: body.description,
      videoUrl: body.videoUrl,
      createdAt: new Date().toISOString(),
      compatibility: 0 // Will be calculated
    };

    jobs.push(newJob);

    return NextResponse.json({
      success: true,
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}