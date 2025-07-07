import { getServerSession, Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import axios, { AxiosError, AxiosInstance } from 'axios'
import { isServer } from '@/utils/utilities'
import authOptions from '@/app/api/auth/[...nextauth]/authOptions'
import { AuthApiEndpoints } from '@/constants/auth.constants'

/**
 * Creates a base Axios instance with the configured base URL.
 */
export const createBaseAxiosInstance = (backedApi: string): AxiosInstance => {
  return axios.create({
    baseURL: backedApi,
  })
}

/**
 * Adds request interceptors to the Axios instance.
 * - Adds Content-Type header.
 * - Adds Authorization header using access token.
 */
export const addRequestInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(
    async (config) => {
      /*
       ** Skip interception for refresh token endpoint to prevent infinite loops
       */
      if (config.url?.includes(AuthApiEndpoints.REFRESH_TOKEN)) {
        return config
      }

      const session: Session | null = isServer()
        ? await getServerSession(authOptions)
        : await getSession()

      const accessToken = session?.accessToken as string

      config.headers['Content-Type'] = 'application/json'

      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = generateAuthorization(accessToken)
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}

/**
 * Adds response interceptors to the Axios instance for error handling.
 */
export const addResponseInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      return Promise.reject(httpErrorHandler(error))
    }
  )

  return instance
}

/**
 * Handles Axios errors and returns a standardized Error object.
 */
const httpErrorHandler = (error: AxiosError | Error): Error => {
  if (axios.isAxiosError(error)) {
    return new Error(error.response?.data?.message || 'An error occurred')
  } else {
    return error
  }
}

export const generateAuthorization = (token: string): string => {
  return `Bearer ${token}`
}

/**
 * Creates and configures a new Axios instance with interceptors.
 */
export const createMainAxiosInstance = (baseUrl?: string): AxiosInstance => {
  const instance = createBaseAxiosInstance(
    baseUrl || (process.env.RAI_SERVICE_URL as string)
  )
  addRequestInterceptors(instance)
  addResponseInterceptors(instance)
  return instance
}

const mainAxiosInstance = createMainAxiosInstance()
export default mainAxiosInstance
