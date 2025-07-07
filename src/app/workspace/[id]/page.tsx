'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChartSection } from '@/components/workspace/ChartSection'
import { FixedFooter } from '@/components/workspace/FixedFooter'
import { TestSetsTable } from '@/components/workspace/TestSetsTable'
import {
  useWorkspaceDetail,
  useWorkspaceFailCase,
  useWorkspaceTestSets,
} from '@/hooks/useWorkspaceDetail'
import { customRound } from '@/lib/utils'
import type { TestSetResult } from '@/services/workspace.service'

export default function TestSetResult() {
  const [itemsPerPage] = useState(5) // จำนวนรายการต่อหน้า
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [testSetToDelete, setTestSetToDelete] = useState<TestSetResult | null>(null)
  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  )
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string

  // Use hooks for data fetching
  const {
    workspaceDetail,
    loading: detailLoading,
    error: detailError,
  } = useWorkspaceDetail(workspaceId)

  const {
    testSets,
    totalPages,
    currentPage,
    error: testSetsError,
    deleteTestSet: deleteTestSetApi,
    handleFiltersChange: onFiltersChange,
    handlePageChange: onPageChange,
  } = useWorkspaceTestSets(workspaceId, 1, itemsPerPage)

  const { failCaseData, error: failCaseError } = useWorkspaceFailCase(
    workspaceId,
    startDate,
    endDate
  )

  // Loading state
  if (detailLoading) {
    return (
      <div className="p-4 lg:p-8 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Error state
  if (detailError || testSetsError || failCaseError) {
    return (
      <div className="p-4 lg:p-8 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-red-400">
          Error: {detailError || testSetsError || failCaseError}
        </div>
      </div>
    )
  }

  // No data state
  if (!workspaceDetail) {
    return (
      <div className="p-4 lg:p-8 pb-24 flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Workspace not found</div>
      </div>
    )
  }

  const { stats, buttonDisabled } = workspaceDetail

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handleBackToWorkspaces = () => {
    router.push('/workspace')
  }

  const handleCreateTestSet = () => {
    router.push(`/workspace/${workspaceId || ''}/create-test-set`)
  }

  const handleTimeChange = (time: string) => {
    if (time === 'Last 7 days') {
      setStartDate(dayjs().subtract(7, 'day').format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
    } else if (time === 'Last 30 days') {
      setStartDate(dayjs().subtract(30, 'day').format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
    } else if (time === 'Last 90 days') {
      setStartDate(dayjs().subtract(90, 'day').format('YYYY-MM-DD'))
      setEndDate(dayjs().format('YYYY-MM-DD'))
    }
  }

  const handleViewTestSet = (testSetId: string) => {
    // Navigate to test set detail page
    router.push(`/workspace/${workspaceId}/test-set/${testSetId}`)
  }

  const handleDeleteTestSet = (testSetId: string) => {
    const testSet = testSets.find((ts) => ts.id === testSetId)
    if (testSet) {
      setTestSetToDelete(testSet)
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (testSetToDelete) {
      const success = await deleteTestSetApi(testSetToDelete.id)
      if (success) {
        setIsDeleteModalOpen(false)
        setTestSetToDelete(null)
        // If we're on a page that becomes empty, go to previous page
        if (testSets.length === 1 && currentPage > 1) {
          onPageChange(currentPage - 1)
        }
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setTestSetToDelete(null)
  }

  return (
    <div className="p-4 lg:p-8 pb-24">
      {/* Desktop Create Button */}
      <div className="hidden lg:flex justify-end items-center mb-8">
        <Button
          variant="outline"
          onClick={handleCreateTestSet}
          className="bg-none hover:bg-blue-700 text-blue-300 border-blue-300 rounded-sm px-6"
        >
          Create Test Sets
        </Button>
      </div>

      {/* Mobile Create Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={handleCreateTestSet}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full touch-manipulation"
        >
          Create Test Sets
        </Button>
      </div>

      {/* Stats Cards */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-2 lg:mb-2">
          <Card className="bg-black/30 border-none relative overflow-hidden lg:col-span-6">
            <div
              className="absolute left-0 top-0 w-20 h-full bg-contain bg-no-repeat bg-left opacity-40"
              style={{ backgroundImage: 'url(/images/cube.png)' }}
            />
            <CardContent className="h-full p-4 lg:p-6 flex justify-between items-center relative z-10">
              <div>
                <p className="text-navy-100 text-sm mb-1 ml-[60px]">
                  Total<span className="text-white text-[20px]">&nbsp;Test Sets:</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-light text-white">{stats.totalTestSets}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-none lg:col-span-3">
            <CardContent className="p-4 lg:p-6">
              <div className="text-navy-100 text-sm">Total Sets</div>
              <div className="flex justify-between items-end mt-[-30px]">
                <p className="text-white text-[27px]">Passed: </p>
                <span className="text-[50px] font-light text-green-400">
                  {customRound(stats.passedSetsPercentage ?? 0)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-none lg:col-span-3">
            <CardContent className="p-4 lg:p-6">
              <div className="text-navy-100 text-sm">Total Sets</div>
              <div className="flex justify-between items-end mt-[-30px]">
                <p className="text-white text-[27px]">Failed: </p>
                <span className="text-[50px] font-light text-red-400">
                  {customRound(stats.failedSetsPercentage ?? 0)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-2 lg:mb-2">
          <Card className="bg-black/30 border-none relative overflow-hidden lg:col-span-6">
            <div
              className="absolute left-0 top-0 w-20 h-full bg-contain bg-no-repeat bg-left opacity-40"
              style={{ backgroundImage: 'url(/images/blockchain.png)' }}
            />
            <CardContent className="h-full p-4 lg:p-6 flex justify-between items-center relative z-10">
              <div>
                <p className="text-navy-100 text-sm mb-1 ml-[60px]">
                  Total<span className="text-white text-[20px]">&nbsp;Test Cases:</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-5xl font-light text-white">{stats.totalTestCases}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-none lg:col-span-3">
            <CardContent className="p-4 lg:p-6">
              <div className="text-navy-100 text-sm">Total Cases</div>
              <div className="flex justify-between items-end mt-[-30px]">
                <p className="text-white text-[27px]">Passed: </p>
                <span className="text-[50px] font-light text-green-400">
                  {customRound(stats.passedCasesPercentage ?? 0)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-none lg:col-span-3">
            <CardContent className="p-4 lg:p-6">
              <div className="text-navy-100 text-sm">Total Cases</div>
              <div className="flex justify-between items-end mt-[-30px]">
                <p className="text-white text-[27px]">Failed: </p>
                <span className="text-[50px] font-light text-red-400">
                  {customRound(stats.failedCasesPercentage ?? 0)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Chart Section Component */}
      <ChartSection failCaseData={failCaseData} handleTimeChange={handleTimeChange} />

      {/* Test Sets Table Component */}
      <TestSetsTable
        testSets={testSets}
        totalTestSets={stats.totalTestSets}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onViewTestSet={handleViewTestSet}
        onDeleteTestSet={handleDeleteTestSet}
        onFiltersChange={onFiltersChange}
      />

      {/* Spacer */}
      <div className="h-[50px]"></div>

      {/* Fixed Footer Component */}
      <FixedFooter
        onBackToWorkspaces={handleBackToWorkspaces}
        disabled={buttonDisabled}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Test Set"
        description={`Are you sure you want to delete "${testSetToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
