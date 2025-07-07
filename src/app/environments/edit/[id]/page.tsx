'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { HeaderRow, HeaderTable } from '@/components/environment/HeaderTable'
import {
  HeaderBasicRow,
  HeaderTableBasic,
} from '@/components/environment/HeaderTableBasic'
import {
  HeaderBearerRow,
  HeaderTableBearer,
} from '@/components/environment/HeaderTableBearer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useEnvironments } from '@/hooks/useEnvironments'
import { Environment } from '@/services/environment.service'

export default function EditEnvironmentPage() {
  const [environmentName, setEnvironmentName] = useState('')
  const [authType, setAuthType] = useState<'None' | 'Basic' | 'Bearer'>('None')
  const [headers, setHeaders] = useState<HeaderRow[]>([])
  const [headerBasic, setHeaderBasic] = useState<HeaderBasicRow | null>(null)
  const [headerBearer, setHeaderBearer] = useState<HeaderBearerRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [environment, setEnvironment] = useState<Environment | null>(null)

  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { updateEnvironment, getEnvironmentById } = useEnvironments({
    page: 1,
    limit: 10,
  })
  const [msgErrorAuth, setMsgErrorAuth] = useState<string | null>(null)
  const [msgErrorAuthHeader, setMsgErrorAuthHeader] = useState<string | null>(null)

  const environmentId = params.id as string

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        setIsLoading(true)
        const environmentThis = await getEnvironmentById(environmentId)
        setEnvironment(environmentThis ?? null)
        if (!environmentThis) {
          toast({
            title: 'Environment not found',
            description: 'The environment you are looking for does not exist.',
            variant: 'destructive',
            duration: 5000,
          })
          router.push('/environments')
          return
        }

        setEnvironmentName(environmentThis.name)
        setAuthType(environmentThis.authType)
        setHeaders(
          environmentThis.headers.map((header) => ({
            id: header.id,
            key: header.key,
            value: header.value,
            description: header.description,
          }))
        )
        setHeaderBasic({
          username: environmentThis?.username ?? '',
          password: environmentThis?.password ?? '',
        })
        setHeaderBearer({
          oauthEndpoint: environmentThis?.oauthEndpoint ?? '',
          clientId: environmentThis?.clientId ?? '',
          clientSecret: environmentThis?.clientSecret ?? '',
        })
      } catch (error: any) {
        console.error('Failed to load environment:', error)

        // Access code safely using optional chaining
        const errorCode = error?.code || 'UNKNOWN_ERROR'
        console.info('Error code:', errorCode) // For debugging

        toast({
          title: 'Failed to load environment',
          description:
            error?.message || 'There was an error loading the environment data.',
          variant: 'destructive',
          duration: 5000,
        })
        router.push('/environments')
      } finally {
        setIsLoading(false)
      }
    }

    if (environmentId) {
      loadEnvironment()
    }
  }, [environmentId, getEnvironmentById, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!environmentName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Environment name is required.',
        variant: 'destructive',
        duration: 5000,
      })
      return
    }
    try {
      setIsSubmitting(true)

      // Validate headers
      let countErr = 0

      setMsgErrorAuth(null)
      setMsgErrorAuthHeader(null)
      const hasInvalidHeaders = headers?.some((header) => !header?.key || !header?.value)

      if (headers?.length > 0 && hasInvalidHeaders) {
        setMsgErrorAuth('Key , Value is required.')
        countErr++
      }

      if (authType === 'Basic') {
        if (!headerBasic || !headerBasic?.username || !headerBasic?.password) {
          setMsgErrorAuthHeader('Username and Password are required for Basic Auth.')
          countErr++
        }
      }

      if (authType === 'Bearer') {
        if (
          !headerBearer ||
          !headerBearer?.oauthEndpoint ||
          !headerBearer?.clientId ||
          !headerBearer?.clientSecret
        ) {
          setMsgErrorAuthHeader(
            'OAuth Endpoint, Client ID, and Client Secret are required for Bearer Auth.'
          )
          countErr++
        }
      }

      if (countErr !== 0) {
        return
      }

      await updateEnvironment(environmentId, {
        name: environmentName.trim(),
        authType,
        headers: headers.map((header) => ({
          key: header.key,
          value: header.value,
          description: header.description,
        })),
        username: authType === 'Basic' ? headerBasic?.username : null,
        password: authType === 'Basic' ? headerBasic?.password : null,
        oauthEndpoint: authType === 'Bearer' ? headerBearer?.oauthEndpoint : null,
        clientId: authType === 'Bearer' ? headerBearer?.clientId : null,
        clientSecret: authType === 'Bearer' ? headerBearer?.clientSecret : null,
      })

      toast({
        title: 'Environment updated successfully!',
        description: `"${environmentName}" has been updated.`,
        variant: 'default',
        duration: 5000,
      })

      router.push('/environments')
    } catch (error: any) {
      console.error('Failed to update environment:', error)

      // Use error code for custom logic if needed
      // Access code safely using optional chaining or type assertion
      const errorCode = error.code || error.response?.data?.code || 'UNKNOWN_ERROR'
      console.info('Error code:', errorCode) // For debugging

      // Example of using error code for specific logic
      let title = 'Failed to update environment'
      if (errorCode === 'ERR_AUTH_BASIC_MISSING_FIELDS') {
        title = 'Missing Authentication Fields'
      }

      toast({
        title,
        description:
          error.message ||
          'There was an error updating your environment. Please try again.',
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/environments')
  }

  useEffect(() => {
    setMsgErrorAuth(null)
    setMsgErrorAuthHeader(null)
  }, [headers, headerBasic, headerBearer])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <div className="text-white">Loading environment...</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="lg:hidden mb-6">
        <p className="text-slate-400 text-sm">
          Required fields are marked with an asterisk (*).
        </p>
      </div>

      <div className="hidden lg:block mb-8">
        <h1 className="text-2xl font-semibold text-white">Edit Environment</h1>
        <p className="text-slate-400 text-sm mt-1">
          Required fields are marked with an asterisk (*).
        </p>
      </div>

      {/* Form Content */}
      <div className="max-w-none">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Environment Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Environment Name*
            </label>
            <Input
              value={environmentName}
              onChange={(e) => setEnvironmentName(e.target.value)}
              className="w-full bg-neutral-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Environment Name*"
              required
            />
          </div>

          {/* Authentication Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Authentication Type*
            </label>
            <Select
              value={authType}
              onValueChange={(value: 'None' | 'Basic' | 'Bearer') => {
                setAuthType(value)
                if (value === 'None') {
                  setHeaderBasic(null)
                  setHeaderBearer(null)
                } else if (value === 'Basic') {
                  setHeaderBearer(null)
                  setHeaderBasic({
                    username: environment?.username ?? '',
                    password: environment?.password ?? '',
                  })
                } else if (value === 'Bearer') {
                  setHeaderBasic(null)
                  setHeaderBearer({
                    oauthEndpoint: environment?.oauthEndpoint ?? '',
                    clientId: environment?.clientId ?? '',
                    clientSecret: environment?.clientSecret ?? '',
                  })
                }
              }}
            >
              <SelectTrigger className="w-full bg-neutral-700 border border-slate-600 text-white focus:ring-blue-500 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="None" className="text-white focus:bg-neutral-700">
                  None
                </SelectItem>
                <SelectItem value="Basic" className="text-white focus:bg-neutral-700">
                  Basic
                </SelectItem>
                <SelectItem value="Bearer" className="text-white focus:bg-neutral-700">
                  Bearer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Headers Section */}
          <div>
            {authType === 'Basic' ? (
              <div className="mb-6">
                <HeaderTableBasic
                  className={`${msgErrorAuthHeader ? 'border-2 border-[#FF4D4F]' : ''}`}
                  loadedHeader={headerBasic}
                  onChange={setHeaderBasic}
                />
                {msgErrorAuthHeader && (
                  <p className="text-red-500 text-sm mt-2">{msgErrorAuthHeader}</p>
                )}
              </div>
            ) : authType === 'Bearer' ? (
              <div className="mb-6">
                <HeaderTableBearer
                  className={`${msgErrorAuthHeader ? 'border-2 border-[#FF4D4F]' : ''}`}
                  loadedHeader={headerBearer}
                  onChange={setHeaderBearer}
                />
                {msgErrorAuthHeader && (
                  <p className="text-red-500 text-sm mt-2">{msgErrorAuthHeader}</p>
                )}
              </div>
            ) : (
              ''
            )}

            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Headers*
            </label>
            <div className="mb-6">
              <HeaderTable
                className={`${msgErrorAuth ? 'border-2 border-[#FF4D4F]' : ''}`}
                headers={headers}
                onChange={setHeaders}
              />
              {msgErrorAuth && (
                <p className="text-red-500 text-sm mt-2">{msgErrorAuth}</p>
              )}
            </div>
          </div>
        </form>

        {/* Form Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-end space-y-4 lg:space-y-0 lg:space-x-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full lg:w-auto lg:min-w-[226px] border-blue-400 text-blue-400 hover:bg-slate-700"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full lg:w-auto lg:min-w-[226px] bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting || !environmentName.trim()}
          >
            {isSubmitting ? 'Saving...' : 'Save Environment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
