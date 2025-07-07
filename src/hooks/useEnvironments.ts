import { useCallback, useEffect, useState } from 'react'
import {
  CreateEnvironmentRequest,
  Environment,
  GetEnvironmentsResponse,
  UpdateEnvironmentRequest,
} from '@/services/environment.service'

// Define a custom API Error class at the top of the file
class ApiError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

interface UseEnvironmentsParams {
  page: number
  limit: number
}

interface UseEnvironmentsReturn {
  environments: Environment[]
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
  refetch: () => Promise<void>
  createEnvironment: (data: CreateEnvironmentRequest) => Promise<Environment>
  updateEnvironment: (id: string, data: UpdateEnvironmentRequest) => Promise<Environment>
  deleteEnvironment: (id: string) => Promise<void>
  getEnvironmentById: (id: string) => Promise<Environment | null>
}

export function useEnvironments(params: UseEnvironmentsParams): UseEnvironmentsReturn {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    total: number
    page: number
    limit: number
    totalPages: number
  } | null>(null)

  const fetchEnvironments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
      })

      const response = await fetch(`/api/environments?${queryParams}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Create error with message
        const errorMessage =
          errorData.message || errorData.error || 'Failed to fetch environments'
        const errorCode = errorData.error || `ERROR_${response.status}`

        throw new ApiError(errorMessage, errorCode)
      }

      const data: GetEnvironmentsResponse = await response.json()

      setEnvironments(data.data)
      setPagination({
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      })
    } catch (err: any) {
      console.error('Error fetching environments:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [params.page, params.limit])

  const createEnvironment = useCallback(
    async (data: CreateEnvironmentRequest): Promise<Environment> => {
      const response = await fetch('/api/environments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Create error with message
        const errorMessage =
          errorData.message || errorData.error || 'Failed to create environment'
        const errorCode = errorData.code || `ERROR_${response.status}`

        throw new ApiError(errorMessage, errorCode)
      }

      const newEnvironment = await response.json()
      await fetchEnvironments() // Refresh the list
      return newEnvironment
    },
    [fetchEnvironments]
  )

  const updateEnvironment = useCallback(
    async (id: string, data: UpdateEnvironmentRequest): Promise<Environment> => {
      const response = await fetch(`/api/environments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Create error with message
        const errorMessage =
          errorData.message || errorData.error || 'Failed to update environment'
        const errorCode = errorData.code || `ERROR_${response.status}`

        throw new ApiError(errorMessage, errorCode)
      }

      const updatedEnvironment = await response.json()
      await fetchEnvironments() // Refresh the list
      return updatedEnvironment
    },
    [fetchEnvironments]
  )

  const deleteEnvironment = useCallback(
    async (id: string): Promise<void> => {
      const response = await fetch(`/api/environments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Create error with message
        const errorMessage =
          errorData.message || errorData.error || 'Failed to delete environment'
        const errorCode = errorData.code || `ERROR_${response.status}`

        throw new ApiError(errorMessage, errorCode)
      }

      await fetchEnvironments() // Refresh the list
    },
    [fetchEnvironments]
  )

  const getEnvironmentById = useCallback(
    async (id: string): Promise<Environment | null> => {
      const response = await fetch(`/api/environments/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        const errorData = await response.json().catch(() => ({}))

        // Create error with message
        const errorMessage =
          errorData.message || errorData.error || 'Failed to fetch environment'
        const errorCode = errorData.error || `ERROR_${response.status}`

        throw new ApiError(errorMessage, errorCode)
      }

      return await response.json()
    },
    []
  )

  useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  return {
    environments,
    loading,
    error,
    pagination,
    refetch: fetchEnvironments,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    getEnvironmentById,
  }
}
