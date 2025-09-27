import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const response = await apiClient.getUserSkills()

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user skills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await apiClient.addUserSkill(body)

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    console.error('Error adding user skill:', error)
    return NextResponse.json(
      { error: 'Failed to add user skill' },
      { status: 500 }
    )
  }
}