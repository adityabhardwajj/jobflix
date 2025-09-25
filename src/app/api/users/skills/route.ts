import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/users/skills - Get user skills
export async function GET(request: NextRequest) {
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
      include: {
        profile: {
          select: {
            skills: true
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

    // Skills are stored as JSON array in the profile
    const skills = user.profile?.skills || []

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user skills' },
      { status: 500 }
    )
  }
}

// POST /api/users/skills - Update user skills
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { skills } = await request.json()

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: 'Skills must be an array' },
        { status: 400 }
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

    // Update skills in the profile
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        skills: skills
      },
      create: {
        userId: user.id,
        skills: skills
      }
    })

    return NextResponse.json({ 
      message: 'Skills updated successfully',
      skills 
    })
  } catch (error) {
    console.error('Error updating user skills:', error)
    return NextResponse.json(
      { error: 'Failed to update user skills' },
      { status: 500 }
    )
  }
}