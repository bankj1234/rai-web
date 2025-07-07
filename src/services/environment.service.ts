import { formatDate } from '@/utils/datetime'
import { capitalizeFirstLetter } from '@/utils/formatting'
import { ApiError } from './apiError'

export interface Environment {
  id: string
  name: string
  authType: 'None' | 'Basic' | 'Bearer'
  headers: EnvironmentHeader[]
  lastUpdated: string
  createdAt: string
  username?: string | null
  password?: string | null
  oauthEndpoint?: string | null
  clientId?: string | null
  clientSecret?: string | null
}

export interface EnvironmentHeader {
  id: string
  key: string
  value: string
  description: string
}

export interface CreateEnvironmentRequest {
  name: string
  authType: 'None' | 'Basic' | 'Bearer'
  headers: Omit<EnvironmentHeader, 'id'>[]
  username?: string | null
  password?: string | null
  oauthEndpoint?: string | null
  clientId?: string | null
  clientSecret?: string | null
}

export interface UpdateEnvironmentRequest {
  name?: string
  authType?: 'None' | 'Basic' | 'Bearer'
  headers?: Omit<EnvironmentHeader, 'id'>[]
  username?: string | null
  password?: string | null
  oauthEndpoint?: string | null
  clientId?: string | null
  clientSecret?: string | null
}

export interface GetEnvironmentsResponse {
  data: Environment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Generate mock environment data
const generateMockEnvironments = (): Environment[] => {
  const environmentNames = [
    'Development',
    'Staging',
    'Production',
    'Testing',
    'UAT',
    'QA Environment',
    'Integration',
    'Demo Environment',
    'Sandbox',
    'Performance Testing',
    'Load Testing',
    'Security Testing',
    'Beta Environment',
    'Alpha Environment',
    'Preview Environment',
    'Hotfix Environment',
    'Backup Environment',
    'Training Environment',
    'Client Demo',
    'Research Environment',
  ]

  const authTypes: ('None' | 'Basic' | 'Bearer')[] = ['None', 'Basic', 'Bearer']

  const commonHeaders = [
    { key: 'Content-Type', value: 'application/json', description: 'JSON content type' },
    { key: 'Accept', value: 'application/json', description: 'Accept JSON responses' },
    { key: 'X-API-Version', value: 'v1', description: 'API version header' },
    { key: 'X-Client-Version', value: '2.1.0', description: 'Client version' },
    { key: 'Cache-Control', value: 'no-cache', description: 'Cache control header' },
    {
      key: 'User-Agent',
      value: 'RAI-Testing-Tool/1.0',
      description: 'User agent string',
    },
    { key: 'X-Request-ID', value: '${requestId}', description: 'Request tracking ID' },
    {
      key: 'X-Environment',
      value: '${environment}',
      description: 'Environment identifier',
    },
    {
      key: 'Authorization',
      value: 'Bearer ${token}',
      description: 'Authentication token',
    },
    { key: 'X-API-Key', value: '${apiKey}', description: 'API key for authentication' },
  ]

  const mockEnvironments: Environment[] = []

  for (let i = 1; i <= 20; i++) {
    const nameIndex = (i - 1) % environmentNames.length
    const environmentName = environmentNames[nameIndex]
    const authType = authTypes[Math.floor(Math.random() * authTypes.length)]

    // Generate random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - daysAgo)

    // Updated date should be after or same as created date
    const updatedDaysAgo = Math.floor(Math.random() * daysAgo)
    const updatedDate = new Date()
    updatedDate.setDate(updatedDate.getDate() - updatedDaysAgo)

    // Generate random headers (2-5 headers per environment)
    const numHeaders = Math.floor(Math.random() * 4) + 2
    const selectedHeaders = [...commonHeaders]
      .sort(() => 0.5 - Math.random())
      .slice(0, numHeaders)
      .map((header, index) => ({
        id: `${i}-${index + 1}`,
        ...header,
        value: header.value.replace('${environment}', environmentName.toLowerCase()),
      }))

    mockEnvironments.push({
      id: i.toString(),
      name: environmentName,
      authType,
      headers: selectedHeaders,
      lastUpdated: updatedDate.toISOString(),
      createdAt: createdDate.toISOString(),
    })
  }

  return mockEnvironments
}

export const MOCK_ENVIRONMENTS = generateMockEnvironments()

// External API service structure (for future implementation)
export class EnvironmentApiService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  private buildUrl(path: string): string {
    // Ensure baseUrl doesn't end with slash and path starts with slash
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl
    const apiPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${apiPath}`
  }

  async getEnvironments(): Promise<GetEnvironmentsResponse> {
    const searchParams = new URLSearchParams()

    const response = await fetch(this.buildUrl(`/api/environments?${searchParams}`), {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // Create a custom error object with both message and code
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`

