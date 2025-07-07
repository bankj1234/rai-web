import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export interface HeaderRow {
  id: string
  key: string
  value: string
  description: string
}

interface HeaderTableProps {
  className?: string
  headers: HeaderRow[]
  onChange: (headers: HeaderRow[]) => void
}

export function HeaderTable({ className, headers, onChange }: HeaderTableProps) {
  const [localHeaders, setLocalHeaders] = useState<HeaderRow[]>(headers)

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9)
  }

  const addHeader = () => {
    const newHeader: HeaderRow = {
      id: generateId(),
      key: '',
      value: '',
      description: '',
    }
    const updatedHeaders = [...localHeaders, newHeader]
    setLocalHeaders(updatedHeaders)
    onChange(updatedHeaders)
  }

  const updateHeader = (
    id: string,
    field: keyof Omit<HeaderRow, 'id'>,
    value: string
  ) => {
    const updatedHeaders = localHeaders.map((header) =>
      header.id === id ? { ...header, [field]: value } : header
    )
    setLocalHeaders(updatedHeaders)
    onChange(updatedHeaders)
  }

  const deleteHeader = (id: string) => {
    const updatedHeaders = localHeaders.filter((header) => header.id !== id)
    setLocalHeaders(updatedHeaders)
    onChange(updatedHeaders)
  }

  return (
    <Card className={`bg-neutral-700 border-neutral-600 ${className ?? ''}`}>
      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 p-3 pt-6 rounded-md text-slate-300 text-sm font-medium border-b-2 border-slate-600">
            <div className="col-span-3">Key</div>
            <div className="col-span-3">Value</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Header Rows */}
          {localHeaders.map((header) => (
            <div key={header.id}>
              {/* Desktop Row */}
              <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <Input
                    value={header.key}
                    onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                    placeholder="Header key"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={header.value}
                    onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    placeholder="Header value"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    value={header.description}
                    onChange={(e) =>
                      updateHeader(header.id, 'description', e.target.value)
                    }
                    placeholder="Description (optional)"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHeader(header.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Row */}
              <div className="lg:hidden space-y-3 p-4 bg-slate-700/30 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-sm">
                    Header {localHeaders.indexOf(header) + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHeader(header.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Key</label>
                    <Input
                      value={header.key}
                      onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                      placeholder="Header key"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm mb-1">Value</label>
                    <Input
                      value={header.value}
                      onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                      placeholder="Header value"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm mb-1">
                      Description
                    </label>
                    <Input
                      value={header.description}
                      onChange={(e) =>
                        updateHeader(header.id, 'description', e.target.value)
                      }
                      placeholder="Description (optional)"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div className="flex justify-start pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={addHeader}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white rounded-3xl bg-blue-400"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add more
            </Button>
          </div>

          {/* Empty State */}
          {localHeaders.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <p>No headers added yet</p>
              <p className="text-sm mt-1">
                Click &quot;Add More&quot; to add your first header
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
