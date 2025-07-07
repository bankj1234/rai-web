import { NextRequest, NextResponse } from 'next/server'
import { environmentService } from '@/services/environment.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const environment = await environmentService.getEnvironmentById(id)

    if (!environment) {
      return NextResponse.json({ error: 'Environment not found' }, { status: 404 })
    }

    return NextResponse.json(environment)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch environment' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const environment = await environmentService.updateEnvironment(id, body)

    return NextResponse.json(environment)
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to update environment',
        code: error.code || 'ENVIRONMENT_EDIT_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await environmentService.deleteEnvironment(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to delete environment',
        code: error.code || 'ENVIRONMENT_DELETE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}
