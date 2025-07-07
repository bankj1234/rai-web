'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function CreateEnvironmentPage() {
  const [environmentName, setEnvironmentName] = useState('')
  const [authType, setAuthType] = useState<'None' | 'Basic' | 'Bearer'>('None')
  const [headers, setHeaders] = useState<HeaderRow[]>([])
  const [headerBasic, setHeaderBasic] = useState<HeaderBasicRow | null>(null)
  const [headerBearer, setHeaderBearer] = useState<HeaderBearerRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [msgErrorAuth, setMsgErrorAuth] = useState<string | null>(null)
  const [msgErrorAuthHeader, setMsgErrorAuthHeader] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { createEnvironment } = useEnvironments({ page: 1, limit: 10 })

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

      await createEnvironment({
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
        title: 'Environment created successfully!',
        description: `"${environmentName}" has been created and is ready to use.`,
        variant: 'default',
        duration: 5000,
      })

      router.push('/environments')
    } catch (error: any) {
      const errorCode = error.code || error.response?.data?.code || 'UNKNOWN_ERROR'
      console.info('Error code from API:', errorCode)
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        'There was an error creating your environment. Please try again.'
      const title = 'Failed to create environment'
      toast({
        title,
        description: errorMessage,
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

  return (
    <div className="p-4 lg:p-8">
      <div className="lg:hidden mb-6">
        <p className="text-slate-400 text-sm">
          Required fields are marked with an asterisk (*).
        </p>
      </div>

      <div className="hidden lg:block mb-8">
        <h1 className="text-2xl font-semibold text-white">Create Environment</h1>
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
                  if (!headerBasic) {
                    setHeaderBasic({ username: '', password: '' })
                  }
                } else if (value === 'Bearer') {
                  setHeaderBasic(null)
                  if (!headerBearer) {
                    setHeaderBearer({
                      oauthEndpoint: '',
                      clientId: '',
                      clientSecret: '',
                    })
                  }
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
            <div>
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
            {isSubmitting ? 'Creating...' : 'Create Environment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
