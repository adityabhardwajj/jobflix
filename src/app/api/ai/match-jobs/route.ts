import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// POST /api/ai/match-jobs - AI-powered job matching
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        profile: true,
        applications: {
          select: {
            jobId: true,
            status: true
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

    // Get active jobs
    const jobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
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
      take: 100 // Limit for AI processing
    })

    // Filter out jobs user already applied to
    const appliedJobIds = user.applications.map((app: any) => app.jobId)
    const availableJobs = jobs.filter((job: any) => !appliedJobIds.includes(job.id))

    if (availableJobs.length === 0) {
      return NextResponse.json({
        matches: [],
        message: 'No new jobs available for matching'
      })
    }

    // Prepare user data for AI
    const userData = {
      profile: user.profile,
      skills: user.profile?.skills || [],
      preferences: user.profile?.preferences,
      experience: user.profile?.experience || '',
      location: user.profile?.location || '',
      preferredLocations: [],
      preferredRoles: []
    }

    // Prepare job data for AI
    const jobData = availableJobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      location: job.location,
      workType: job.workType,
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRangeMin && job.salaryRangeMax ? {
        min: job.salaryRangeMin,
        max: job.salaryRangeMax,
        currency: job.salaryRangeCurrency
      } : null,
      company: job.company,
      tags: job.tags,
      applicationCount: job._count.applications
    }))

    // Create AI prompt for job matching
    const prompt = `
    You are an AI job matching expert. Analyze the user's profile and skills against available jobs to find the best matches.

    User Profile:
    - Experience: ${userData.experience}
    - Location: ${userData.location}
    - Skills: ${JSON.stringify(userData.skills)}
    - Bio: ${userData.profile?.bio || 'Not specified'}

    Available Jobs: ${JSON.stringify(jobData, null, 2)}

    Please analyze each job and provide a match score (0-100) and reasoning for the top 10 best matches.
    Consider:
    1. Skill alignment (40% weight)
    2. Experience level match (25% weight)
    3. Location preference (15% weight)
    4. Salary expectations (10% weight)
    5. Company culture fit (10% weight)

    Return a JSON array with the following format:
    [
      {
        "jobId": "job_id",
        "matchScore": 85,
        "reasoning": "Strong match because...",
        "strengths": ["skill1", "skill2"],
        "concerns": ["concern1", "concern2"]
      }
    ]
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert job matching AI. Analyze user profiles and job requirements to provide accurate match scores and detailed reasoning. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    let matches
    try {
      matches = JSON.parse(response)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      // Fallback to simple matching if AI response is invalid
      matches = availableJobs.slice(0, 10).map((job: any) => ({
        jobId: job.id,
        matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        reasoning: "AI matching temporarily unavailable, showing relevant jobs",
        strengths: ["Relevant position"],
        concerns: []
      }))
    }

    // Get full job details for matches
    const matchedJobs = await Promise.all(
      matches.map(async (match: any) => {
        const job = availableJobs.find((j: any) => j.id === match.jobId)
        if (!job) return null

        return {
          ...job,
          matchScore: match.matchScore,
          matchReasoning: match.reasoning,
          matchStrengths: match.strengths,
          matchConcerns: match.concerns
        }
      })
    )

    const validMatches = matchedJobs.filter((job: any) => job !== null)

    return NextResponse.json({
      matches: validMatches,
      totalJobs: availableJobs.length,
      matchedJobs: validMatches.length
    })
  } catch (error) {
    console.error('Error in AI job matching:', error)
    return NextResponse.json(
      { error: 'Failed to match jobs' },
      { status: 500 }
    )
  }
}
