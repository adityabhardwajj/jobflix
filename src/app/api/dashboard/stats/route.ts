import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

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
      select: {
        id: true,
        role: true,
        name: true,
        email: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role === 'USER') {
      // User stats
      const [
        totalApplications,
        pendingApplications,
        savedJobs,
        unreadNotifications,
        recentApplications
      ] = await Promise.all([
        prisma.jobApplication.count({
          where: { userId: user.id }
        }),
        prisma.jobApplication.count({
          where: { 
            userId: user.id,
            status: { in: ['PENDING', 'REVIEWING'] }
          }
        }),
        prisma.savedJob.count({
          where: { userId: user.id }
        }),
        // Mock notification count since we don't have notification model
        Promise.resolve(0),
        prisma.jobApplication.findMany({
          where: { userId: user.id },
          include: {
            job: {
              include: {
                company: {
                  select: {
                    name: true,
                    logo: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        })
      ])

      return NextResponse.json({
        userType: 'USER',
        stats: {
          totalApplications,
          pendingApplications,
          savedJobs,
          unreadNotifications
        },
        recentApplications
      })
    } else if (user.role === 'RECRUITER') {
      // Recruiter stats - simplified
      return NextResponse.json({
        userType: 'RECRUITER',
        stats: {
          totalJobs: 0,
          activeJobs: 0,
          totalApplications: 0,
          pendingApplications: 0,
          unreadNotifications: 0
        },
        recentApplications: []
      })
    } else if (user.role === 'ADMIN') {
      // Admin stats
      const [
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
        recentUsers,
        recentJobs
      ] = await Promise.all([
        prisma.user.count(),
        prisma.job.count(),
        prisma.company.count(),
        prisma.jobApplication.count(),
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        }),
        prisma.job.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            company: {
              select: {
                name: true,
                logo: true
              }
            }
          }
        })
      ])

      return NextResponse.json({
        userType: 'ADMIN',
        stats: {
          totalUsers,
          totalJobs,
          totalCompanies,
          totalApplications
        },
        recentUsers,
        recentJobs
      })
    }

    // Default fallback
    return NextResponse.json(
      { error: 'Invalid user role' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}