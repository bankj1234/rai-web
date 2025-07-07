import { NextRequest, NextResponse } from 'next/server'
import { workspaceService } from '@/services/workspace.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const filtersParam = searchParams.get('filters')

    // Parse filters if provided
    let filters: Record<string, string[]> | undefined
    if (filtersParam) {
      try {
        filters = JSON.parse(filtersParam)
      } catch (error) {
        console.error('Failed to parse filters:', error)
        return NextResponse.json({ error: 'Invalid filters format' }, { status: 400 })
      }
    }

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 })
    }

    const testSets = await workspaceService.getWorkspaceTestSets(workspaceId, {
      page,
      limit,
      filters,
    })

    return NextResponse.json(testSets, { status: 200 })
  } catch (error) {
    console.error('❌ API Error fetching workspace test sets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspace test sets' },
      { status: 500 }
    )
  }
}
