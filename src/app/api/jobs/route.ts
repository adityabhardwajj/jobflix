import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api'

// GET /api/jobs - Get all jobs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract parameters
    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      search: searchParams.get('search') || undefined,
      location: searchParams.get('location') || undefined,
      work_type: searchParams.get('workType') ? [searchParams.get('workType')!] : undefined,
      experience_level: searchParams.get('experienceLevel') || undefined,
      company_id: searchParams.get('companyId') || undefined,
      salary_min: searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : undefined,
      salary_max: searchParams.get('maxSalary') ? parseInt(searchParams.get('maxSalary')!) : undefined,
      is_remote: searchParams.get('isRemote') === 'true' ? true : undefined,
      is_featured: searchParams.get('isFeatured') === 'true' ? true : undefined,
    }

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    )

    // Use FastAPI backend
    const response = await apiClient.getJobs(cleanParams)

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job (employers only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use FastAPI backend
    const response = await apiClient.createJob(body)

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}