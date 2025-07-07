import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    const result = await workspaceService.checkFileUploadTestSet(files)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating test set:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
