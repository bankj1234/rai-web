import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    }

    const result = await workspaceService.fetchWorkspaces(params)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    })
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch workspaces',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Name is required',
        },
        { status: 400 }
      )
    }

    const newWorkspace = await workspaceService.createWorkspace(body)

    return NextResponse.json(
      {
        success: true,
        data: newWorkspace,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to create workspace',
        code: error.code || 'WORKSPACE_CREATE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}
