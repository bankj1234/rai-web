'use client'

import { useState } from 'react'
import { ListFilter } from 'lucide-react'
import { FilterModal } from '@/components/modals/FilterModal'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CustomPagination } from '@/components/ui/CustomPagination'
import { addSpaceBetweenUpperCase } from '@/lib/utils'
import { TestSetResult } from '@/services/workspace.service'

interface TestSetsTableProps {
  testSets: TestSetResult[]
  totalTestSets: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
  onViewTestSet: (testSetId: string) => void
  onDeleteTestSet: (testSetId: string) => void
  onFiltersChange?: (filters: Record<string, string[]>) => void
}

export function TestSetsTable({
  testSets,
  totalTestSets,
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  onViewTestSet,
  onDeleteTestSet,
  onFiltersChange,
}: TestSetsTableProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const handleFiltersChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters)
    onFiltersChange?.(filters) // Send filters to parent component
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600'
      case 'Failed':
        return 'text-red-500'
      case 'Running':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <>
      <Card className="bg-black/40 border-none mb-0">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 lg:mb-0">
              All Test Sets ({totalTestSets})
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Filters</span>
              <ListFilter
                onClick={() => setIsFilterModalOpen(true)}
                className="h-4 w-4 text-slate-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    <Checkbox className="border-gray-500 data-[state=checked]:bg-neutral-200 data-[state=checked]:text-neutral-950 bg-neutral-950 rounded" />
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    Test Set ID
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    Pass Rate
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    Run Time
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {testSets.map((testSet: TestSetResult) => (
                  <tr
                    key={testSet.id}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="py-4 px-4">
                      <Checkbox className="border-gray-500 data-[state=checked]:bg-neutral-200 data-[state=checked]:text-neutral-950 bg-neutral-950 rounded" />
                    </td>
                    <td className="py-4 px-4 text-white">{testSet.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{testSet.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">
                      <Badge
                        variant="outline"
                        className="text-xs text-red-400 border-red-400 rounded-sm"
                      >
                        RAI
                      </Badge>
                      &nbsp;- {testSet.description}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-white text-xs font-bold`}>
                        {addSpaceBetweenUpperCase(testSet.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white">
                      {testSet.passedCases}/{testSet.totalCases}
                    </td>
                    <td className="py-4 px-4 text-white">{testSet.runTime}</td>
                    <td className="py-4 px-4">
                      <ActionMenu
                        items={[
                          {
                            label: 'View',
                            onClick: () => onViewTestSet(testSet.id),
                          },
                          {
                            label: 'Delete',
                            onClick: () => onDeleteTestSet(testSet.id),
                            variant: 'destructive',
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {testSets.map((testSet: TestSetResult) => (
              <div key={testSet.id} className="bg-black/40 rounded-lg p-4 border-none">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-slate-600" />
                    <span className="text-white font-medium text-sm">{testSet.id}</span>
                    <Badge className="bg-red-600 text-white text-xs">RAI</Badge>
                  </div>
                  <ActionMenu
                    items={[
                      {
                        label: 'View',
                        onClick: () => onViewTestSet(testSet.id),
                      },
                      {
                        label: 'Delete',
                        onClick: () => onDeleteTestSet(testSet.id),
                        variant: 'destructive',
                      },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-white font-medium text-sm">{testSet.name}</p>
                    <p className="text-slate-300 text-xs">- {testSet.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(testSet.status)} text-xs`}>
                      {testSet.status}
                    </Badge>
                    <span className="text-white text-sm">{testSet.totalCases}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{testSet.runTime}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-0 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
          />
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
      />
    </>
  )
}
