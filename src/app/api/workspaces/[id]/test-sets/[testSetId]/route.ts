import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; testSetId: string }> }
) {
  try {
    const { id: workspaceId, testSetId } = await params
    await workspaceService.deleteTestSet(workspaceId, testSetId)

    return NextResponse.json(
      { message: 'Test set deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to delete test set',
        code: error.code || 'TEST_SET_DELETE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}
