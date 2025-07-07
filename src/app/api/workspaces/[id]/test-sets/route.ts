import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params

    // Parse form data
    const formData = await request.formData()
    const testSetName = formData.get('testSetName') as string
    const description = formData.get('description') as string
    const files = formData.getAll('files') as File[]

    // Call workspace service to create test set
    const result = await workspaceService.createTestSet({
      workspaceId,
      testSetName,
      description,
      files,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || 'Failed to create test set',
        code: error.code || 'TEST_SET_CREATE_ERROR',
      },
      { status: error.statusCode || 500 }
    )
  }
}
