import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/applications/[id] - Get a specific application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true
          }
        },
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this application
    if (user.role !== 'ADMIN' && application.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view this application' },
        { status: 403 }
      )
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

// PUT /api/applications/[id] - Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, notes, feedback } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            company: true
          }
        },
        user: true
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update this application
    if (user.role !== 'ADMIN' && application.userId !== user.id) {
      // Only admins and the applicant can update applications
      return NextResponse.json(
        { error: 'Unauthorized to update this application' },
        { status: 403 }
      )
    }

    // Update application
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: params.id },
      data: {
        status,
        ...(notes && { notes }),
        ...(feedback && { feedback }),
        updatedAt: new Date()
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    // TODO: Create notification for the applicant when notification model is implemented

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Withdraw application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            company: true
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check if user owns this application
    if (application.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this application' },
        { status: 403 }
      )
    }

    // Update application status to withdrawn instead of deleting
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: params.id },
      data: {
        status: 'WITHDRAWN',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ message: 'Application withdrawn successfully' })
  } catch (error) {
    console.error('Error withdrawing application:', error)
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    )
  }
}


