import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
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
      include: {
        profile: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/users/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      phone,
      profile,
      skills,
      preferences
    } = body

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        ...(name && { name }),
        ...(phone && { phone })
      }
    })

    // Update or create profile
    if (profile) {
      await prisma.userProfile.upsert({
        where: { userId: updatedUser.id },
        update: {
          ...profile,
          updatedAt: new Date()
        },
        create: {
          userId: updatedUser.id,
          ...profile
        }
      })
    }

    // Skills and preferences are stored in the profile JSON fields

    // Fetch updated user with all relations
    const userWithProfile = await prisma.user.findUnique({
      where: { id: updatedUser.id },
      include: {
        profile: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true
          }
        }
      }
    })

    return NextResponse.json(userWithProfile)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}


