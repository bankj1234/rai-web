import axios, { AxiosError } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addRequestInterceptors,
  addResponseInterceptors,
  createBaseAxiosInstance,
  createMainAxiosInstance,
  generateAuthorization,
} from './api.services'

describe('Axios Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createBaseAxiosInstance', () => {
    it('should create an axios instance with the correct base URL', () => {
      const baseUrl = 'http://api.example.com'
      createBaseAxiosInstance(baseUrl)

      expect(axios.create).toHaveBeenCalledWith({ baseURL: baseUrl })
    })
  })

  describe('addRequestInterceptors', () => {
    it('should add request interceptors with correct headers', async () => {
      const mockConfig = { headers: {} }

      const instance = createMainAxiosInstance()
      addRequestInterceptors(instance)
      const interceptorFn = (instance.interceptors.request.use as any).mock.calls[0][0]

      const result = await interceptorFn(mockConfig)

      expect(result.headers['Content-Type']).toBe('application/json')
      expect(result.headers.Authorization).toBe(undefined)
    })

    it('should handle request interceptor errors', async () => {
      const mockError = new Error('Request error')

      const instance = createMainAxiosInstance()
      addRequestInterceptors(instance)
      const errorHandler = (instance.interceptors.request.use as any).mock.calls[0][1]

      await expect(errorHandler(mockError)).rejects.toEqual(mockError)
    })

    it('should add request interceptors with overrided headers', async () => {
      const mockConfig = { headers: { Authorization: 'Bearer test-token' } }

      const instance = createMainAxiosInstance()
      addRequestInterceptors(instance)
      const interceptorFn = (instance.interceptors.request.use as any).mock.calls[0][0]

      const result = await interceptorFn(mockConfig)

      expect(result.headers['Content-Type']).toBe('application/json')
      expect(result.headers.Authorization).toBe(mockConfig.headers.Authorization)
    })
  })

  describe('addResponseInterceptors', () => {
    it('should pass through successful responses', async () => {
      const mockResponse = { data: 'success' }

      const instance = createMainAxiosInstance()
      addResponseInterceptors(instance)
      const successHandler = (instance.interceptors.response.use as any).mock.calls[0][0]

      const result = await successHandler(mockResponse)
      expect(result).toEqual(mockResponse)
    })

    it('should handle axios errors without response data', async () => {
      const mockAxiosError = { isAxiosError: true } as AxiosError

      const instance = createMainAxiosInstance()
      addResponseInterceptors(instance)
      const errorHandler = (instance.interceptors.response.use as any).mock.calls[0][1]

      await expect(errorHandler(mockAxiosError)).rejects.toEqual(
        new Error('An error occurred')
      )
    })

    it('should handle non-axios errors', async () => {
      const mockError = new Error('Regular error')

      const instance = createMainAxiosInstance()
      addResponseInterceptors(instance)
      const errorHandler = (instance.interceptors.response.use as any).mock.calls[0][1]

      await expect(errorHandler(mockError)).rejects.toEqual(mockError)
    })
  })

  describe('createMainAxiosInstance', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should create instance with provided base URL', () => {
      const baseUrl = 'http://custom.api.com'
      createMainAxiosInstance(baseUrl)

      expect(axios.create).toHaveBeenCalledWith({ baseURL: baseUrl })
    })

    it('should create instance with environment variable base URL when no URL provided', () => {
      const baseUrl = 'http://env.api.com'
      process.env.RAI_SERVICE_URL = baseUrl
      createMainAxiosInstance()

      expect(axios.create).toHaveBeenCalledWith({ baseURL: baseUrl })
    })

    it('should add both request and response interceptors', () => {
      const instance = createMainAxiosInstance('http://test.api.com')

      expect(instance.interceptors.request.use).toHaveBeenCalled()
      expect(instance.interceptors.response.use).toHaveBeenCalled()
    })
  })

  describe('generateAuthorization', () => {
    it('should return a Bearer token string', () => {
      const token = 'test-token'
      const result = generateAuthorization(token)
      expect(result).toBe('Bearer test-token')
    })
  })
})
