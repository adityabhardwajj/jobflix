import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/jobs - Get all jobs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    const workType = searchParams.get('workType') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const companyId = searchParams.get('companyId') || ''
    const minSalary = searchParams.get('minSalary') || ''
    const maxSalary = searchParams.get('maxSalary') || ''
    const tags = searchParams.get('tags')?.split(',') || []

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (workType) {
      where.workType = { has: workType }
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel
    }

    if (companyId) {
      where.companyId = companyId
    }

    if (minSalary || maxSalary) {
      where.salaryRange = {}
      if (minSalary) where.salaryRange.min = { gte: parseInt(minSalary) }
      if (maxSalary) where.salaryRange.max = { lte: parseInt(maxSalary) }
    }

    if (tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    // Get jobs with company information
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
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
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
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
      companyId,
      location,
      workType,
      experienceLevel,
      salaryRangeMin,
      salaryRangeMax,
      salaryRangeCurrency,
      isRemote,
      applicationDeadline,
      applicationUrl,
      tags
    } = body

    // Validate required fields
    if (!title || !description || !companyId || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user has permission to create jobs
    if (user.role !== 'ADMIN' && user.role !== 'RECRUITER') {
      return NextResponse.json(
        { error: 'Unauthorized to create jobs' },
        { status: 403 }
      )
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements: requirements || [],
        benefits: benefits || [],
        companyId,
        location,
        type: workType || 'FULL_TIME',
        level: experienceLevel || 'ENTRY',
        salary: salaryRangeMin && salaryRangeMax ? `${salaryRangeMin}-${salaryRangeMax} ${salaryRangeCurrency || 'USD'}` : null,
        remote: isRemote || false,
        expiresAt: applicationDeadline ? new Date(applicationDeadline) : null,
        slug: `${slug}-${Date.now()}`
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

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}