      // Throw a proper ApiError instance that preserves the code property
      throw new ApiError(errorMessage, errorCode)
    }
    const data = await response.json()
    const environments: Environment[] = data.data.item.map((env: any) => ({
      ...env,
      lastUpdated: formatDate(env.updatedAt),
    }))

    return {
      data: environments,
      total: data.totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    }
  }

  async getEnvironmentById(id: string): Promise<Environment | null> {
    const response = await fetch(this.buildUrl(`/api/environments/detail/${id}`), {
      headers: this.getHeaders(),
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Create a custom error object with both message and code
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`

      // Throw a proper ApiError instance that preserves the code property
      throw new ApiError(errorMessage, errorCode)
    }

    const data = await response.json()
    const environment: any = data.data
    environment.authType = capitalizeFirstLetter(environment.type)
    environment.lastUpdated = environment.updatedAt
    return environment
  }

  async createEnvironment(data: CreateEnvironmentRequest): Promise<Environment> {
    const response = await fetch(this.buildUrl('/api/environments'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        ...data,
        environmentType: data.authType ? data.authType.toLowerCase() : undefined,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`
      throw new ApiError(errorMessage, errorCode)
    }

    return response.json()
  }

  async updateEnvironment(
    id: string,
    data: UpdateEnvironmentRequest
  ): Promise<Environment> {
    const response = await fetch(this.buildUrl(`/api/environments/${id}`), {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        ...data,
        environmentType: data.authType ? data.authType.toLowerCase() : undefined,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`
      throw new ApiError(errorMessage, errorCode)
    }

    return response.json()
  }

  async deleteEnvironment(id: string): Promise<void> {
    const response = await fetch(this.buildUrl(`/api/environments/${id}`), {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`
      throw new ApiError(errorMessage, errorCode)
    }
  }
}

// Mock implementation for development
export class MockEnvironmentApiService {
  private mockData: Environment[] = [...MOCK_ENVIRONMENTS]

  private formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)

    return `${day}/${month}/${year}`
  }

  private generateId = (): string => {
    return Math.random().toString(36).substr(2, 9)
  }

  async getEnvironments(): Promise<GetEnvironmentsResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const formattedEnvironments = this.mockData.map((env: Environment) => ({
      ...env,
      lastUpdated: this.formatDate(env.lastUpdated),
    }))

    return {
      data: formattedEnvironments,
      total: this.mockData.length,
      page: 1,
      limit: this.mockData.length,
      totalPages: 1,
    }
  }

  async getEnvironmentById(id: string): Promise<Environment | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const environment = this.mockData.find((env: Environment) => env.id === id)
    return environment || null
  }

  async createEnvironment(data: CreateEnvironmentRequest): Promise<Environment> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newEnvironment: Environment = {
      id: this.generateId(),
      name: data.name,
      authType: data.authType,
      headers: data.headers.map((header) => ({
        ...header,
        id: this.generateId(),
      })),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    this.mockData.unshift(newEnvironment)
    return newEnvironment
  }

  async updateEnvironment(
    id: string,
    data: UpdateEnvironmentRequest
  ): Promise<Environment> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = this.mockData.findIndex((env: Environment) => env.id === id)
    if (index === -1) {
      throw new Error('Environment not found')
    }

    const updatedEnvironment: Environment = {
      ...this.mockData[index],
      ...data,
      headers: data.headers
        ? data.headers.map((header) => ({
            ...header,
            id: this.generateId(),
          }))
        : this.mockData[index].headers,
      lastUpdated: new Date().toISOString(),
    }

    this.mockData[index] = updatedEnvironment
    return updatedEnvironment
  }

  async deleteEnvironment(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = this.mockData.findIndex((env: Environment) => env.id === id)
    if (index === -1) {
      throw new Error('Environment not found')
    }

    this.mockData.splice(index, 1)
  }
}

// Service instance for use throughout the application
// Switch between MockEnvironmentApiService and EnvironmentApiService as needed
export const environmentService = new MockEnvironmentApiService()

// For future API integration, use:
// export const environmentService = new EnvironmentApiService(
//   process.env.RAI_SERVICE_URL as string,
//   'your-api-key'
// )
