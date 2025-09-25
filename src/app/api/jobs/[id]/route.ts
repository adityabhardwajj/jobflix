import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/jobs/[id] - Get a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            size: true,
            industry: true,
            website: true,
            description: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if job is expired
    if (job.expiresAt && job.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Job has expired' },
        { status: 410 }
      )
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      workType,
      experienceLevel,
      salaryRangeMin,
      salaryRangeMax,
      salaryRangeCurrency,
      isRemote,
      applicationDeadline,
      applicationUrl,
      tags,
      status
    } = body

    // Get the job first
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update this job
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized to update this job' },
        { status: 403 }
      )
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(requirements && { requirements }),
        ...(responsibilities && { responsibilities }),
        ...(benefits && { benefits }),
        ...(location && { location }),
        ...(workType && { workType }),
        ...(experienceLevel && { experienceLevel }),
        ...(salaryRangeMin !== undefined && { salaryRangeMin }),
        ...(salaryRangeMax !== undefined && { salaryRangeMax }),
        ...(salaryRangeCurrency && { salaryRangeCurrency }),
        ...(isRemote !== undefined && { isRemote }),
        ...(applicationDeadline && { applicationDeadline: new Date(applicationDeadline) }),
        ...(applicationUrl && { applicationUrl }),
        ...(tags && { tags }),
        ...(status && { status })
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            size: true,
            industry: true
          }
        }
      }
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the job first
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      include: { company: true }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete this job
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this job' },
        { status: 403 }
      )
    }

    // Delete job
    await prisma.job.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
