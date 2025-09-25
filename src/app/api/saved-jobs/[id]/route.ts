import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/saved-jobs/[id] - Get a saved job
export async function GET(
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
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: { id: params.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                location: true
              }
            }
          }
        }
      }
    })

    if (!savedJob) {
      return NextResponse.json(
        { error: 'Saved job not found' },
        { status: 404 }
      )
    }

    // Check if user owns this saved job
    if (savedJob.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view this saved job' },
        { status: 403 }
      )
    }

    return NextResponse.json(savedJob)
  } catch (error) {
    console.error('Error fetching saved job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved job' },
      { status: 500 }
    )
  }
}

// DELETE /api/saved-jobs/[id] - Remove a saved job
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
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: { id: params.id }
    })

    if (!savedJob) {
      return NextResponse.json(
        { error: 'Saved job not found' },
        { status: 404 }
      )
    }

    // Check if user owns this saved job
    if (savedJob.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this saved job' },
        { status: 403 }
      )
    }

    await prisma.savedJob.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Saved job removed successfully' })
  } catch (error) {
    console.error('Error deleting saved job:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved job' },
      { status: 500 }
    )
  }
}