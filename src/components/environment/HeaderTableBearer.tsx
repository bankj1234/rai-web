import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export interface HeaderBearerRow {
  oauthEndpoint: string
  clientId: string
  clientSecret: string
}

interface HeaderTableBearerProps {
  className?: string
  loadedHeader: HeaderBearerRow | null
  onChange: (headers: HeaderBearerRow) => void
}

export function HeaderTableBearer({
  className,
  loadedHeader,
  onChange,
}: HeaderTableBearerProps) {
  const [header, setLocalHeader] = useState<HeaderBearerRow>(
    loadedHeader || {
      oauthEndpoint: '',
      clientId: '',
      clientSecret: '',
    }
  )

  const updateHeader = (field: keyof Omit<HeaderBearerRow, 'id'>, value: string) => {
    const updatedHeaders = {
      ...header,
      [field]: value,
    }
    setLocalHeader(updatedHeaders)
    onChange(updatedHeaders)
  }

  return (
    <Card className={`bg-neutral-700 border-neutral-600 ${className ?? ''}`}>
      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-3 pt-6 rounded-md text-slate-300 text-sm font-medium border-b-2 border-slate-600">
            <div className="col-span-4">OAuth Endpoint</div>
            <div className="col-span-4">Client ID</div>
            <div className="col-span-4">Client Secret</div>
          </div>

          {/* Header Rows */}
          <div>
            {/* Desktop Row */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <Input
                  value={header.oauthEndpoint}
                  onChange={(e) => updateHeader('oauthEndpoint', e.target.value)}
                  placeholder="OAuth Endpoint"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <div className="col-span-4">
                <Input
                  value={header.clientId}
                  onChange={(e) => updateHeader('clientId', e.target.value)}
                  placeholder="Client ID"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <div className="col-span-4">
                <Input
                  value={header.clientSecret}
                  onChange={(e) => updateHeader('clientSecret', e.target.value)}
                  placeholder="Client Secret"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Mobile Row */}
            <div className="lg:hidden space-y-3 p-4 bg-slate-700/30 rounded-md">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">
                    OAuth Endpoint
                  </label>
                  <Input
                    value={header.oauthEndpoint}
                    onChange={(e) => updateHeader('oauthEndpoint', e.target.value)}
                    placeholder="OAuth Endpoint"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Client ID</label>
                  <Input
                    value={header.clientId}
                    onChange={(e) => updateHeader('clientId', e.target.value)}
                    placeholder="Client ID"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">
                    Client Secret
                  </label>
                  <Input
                    value={header.clientSecret}
                    onChange={(e) => updateHeader('clientSecret', e.target.value)}
                    placeholder="Client Secret"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
