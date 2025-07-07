'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EnvironmentTable } from '@/components/environment/EnvironmentTable'
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { CustomPagination } from '@/components/ui/CustomPagination'
import { useToast } from '@/hooks/use-toast'
import { useEnvironments } from '@/hooks/useEnvironments'
import { Environment } from '@/services/environment.service'

export default function EnvironmentsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [environmentToDelete, setEnvironmentToDelete] = useState<Environment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()
  const { toast } = useToast()

  const { environments, loading, error, pagination, refetch, deleteEnvironment } =
    useEnvironments({
      page: currentPage,
      limit: itemsPerPage,
    })

  // Calculate pagination from API
  const totalPages = pagination?.totalPages || 1

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteEnvironment = (environment: Environment) => {
    setEnvironmentToDelete(environment)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (environmentToDelete) {
      try {
        await deleteEnvironment(environmentToDelete.id)
        setEnvironmentToDelete(null)
        setShowDeleteModal(false)

        // Reset to first page if current page becomes empty
        const newTotalPages = Math.max(
          1,
          Math.ceil((pagination?.total || 1 - 1) / itemsPerPage)
        )
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }

        // Show success toast
        toast({
          title: 'Environment deleted successfully!',
          description: `"${environmentToDelete.name}" has been permanently deleted.`,
          variant: 'default',
          duration: 5000,
        })
      } catch (error: any) {
        const errorCode = error.code
        console.info('Error code from API:', errorCode)
        const title = 'Failed to delete environment'
        toast({
          title,
          description:
            error.message ||
            'There was an error deleting your environment. Please try again.',
          variant: 'destructive',
          duration: 5000,
        })
      }
    }
  }

  const handleEnvironmentClick = (environmentId: string) => {
    router.push(`/environments/${environmentId}`)
  }

  const handleEditEnvironment = (environment: Environment) => {
    router.push(`/environments/edit/${environment.id}`)
  }

  const handleCreateEnvironment = () => {
    router.push('/environments/create')
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <Button onClick={refetch} className="mt-2" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Desktop Create Button */}
      <div className="hidden lg:flex justify-end items-center mb-8">
        <Button
          variant={'outline'}
          onClick={handleCreateEnvironment}
          className="bg-none hover:bg-blue-700 text-blue-300 border-blue-300 rounded-sm px-6 font-bold"
          disabled={loading}
        >
          Create an Environment
        </Button>
      </div>

      {/* Mobile Create Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant={'outline'}
          onClick={handleCreateEnvironment}
          className="bg-none hover:bg-blue-700 text-blue-300 border-blue-300 rounded-sm w-full touch-manipulation font-bold"
          disabled={loading}
        >
          Create an Environment
        </Button>
      </div>

      <EnvironmentTable
        environments={environments}
        onEnvironmentClick={handleEnvironmentClick}
        onDeleteEnvironment={handleDeleteEnvironment}
        onEditEnvironment={handleEditEnvironment}
      />

      {/* Pagination */}
      {environments.length > 0 && totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageClick}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this item?"
        description="This action cannot be undone. Please confirm that you want to permanently delete this item."
      />
    </div>
  )
}
