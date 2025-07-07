import { useCallback, useEffect, useState } from 'react'
import {
  FailCaseData,
  GetTestSetsResponse,
  TestSetResult,
  WorkspaceDetail,
} from '@/services/workspace.service'

export function useWorkspaceDetail(workspaceId: string) {
  const [workspaceDetail, setWorkspaceDetail] = useState<WorkspaceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkspaceDetail = async () => {
      if (!workspaceId) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/workspaces/${workspaceId}/detail`)

        if (!response.ok) {
          throw new Error('Failed to fetch workspace detail')
        }

        const data = await response.json()
        setWorkspaceDetail(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaceDetail()
  }, [workspaceId])

  return { workspaceDetail, loading, error }
}

export function useWorkspaceTestSets(
  workspaceId: string,
  page: number = 1,
  limit: number = 5
) {
  const [testSets, setTestSets] = useState<TestSetResult[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [currentPage, setCurrentPage] = useState(page)

  useEffect(() => {
    setCurrentPage(page)
  }, [page])

  const fetchTestSets = useCallback(async () => {
    if (!workspaceId) return

    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      })

      // Add filters to query params if provided
      if (filters && Object.keys(filters).length > 0) {
        queryParams.append('filters', JSON.stringify(filters))
      }

      const response = await fetch(
        `/api/workspaces/${workspaceId}/test-sets-list?${queryParams}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch test sets')
      }

      const data: GetTestSetsResponse = await response.json()
      setTestSets(data.data)
      setTotalPages(data.totalPages)
      setTotalItems(data.total)
    } catch (err) {
      console.error('❌ API error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [workspaceId, currentPage, limit, filters])

  useEffect(() => {
    fetchTestSets()
  }, [fetchTestSets])

  const deleteTestSet = async (testSetId: string) => {
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/test-sets/${testSetId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete test set')
      }

      // Refresh test sets after deletion
      const refreshResponse = await fetch(
        `/api/workspaces/${workspaceId}/test-sets-list?page=${page}&limit=${limit}`
      )

      if (refreshResponse.ok) {
        const data: GetTestSetsResponse = await refreshResponse.json()
        setTestSets(data.data)
        setTotalPages(data.totalPages)
        setTotalItems(data.total)
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete test set')
      return false
    }
  }

  const handleFiltersChange = useCallback((newFilters: Record<string, string[]>) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  return {
    testSets,
    totalPages,
    totalItems,
    loading,
    error,
    currentPage,
    filters,
    deleteTestSet,
    handleFiltersChange,
    handlePageChange,
    refetch: fetchTestSets,
  }
}

export function useWorkspaceFailCase(
  workspaceId: string,
  startDate: string,
  endDate: string
) {
  const [failCaseData, setFailCaseData] = useState<FailCaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFailCase = async () => {
      if (!workspaceId) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `/api/workspaces/${workspaceId}/fail-case?startDate=${startDate}&endDate=${endDate}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch fail case')
        }

        const data = await response.json()
        setFailCaseData(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchFailCase()
  }, [workspaceId, startDate, endDate])

  return {
    failCaseData,
    loading,
    error,
    refetch: () => {
      // Trigger a re-fetch by updating a dependency
      setLoading(true)
    },
  }
}
