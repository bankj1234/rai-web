import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export interface HeaderBasicRow {
  username: string
  password: string
}

interface HeaderTableBasicProps {
  className?: string
  loadedHeader?: HeaderBasicRow | null
  onChange: (headers: HeaderBasicRow) => void
}

export function HeaderTableBasic({
  className,
  loadedHeader = null,
  onChange,
}: HeaderTableBasicProps) {
  const [header, setLocalHeader] = useState<HeaderBasicRow>(
    loadedHeader || {
      username: '',
      password: '',
    }
  )

  const updateHeader = (field: keyof Omit<HeaderBasicRow, 'id'>, value: string) => {
    const updatedHeaders: HeaderBasicRow = {
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
            <div className="col-span-6">Username</div>
            <div className="col-span-6">Password</div>
          </div>

          {/* Header Rows */}
          <div>
            {/* Desktop Row */}
            <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <Input
                  value={header.username}
                  onChange={(e) => updateHeader('username', e.target.value)}
                  placeholder="Username"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <div className="col-span-6">
                <Input
                  value={header.password}
                  onChange={(e) => updateHeader('password', e.target.value)}
                  placeholder="Password"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Mobile Row */}
            <div className="lg:hidden space-y-3 p-4 bg-slate-700/30 rounded-md">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Username</label>
                  <Input
                    value={header.username}
                    onChange={(e) => updateHeader('username', e.target.value)}
                    placeholder="Username"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Password</label>
                  <Input
                    value={header.password}
                    onChange={(e) => updateHeader('password', e.target.value)}
                    placeholder="Password"
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
