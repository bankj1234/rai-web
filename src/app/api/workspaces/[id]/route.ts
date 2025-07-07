import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const workspace = await workspaceService.getWorkspaceById(id)

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    return NextResponse.json(workspace)
  } catch (error) {
    console.error('Error fetching workspace:', error)
    return NextResponse.json({ error: 'Failed to fetch workspace' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const updatedWorkspace = await workspaceService.updateWorkspace(id, body)

    return NextResponse.json({
      success: true,
      data: updatedWorkspace,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to update workspace',
        code: error.code || 'WORKSPACE_UPDATE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await workspaceService.deleteWorkspace(id)

    return NextResponse.json({
      success: true,
      message: 'Workspace deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to delete workspace',
        code: error.code || 'WORKSPACE_DELETE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}
