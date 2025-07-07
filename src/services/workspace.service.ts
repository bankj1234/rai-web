import { formatDate } from '@/utils/datetime'
import { ApiError } from './apiError'

// Test Set interfaces
export interface TestSetFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
}

export interface TestSet {
  id: string
  workspaceId: string
  name: string
  description: string
  files: TestSetFile[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive'
}

export interface CreateTestSetRequest {
  workspaceId: string
  testSetName: string
  description: string
  files: File[]
}

export interface CreateTestSetResponse {
  message: string
  testSet: TestSet
}

// Test Set Result interfaces
export interface TestSetResult {
  id: string
  name: string
  description: string
  status: 'Completed' | 'Failed' | 'Running'
  passedCases: string
  totalCases: string
  runTime: string
  workspaceId: string
}

export interface WorkspaceStats {
  totalTestSets: number
  totalTestCases: number
  passedSetsPercentage: number
  failedSetsPercentage: number
  passedCasesPercentage: number
  failedCasesPercentage: number
}

export interface FailCaseData {
  category: string
  value: number
  group: 'High Risk' | 'Medium Risk' | 'Low Risk'
}

export interface WorkspaceDetail {
  id: string
  name: string
  lastUpdated: string
  environmentId?: string
  stats: WorkspaceStats
  failCaseData: FailCaseData[]
  buttonDisabled: boolean
}

export interface GetWorkspaceDetailResponse {
  data: WorkspaceDetail
}

export interface FailCaseResponse {
  data: FailCaseData[]
}

export interface GetTestSetsResponse {
  data: TestSetResult[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Mock data for workspaces
export interface WorkspaceData {
  id: string
  name: string
  lastUpdated: string
  environmentId?: string
}

// Generate mock workspace data
const generateMockWorkspaces = (): WorkspaceData[] => {
  const workspaceNames = [
    'Login API Testing',
    'Payment Gateway Security',
    'User Authentication Flow',
    'Data Validation Suite',
    'File Upload Security',
    'SQL Injection Tests',
    'Cross-Site Scripting',
    'API Rate Limiting',
    'Email Verification',
    'Password Reset Flow',
    'Session Management',
    'CSRF Protection',
    'Multi-Factor Auth',
    'OAuth Integration',
    'JWT Token Validation',
    'Database Security',
    'Input Sanitization',
    'HTTPS Enforcement',
    'Cookie Security',
    'Content Security Policy',
    'Error Handling Tests',
    'Performance Testing',
    'Load Balancer Config',
    'Cache Validation',
    'API Documentation',
    'Backup Procedures',
    'Disaster Recovery',
    'Monitoring Setup',
    'Logging Configuration',
    'Security Audit',
    'Code Quality Check',
    'Unit Test Coverage',
    'Integration Testing',
    'E2E Test Suite',
    'Mobile Responsiveness',
    'Browser Compatibility',
    'Accessibility Testing',
    'SEO Optimization',
    'CDN Configuration',
    'SSL Certificate',
    'DNS Configuration',
    'Server Hardening',
    'Firewall Rules',
    'VPN Setup',
    'Network Security',
    'Incident Response',
    'Compliance Check',
    'Privacy Policy',
    'Terms of Service',
    'GDPR Compliance',
  ]

  const mockWorkspaces: WorkspaceData[] = []

  for (let i = 1; i <= 100; i++) {
    const nameIndex = (i - 1) % workspaceNames.length
    const workspaceName =
      workspaceNames[nameIndex] +
      (i > workspaceNames.length ? ` ${Math.ceil(i / workspaceNames.length)}` : '')

    // Generate random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const lastUpdated = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`

    mockWorkspaces.push({
      id: i.toString().padStart(3, '0'),
      name: workspaceName,
      lastUpdated,
    })
  }

  return mockWorkspaces
}

export const MOCK_WORKSPACES = generateMockWorkspaces()

// Generate mock test set results
const generateMockTestSetResults = (workspaceId: string): TestSetResult[] => {
  const testSetNames = [
    'Red Team Attack Simulation',
    'Data Poisoning Defense Test',
    'PII Leakage Detection Test',
    'Prompt Injection Robustness',
    'Sensitive Data Exposure Scan',
    'Authentication Bypass Test',
    'Data Integrity Validation',
    'SQL Injection Prevention',
    'XSS Protection Validation',
    'CSRF Token Verification',
    'Session Security Test',
    'API Rate Limiting Test',
  ]

  const descriptions = [
    'Security and Safety',
    'Data and Privacy',
    'Reliability',
    'Fairness and Bias',
    'Sustainability',
  ]

  const statuses: ('Completed' | 'Failed' | 'Running')[] = [
    'Completed',
    'Failed',
    'Running',
  ]

  const mockTestSets: TestSetResult[] = []

  for (let i = 1; i <= 12; i++) {
    const nameIndex = (i - 1) % testSetNames.length
    const testSetName = testSetNames[nameIndex]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // Generate random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const runDate = new Date()
    runDate.setDate(runDate.getDate() - daysAgo)

    // Generate total cases based on status
    let totalCases = ''
    if (status === 'Running') {
      totalCases = '-'
    } else {
      const total = Math.floor(Math.random() * 100) + 1
      const completed = status === 'Completed' ? total : Math.floor(Math.random() * total)
      totalCases = `${completed}/${total}`
    }

    mockTestSets.push({
      id: `TC-${i.toString().padStart(4, '0')}`,
      name: testSetName + '...',
      description,
      status,
      passedCases: totalCases,
      totalCases,
      runTime: `${runDate.getDate().toString().padStart(2, '0')}/${(runDate.getMonth() + 1).toString().padStart(2, '0')}/${runDate.getFullYear().toString().slice(-2)}, ${runDate.getHours().toString().padStart(2, '0')}:${runDate.getMinutes().toString().padStart(2, '0')}`,
      workspaceId,
    })
  }

  return mockTestSets
}

// Generate mock workspace detail
const generateMockWorkspaceDetail = (workspaceId: string): WorkspaceDetail => {
  const workspaceNames = [
    'Login API Testing',
    'Payment Gateway Security',
    'User Authentication Flow',
    'Data Validation Suite',
    'File Upload Security',
  ]

  const workspaceName = workspaceNames[Math.floor(Math.random() * workspaceNames.length)]

  const stats: WorkspaceStats = {
    totalTestSets: 12, // Total from test sets API
    totalTestCases: 31,
    passedSetsPercentage: 99,
    failedSetsPercentage: 1,
    passedCasesPercentage: 90,
    failedCasesPercentage: 10,
  }

  const failCaseData: FailCaseData[] = [
    { category: 'Data & Privacy', value: 80, group: 'High Risk' },
    { category: 'Security & Safety', value: 35, group: 'High Risk' },
    { category: 'Reliability', value: 54, group: 'Medium Risk' },
    { category: 'Bias & Fairness', value: 20, group: 'Medium Risk' },
    { category: 'Sustainability', value: 10, group: 'Low Risk' },
  ]

  return {
    id: workspaceId,
    name: workspaceName,
    lastUpdated: new Date().toISOString(),
    stats,
    failCaseData,
    buttonDisabled: false,
  }
}

// External API service structure (for future implementation)
export class WorkspaceApiService {
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

  private async safeFetchJson(url: string, headers: HeadersInit) {
    try {
      const res = await fetch(url, { headers })

      const data = await res.json().catch(() => ({})) // Parse even if body is broken

      if (!res.ok) {
        throw new ApiError(
          data.message || `API Error: ${res.status} ${res.statusText}`,
          data.code || `ERROR_${res.status}`
        )
      }

      return data
    } catch (err: any) {
      if (err instanceof ApiError) throw err
      throw new ApiError(`Fetch failed: ${err.message || err}`, 'FETCH_FAILED')
    }
  }

  async fetchWorkspaces(params?: { page?: number; limit?: number }): Promise<{
    data: WorkspaceData[]
    total: number
    page: number
    limit: number
  }> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('size', params.limit.toString())

    const url = this.buildUrl(`/api/workspaces?${searchParams}`)
    const response = await fetch(url, {
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
    const workspaces: WorkspaceData[] = data.data.items.map((workspace: any) => ({
      ...workspace,
      lastUpdated: formatDate(workspace.updatedAt),
    }))

    return {
      data: workspaces,
      total: data.totalPages,
      page: data.page,
      limit: data.size,
    }
  }

  async getWorkspaceById(id: string): Promise<WorkspaceData | null> {
    const response = await fetch(this.buildUrl(`/api/workspaces/${id}`), {
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

    return response.json()
  }

  async createWorkspace(
    data: Omit<WorkspaceData, 'id' | 'lastUpdated'> & { environmentId?: string }
  ): Promise<WorkspaceData> {
    const response = await fetch(this.buildUrl('/api/workspaces'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
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

    return response.json()
  }

  async updateWorkspace(
    id: string,
    data: Partial<WorkspaceData>
  ): Promise<WorkspaceData> {
    const response = await fetch(this.buildUrl(`/api/workspaces/${id}`), {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
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

    return response.json()
  }

  async deleteWorkspace(id: string): Promise<void> {
    const response = await fetch(this.buildUrl(`/api/workspaces/${id}`), {
      method: 'DELETE',
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
  }

  async getWorkspaceDetail(id: string): Promise<GetWorkspaceDetailResponse> {
    const headers = this.getHeaders()
    const baseUrl = this.buildUrl.bind(this)
    const [detail, summarize, checkBtn] = await Promise.all([
      this.safeFetchJson(baseUrl(`/api/workspaces/${id}`), headers),
      this.safeFetchJson(baseUrl(`/api/workspaces/${id}/summarize`), headers),
      // this.safeFetchJson(baseUrl(`/api/workspaces/${id}/chart`), headers),
      this.safeFetchJson(baseUrl(`/api/workspaces/${id}/check-btn-run-testset`), headers),
    ])
    return {
      data: {
        id: detail.data.id,
        name: detail.data.name,
        lastUpdated: detail.data.updatedAt,
        environmentId: detail.data.environmentId,
        stats: {
          totalTestSets: summarize.data.testset.total,
          totalTestCases: summarize.data.testcase.total,
          passedSetsPercentage: summarize.data.testset.totalPass.percent,
          failedSetsPercentage: summarize.data.testset.totalFail.percent,
          passedCasesPercentage: summarize.data.testcase.totalPass.percent,
          failedCasesPercentage: summarize.data.testcase.totalFail.percent,
        },
        failCaseData: [],
        buttonDisabled: checkBtn.data,
      },
    }
  }

  async getFailCaseChart(
    workspaceId: string,
    params: { startDate: string; endDate: string }
  ): Promise<FailCaseResponse> {
    const searchParams = new URLSearchParams()

    searchParams.append('startDate', params.startDate)
    searchParams.append('endDate', params.endDate)

    const response = await fetch(
      this.buildUrl(`/api/workspaces/${workspaceId}/chart?${searchParams}`),
      {
        headers: this.getHeaders(),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Create a custom error object with both message and code
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`

      // Throw a proper ApiError instance that preserves the code property
      throw new ApiError(errorMessage, errorCode)
    }

    const { data } = await response.json()
    return {
      data: data.map((item: any) => ({
        category: item.category,
        value: item.percent,
        group: item.group,
      })),
    }
  }

  async getWorkspaceTestSets(
    workspaceId: string,
    params: { page: number; limit: number; filters?: Record<string, string[]> }
  ): Promise<GetTestSetsResponse> {
    const searchParams = new URLSearchParams()

    searchParams.append('page', params.page.toString())
    searchParams.append('size', params.limit.toString())
    searchParams.delete('filters')

    // Add filters to the request if provided
    if (params.filters && Object.keys(params.filters).length > 0) {
      Object.entries(params?.filters || {}).forEach(([key, value]) => {
        if (key?.trim()?.toLowerCase() === 'rai dimensions') {
          value.forEach((v) => {
            searchParams.append('raiDimensions', v)
          })
        }
        if (key?.trim()?.toLowerCase() === 'status') {
          value.forEach((v) => {
            searchParams.append('status', v)
          })
        }
      })
    }

    const response = await fetch(
      this.buildUrl(`/api/workspaces/${workspaceId}/testset?${searchParams}`),
      {
        headers: this.getHeaders(),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Create a custom error object with both message and code
      const errorMessage =
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      const errorCode = errorData.code || `ERROR_${response.status}`

      // Throw a proper ApiError instance that preserves the code property
      throw new ApiError(errorMessage, errorCode)
    }

    const { data } = await response.json()
    return {
      data: data.item.map((item: any) => ({
        ...item,
        passedCases: item.testcase.pass.raw,
        totalCases: item.testcase.total,
        runTime:
          item.testsetSummarizes?.length > 0
            ? formatDate(item.testsetSummarizes[0].createdAt)
            : null,
      })),
      total: data.totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    }
  }

  async createTestSet(data: CreateTestSetRequest): Promise<CreateTestSetResponse> {
    const formData = new FormData()

    formData.append('workspaceId', data.workspaceId)
    formData.append('name', data.testSetName)
    formData.append('description', data.description)

    // Append all files
    data.files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await fetch(this.buildUrl('/api/testsets'), {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - let browser set it
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
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

    return await response.json()
  }

  async deleteTestSet(workspaceId: string, testSetId: string): Promise<void> {
    const response = await fetch(this.buildUrl(`/api/testsets/${testSetId}`), {
      method: 'DELETE',
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
  }

  async checkFileUploadTestSet(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await fetch(this.buildUrl('/api/testsets/check-file-csv'), {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - let browser set it
      headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }
}

// Mock implementation for development
export class MockWorkspaceApiService {
  private mockData: WorkspaceData[] = [...MOCK_WORKSPACES]

  async fetchWorkspaces(params?: { page?: number; limit?: number }): Promise<{
    data: WorkspaceData[]
    total: number
    page: number
    limit: number
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const filteredData = [...this.mockData]

    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredData.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
    }
  }

  async getWorkspaceById(id: string): Promise<WorkspaceData | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const workspace = this.mockData.find((w) => w.id === id)
    return workspace || null
  }

  async getWorkspaceDetail(id: string): Promise<GetWorkspaceDetailResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const workspaceDetail = generateMockWorkspaceDetail(id)

    return {
      data: workspaceDetail,
    }
  }

  async getWorkspaceTestSets(
    workspaceId: string,
    params: { page: number; limit: number; filters?: Record<string, string[]> }
  ): Promise<GetTestSetsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const allTestSets = generateMockTestSetResults(workspaceId)
    const { page, limit } = params
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = allTestSets.slice(startIndex, endIndex)
    const totalPages = Math.ceil(allTestSets.length / limit)

    return {
      data: paginatedData,
      total: allTestSets.length,
      page,
      limit,
      totalPages,
    }
  }

  async createWorkspace(
    data: Omit<WorkspaceData, 'id' | 'lastUpdated'> & { environmentId?: string }
  ): Promise<WorkspaceData> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newWorkspace: WorkspaceData = {
      ...data,
      id: (this.mockData.length + 1).toString().padStart(3, '0'),
      lastUpdated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
    }

    this.mockData.push(newWorkspace)
    return newWorkspace
  }

  async updateWorkspace(
    id: string,
    data: Partial<WorkspaceData>
  ): Promise<WorkspaceData> {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const index = this.mockData.findIndex((workspace) => workspace.id === id)
    if (index === -1) {
      throw new Error('Workspace not found')
    }

    this.mockData[index] = {
      ...this.mockData[index],
      ...data,
      lastUpdated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
    }

    return this.mockData[index]
  }

  async createTestSet(data: CreateTestSetRequest): Promise<CreateTestSetResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate file processing
    const processedFiles: TestSetFile[] = data.files.map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }))

    // Create mock test set
    const testSet: TestSet = {
      id: `testset_${Date.now()}`,
      workspaceId: data.workspaceId,
      name: data.testSetName,
      description: data.description,
      files: processedFiles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    }

    return {
      message: 'Test set created successfully',
      testSet,
    }
  }

  async deleteWorkspace(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const index = this.mockData.findIndex((workspace) => workspace.id === id)
    if (index === -1) {
      throw new Error('Workspace not found')
    }

    this.mockData.splice(index, 1)
  }

  async deleteTestSet(workspaceId: string, testSetId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!workspaceId || !testSetId) {
      throw new Error('Workspace ID and Test Set ID are required')
    }
  }

  async getFailCaseChart(
    workspaceId: string,
    params: { startDate: string; endDate: string }
  ): Promise<FailCaseResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return the same mock data as used in generateMockWorkspaceDetail
    const failCaseData: FailCaseData[] = [
      { category: 'Data & Privacy', value: 80, group: 'High Risk' },
      { category: 'Security & Safety', value: 35, group: 'High Risk' },
      { category: 'Reliability', value: 54, group: 'Medium Risk' },
      { category: 'Bias & Fairness', value: 20, group: 'Medium Risk' },
      { category: 'Sustainability', value: 10, group: 'Low Risk' },
    ]

    return {
      data: failCaseData,
    }
  }

  async checkFileUploadTestSet(files: File[]) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock validation - simulate checking CSV files
    const validExtensions = ['.csv', '.xlsx', '.xls']
    const invalidFiles = files.filter(
      (file) => !validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    )

    if (invalidFiles.length > 0) {
      throw new Error(
        `Invalid file types: ${invalidFiles.map((f) => f.name).join(', ')}. Only CSV and Excel files are allowed.`
      )
    }

    // Mock successful validation
    return {
      message: 'Files validated successfully',
      validFiles: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'valid',
      })),
    }
  }
}

// Service instance for use throughout the application
// Switch between MockWorkspaceApiService and WorkspaceApiService as needed
export const workspaceService = new MockWorkspaceApiService()

// For future API integration, use:
// export const workspaceService = new WorkspaceApiService(
//   process.env.RAI_SERVICE_URL as string,
//   'your-api-key'
// )
