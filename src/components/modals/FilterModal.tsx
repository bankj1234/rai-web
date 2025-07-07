'use client'

import { useState } from 'react'
import { Cuboid, Sparkles, SquareTerminal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFilters: Record<string, string[]>
  onFiltersChange: (filters: Record<string, string[]>) => void
}

export function FilterModal({
  isOpen,
  onClose,
  selectedFilters,
  onFiltersChange,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters)
  const [selectedCategory, setSelectedCategory] = useState<string>('RAI Dimensions')

  const categories = {
    'RAI Dimensions': [
      { label: 'Security and Safety', value: 'security_and_safety' },
      { label: 'Data and Privacy', value: 'data_and_privacy' },
      { label: 'Reliability', value: 'reliability' },
      { label: 'Fairness and Bias', value: 'fairness_and_bias' },
      { label: 'Sustainability', value: 'sustainability' },
    ],
    Status: [
      { label: 'Creating', value: 'created' },
      { label: 'Queued', value: 'queued' },
      { label: 'Running', value: 'running' },
      { label: 'Completed', value: 'done' },
      { label: 'Failed', value: 'failed' },
    ],
  }

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const categoryFilters = prev[category] || []
      if (checked) {
        return {
          ...prev,
          [category]: [...categoryFilters, value],
        }
      } else {
        return {
          ...prev,
          [category]: categoryFilters.filter((f) => f !== value),
        }
      }
    })
  }

  const handleRemoveFilter = (category: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((f) => f !== value),
    }))
  }

  const handleClearCategory = (category: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: [],
    }))
  }

  const handleResetFilters = () => {
    setLocalFilters({})
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const getTotalSelectedCount = () => {
    return Object.values(localFilters).reduce(
      (total, filters) => total + filters.length,
      0
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[733px] bg-navy-900 border-navy-900 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-lg font-medium">Filters</DialogTitle>
          <button
            onClick={onClose}
            className="mt-0 pt-0 text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </DialogHeader>

        <div className="flex gap-4 h-[400px] border-b border-gray-600">
          {/* Column 1 - Categories */}
          <div className="w-[200px] border-r border-gray-600 pr-4 pt-7">
            <div className="space-y-2">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-neutral-950 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {category === 'RAI Dimensions' && (
                      <Cuboid size={16} className="text-current" />
                    )}
                    {category === 'Status' && (
                      <Sparkles size={16} className="text-current" />
                    )}
                    {category === 'Mode' && (
                      <SquareTerminal size={16} className="text-current" />
                    )}
                    {category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2 - Sub Categories (Checkboxes) */}
          <div className="w-[250px] border-r border-gray-600 pr-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => handleClearCategory(selectedCategory)}
                className="text-darkBlue-100 hover:text-white text-sm"
              >
                Clear
              </button>
            </div>
            <div className="space-y-4">
              {categories[selectedCategory as keyof typeof categories]?.map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${selectedCategory}-${item.value}`}
                    checked={(localFilters[selectedCategory] || []).includes(item.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        selectedCategory,
                        item.value,
                        checked as boolean
                      )
                    }
                    className="border-gray-500 data-[state=checked]:bg-neutral-200 data-[state=checked]:text-neutral-950 bg-neutral-950"
                  />
                  <label
                    htmlFor={`${selectedCategory}-${item.value}`}
                    className="text-white text-md cursor-pointer flex-1"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 - Selected Filters */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <span className="text-darkBlue-100 text-sm">
                {getTotalSelectedCount()} Filter Selected
              </span>
            </div>
            <div className="space-y-4 max-h-[320px] overflow-y-auto">
              {Object.entries(localFilters).map(([category, values]) =>
                values.length > 0 ? (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-bold">{category}</h4>
                      {/* <button
                        onClick={() => handleClearCategory(category)}
                        className="text-gray-500 hover:text-gray-300 text-xs"
                      >
                        Clear All
                      </button> */}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => {
                        const item = categories[
                          category as keyof typeof categories
                        ]?.find((cat) => cat.value === value)
                        return (
                          <div
                            key={value}
                            className="inline-flex items-center gap-2 bg-neutral-950  text-white rounded-full px-3 py-1 text-xs transition-colors"
                          >
                            <span className="whitespace-nowrap">
                              {item?.label || value}
                            </span>
                            <button
                              onClick={() => handleRemoveFilter(category, value)}
                              className="text-white rounded-full p-0.5 transition-colors flex-shrink-0"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null
              )}
              {getTotalSelectedCount() === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-sm">No filters selected</p>
                  <p className="text-xs mt-1">
                    Select categories from the left to add filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 ">
          <button
            onClick={handleResetFilters}
            className="text-darkBlue-100 hover:text-white text-sm"
          >
            Reset All Filters
          </button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-blue-500 text-blue-500 hover:bg-slate-700 flex-1 min-w-[158px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-600 text-white flex-1 min-w-[158px]"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
