'use client'

import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/services/apiError'
import { WorkspaceData } from '@/services/workspace.service'

interface UseWorkspacesParams {
  page?: number
  limit?: number
  autoFetch?: boolean
}

interface UseWorkspacesResult {
  workspaces: WorkspaceData[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
  refetch: () => Promise<void>
  createWorkspace: (
    data: Omit<WorkspaceData, 'id' | 'lastUpdated'> & { environmentId?: string }
  ) => Promise<WorkspaceData>
  updateWorkspace: (id: string, data: Partial<WorkspaceData>) => Promise<WorkspaceData>
  deleteWorkspace: (id: string) => Promise<void>
}

export function useWorkspaces(params: UseWorkspacesParams = {}): UseWorkspacesResult {
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    total: number
    page: number
    limit: number
    totalPages: number
  } | null>(null)

  const { page = 1, limit = 10, autoFetch = true } = params

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(`/api/workspaces?${queryParams}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch workspaces')
      }

      if (result.success) {
        setWorkspaces(result.data)
        setPagination(result.pagination)
      } else {
        throw new Error(result.message || 'Failed to fetch workspaces')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setWorkspaces([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    if (autoFetch) {
      fetchWorkspaces()
    }
  }, [fetchWorkspaces, autoFetch])

  const createWorkspace = useCallback(
    async (
      data: Omit<WorkspaceData, 'id' | 'lastUpdated'> & { environmentId?: string }
    ) => {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.message || errorData.error || 'Failed to create environment'
        const errorCode = errorData.code || `ERROR_${response.status}`
        throw new ApiError(errorMessage, errorCode)
      }
      const newWorkspace = await response.json()
      await fetchWorkspaces() // Refresh the list
      return newWorkspace
    },
    [fetchWorkspaces]
  )

  const updateWorkspace = useCallback(
    async (id: string, data: Partial<WorkspaceData>) => {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.message || errorData.error || 'Failed to update workspace'
        const errorCode = errorData.code || `ERROR_${response.status}`
        throw new ApiError(errorMessage, errorCode)
      }

      const result = await response.json()

      if (result.success) {
        await fetchWorkspaces() // Refresh the list
        return result.data
      } else {
        const errorMessage = result.message || 'Failed to update workspace'
        throw new ApiError(errorMessage, 'UPDATE_WORKSPACE_FAILED')
      }
    },
    [fetchWorkspaces]
  )

  const deleteWorkspace = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.message || errorData.error || 'Failed to delete workspace'
        const errorCode = errorData.code || `ERROR_${response.status}`
        throw new ApiError(errorMessage, errorCode)
      }

      await fetchWorkspaces() // Refresh the list
    },
    [fetchWorkspaces]
  )

  return {
    workspaces,
    loading,
    error,
    pagination,
    refetch: fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  }
}
