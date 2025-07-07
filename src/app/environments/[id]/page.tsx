'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Pen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useEnvironments } from '@/hooks/useEnvironments'
import { Environment } from '@/services/environment.service'

export default function ViewEnvironmentPage() {
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { getEnvironmentById } = useEnvironments({
    page: 1,
    limit: 10,
  })

  const environmentId = params.id as string

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        setIsLoading(true)
        const env = await getEnvironmentById(environmentId)

        if (!env) {
          toast({
            title: 'Environment not found',
            description: 'The environment you are looking for does not exist.',
            variant: 'destructive',
            duration: 5000,
          })
          router.push('/environments')
          return
        }

        setEnvironment(env)
      } catch (error) {
        console.error('Failed to load environment:', error)
        toast({
          title: 'Failed to load environment',
          description: 'There was an error loading the environment data.',
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

  const handleEdit = () => {
    router.push(`/environments/edit/${environmentId}`)
  }

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

  if (!environment) {
    return null
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold text-white">{environment.name}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="border-none text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Edit
            <Pen className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">
              Authentication Type
            </label>
            <input
              type="text"
              value={environment.authType}
              readOnly
              className="w-full bg-neutral-950 border border-neutral-600 text-white px-3 py-2 rounded-md cursor-not-allowed"
            />
          </div>
        </div>

        {/* Headers */}
        <div>
          {environment.authType === 'Basic' ? (
            <Card className="border-neutral-600 mb-6">
              <CardContent className="p-6 py-2">
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-600 text-slate-300 text-sm font-medium">
                      <div className="col-span-6">Username</div>
                      <div className="col-span-6">Password</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-neutral-600 last:border-b-0">
                      <div className="col-span-6 text-white font-mono text-sm">
                        {environment.username}
                      </div>
                      <div className="col-span-6 text-slate-300 font-mono text-sm">
                        {environment.password}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 space-y-2">
                      <div>
                        <label className="text-slate-400 text-xs uppercase tracking-wide">
                          Username
                        </label>
                        <div className="text-white font-mono text-sm">
                          {environment.username}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs uppercase tracking-wide">
                          Password
                        </label>
                        <div className="text-slate-300 font-mono text-sm break-all">
                          {environment.password}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : environment.authType === 'Bearer' ? (
            <Card className="border-neutral-600 mb-6">
              <CardContent className="p-6 py-2">
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-600 text-slate-300 text-sm font-medium">
                      <div className="col-span-4">OAuth Endpoint</div>
                      <div className="col-span-4">Client ID</div>
                      <div className="col-span-4">Client Secret</div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-neutral-600 last:border-b-0">
                      <div className="col-span-4 text-white font-mono text-sm">
                        {environment.oauthEndpoint}
                      </div>
                      <div className="col-span-4 text-slate-300 font-mono text-sm">
                        {environment.clientId}
                      </div>
                      <div className="col-span-4 text-slate-300 font-mono text-sm">
                        {environment.clientSecret}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    <div className="bg-slate-800/30 rounded-lg p-4 space-y-2">
                      <div>
                        <label className="text-slate-400 text-xs uppercase tracking-wide">
                          OAuth Endpoint
                        </label>
                        <div className="text-slate-300 font-mono text-sm break-all">
                          {environment.oauthEndpoint}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs uppercase tracking-wide">
                          Client ID
                        </label>
                        <div className="text-slate-300 font-mono text-sm break-all">
                          {environment.clientId}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-xs uppercase tracking-wide">
                          Client Secret
                        </label>
                        <div className="text-slate-300 font-mono text-sm break-all">
                          {environment.clientSecret}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            ''
          )}

          <label className="block text-slate-400 text-sm mb-2">Headers</label>
          <Card className="border-neutral-600">
            <CardContent className="p-6 py-2">
              {environment.headers.length > 0 ? (
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-600 text-slate-300 text-sm font-medium">
                      <div className="col-span-3">Key</div>
                      <div className="col-span-4">Value</div>
                      <div className="col-span-5">Description</div>
                    </div>
                    {environment.headers.map((header) => (
                      <div
                        key={header.id}
                        className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-neutral-600 last:border-b-0"
                      >
                        <div className="col-span-3 text-white font-mono text-sm">
                          {header.key}
                        </div>
                        <div className="col-span-4 text-slate-300 font-mono text-sm">
                          {header.value}
                        </div>
                        <div className="col-span-5 text-slate-400 text-sm">
                          {header.description || 'No description'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    {environment.headers.map((header) => (
                      <div
                        key={header.id}
                        className="bg-slate-800/30 rounded-lg p-4 space-y-2"
                      >
                        <div>
                          <label className="text-slate-400 text-xs uppercase tracking-wide">
                            Key
                          </label>
                          <div className="text-white font-mono text-sm">{header.key}</div>
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs uppercase tracking-wide">
                            Value
                          </label>
                          <div className="text-slate-300 font-mono text-sm break-all">
                            {header.value}
                          </div>
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs uppercase tracking-wide">
                            Description
                          </label>
                          <div className="text-slate-400 text-sm">
                            {header.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>No headers configured</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
