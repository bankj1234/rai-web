import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 })
    }

    const workspaceDetail = await workspaceService.getWorkspaceDetail(workspaceId)

    return NextResponse.json(workspaceDetail, { status: 200 })
  } catch (error) {
    console.error('Error fetching workspace detail:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspace detail' },
      { status: 500 }
    )
  }
}
