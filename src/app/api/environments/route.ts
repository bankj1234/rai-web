import { NextRequest, NextResponse } from 'next/server'
import { environmentService } from '@/services/environment.service'

export async function GET() {
  try {
    // const { searchParams } = new URL(request.url)
    // const page = parseInt(searchParams.get('page') || '1')
    // const limit = parseInt(searchParams.get('limit') || '10')

    const response = await environmentService.getEnvironments()

    return NextResponse.json(response)
  } catch (error) {
    // console.error('Error fetching environments:', error)
    return NextResponse.json({ error: 'Failed to fetch environments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const environment = await environmentService.createEnvironment(body)
    return NextResponse.json(environment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to create environment',
        code: error.code || 'ENVIRONMENT_CREATE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}
