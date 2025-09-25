import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/search - Advanced search across jobs, companies, and users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, jobs, companies, users
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const results: any = {
      jobs: [],
      companies: [],
      users: [],
      total: 0
    }

    // Search jobs
    if (type === 'all' || type === 'jobs') {
      const jobs = await prisma.job.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ],
          AND: [
            {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { requirements: { hasSome: [query] } },
                { company: { name: { contains: query, mode: 'insensitive' } } }
              ]
            }
          ]
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
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        take: type === 'jobs' ? limit : 5
      })

      results.jobs = jobs
    }

    // Search companies
    if (type === 'all' || type === 'companies') {
      const companies = await prisma.company.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { industry: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          _count: {
            select: {
              jobs: {
                where: {
                  status: 'ACTIVE',
                  OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                  ]
                }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        take: type === 'companies' ? limit : 5
      })

      results.companies = companies
    }

    // Search users (only if user is authenticated and has permission)
    if (type === 'all' || type === 'users') {
      const session = await getServerSession(authOptions)
      
      if (session?.user) {
        const users = await prisma.user.findMany({
        where: {
          OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { profile: { bio: { contains: query, mode: 'insensitive' } } },
              { profile: { location: { contains: query, mode: 'insensitive' } } }
            ]
          },
          include: {
            profile: {
              select: {
                bio: true,
                location: true,
                website: true,
                linkedin: true,
                experience: true
              }
            }
          },
          orderBy: { name: 'asc' },
          take: type === 'users' ? limit : 5
        })

        results.users = users
      }
    }

    // Calculate total results
    results.total = results.jobs.length + results.companies.length + results.users.length

    return NextResponse.json({
      query,
      type,
      results,
      pagination: {
        page,
        limit,
        total: results.total
      }
    })
  } catch (error) {
    console.error('Error in search:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}


