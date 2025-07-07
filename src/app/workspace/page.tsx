'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateWorkspaceModal } from '@/components/modals/CreateWorkspaceModal'
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'
import { EditWorkspaceNameModal } from '@/components/modals/EditWorkspaceNameModal'
import { WelcomeModal } from '@/components/modals/WelcomeModal'
import { Button } from '@/components/ui/button'
import { CustomPagination } from '@/components/ui/CustomPagination'
import { WorkspaceTable } from '@/components/workspace/WorkspaceTable'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaces } from '@/hooks/useWorkspaces'

// Adapter interface to match the expected Workspace interface in components
interface Workspace {
  id: string
  name: string
  lastUpdated: string
}

export default function WorkspaceApiDemo() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null)
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Workspace | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()
  const { toast } = useToast()

  const {
    workspaces: apiWorkspaces,
    loading,
    error,
    pagination,
    refetch,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
  } = useWorkspaces({
    page: currentPage,
    limit: itemsPerPage,
  })

  // Convert API workspaces to component format
  const workspaces: Workspace[] = apiWorkspaces.map((ws) => ({
    id: ws.id,
    name: ws.name,
    lastUpdated: ws.lastUpdated,
  }))

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

  const handleCreateWorkspace = async (name: string, environmentId: string) => {
    try {
      await createWorkspace({ name, environmentId })
      setShowCreateWorkspaceModal(false)
      // Reset to first page to show the new workspace
      setCurrentPage(1)

      // Show success toast
      toast({
        title: 'Workspace created successfully!',
        description: `"${name}" has been created and is ready to use.`,
        variant: 'default',
        duration: 5000,
      })
    } catch (error: any) {
      const errorCode = error.code || error.response?.data?.code || 'UNKNOWN_ERROR'
      console.info('Error code from API:', errorCode)
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        'There was an error creating your workspace. Please try again.'
      // Show error toast
      toast({
        title: 'Failed to create workspace',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      })
    }
  }

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (workspaceToDelete) {
      try {
        await deleteWorkspace(workspaceToDelete.id)
        setWorkspaceToDelete(null)
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
          title: 'Workspace deleted successfully!',
          description: `"${workspaceToDelete.name}" has been permanently deleted.`,
          variant: 'default',
          duration: 5000,
        })
      } catch (error: any) {
        const errorCode = error.code || error.response?.data?.code || 'UNKNOWN_ERROR'
        console.info('Error code from API:', errorCode)
        const errorMessage =
          error.message ||
          error.response?.data?.message ||
          'There was an error deleting your workspace. Please try again.'
        // Show error toast
        toast({
          title: 'Failed to delete workspace',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        })
      }
    }
  }

  const handleCreateTestSetFromMenu = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}/create-test-set`)
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`)
  }

  const handleOpenCreateWorkspace = () => {
    setShowCreateWorkspaceModal(true)
  }

  const handleEditWorkspace = (workspace: Workspace) => {
    setWorkspaceToEdit(workspace)
    setShowEditModal(true)
  }

  const handleConfirmEdit = async (newName: string) => {
    if (workspaceToEdit) {
      try {
        await updateWorkspace(workspaceToEdit.id, { name: newName })
        setWorkspaceToEdit(null)
        setShowEditModal(false)

        // Show success toast
        toast({
          title: 'Workspace updated successfully!',
          description: `Workspace name has been changed to "${newName}".`,
          variant: 'default',
          duration: 5000,
        })
      } catch (error: any) {
        const errorCode = error.code || error.response?.data?.code || 'UNKNOWN_ERROR'
        console.info('Error code from API:', errorCode)
        const errorMessage =
          error.message ||
          error.response?.data?.message ||
          'There was an error updating your workspace. Please try again.'
        // Show error toast
        toast({
          title: 'Failed to update workspace',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        })
      }
    }
  }

  // Handle URL query params for welcome modal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const task = urlParams.get('task')

    if (task === 'welcome') {
      setShowWelcomeModal(true)
      // Remove the query parameter from URL without refresh
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [])

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowWelcomeModal(false)
        setShowCreateWorkspaceModal(false)
        setShowEditModal(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showWelcomeModal, showCreateWorkspaceModal, showEditModal])

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
          onClick={handleOpenCreateWorkspace}
          className="bg-none hover:bg-blue-700 text-blue-300 border-blue-300 rounded-sm px-6 font-bold"
          disabled={loading}
        >
          Create Workspace
        </Button>
      </div>

      {/* Mobile Create Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant={'outline'}
          onClick={handleOpenCreateWorkspace}
          className="bg-none hover:bg-blue-700 text-blue-300 border-blue-300 rounded-sm w-full touch-manipulation font-bold"
          disabled={loading}
        >
          Create Workspace
        </Button>
      </div>

      <WorkspaceTable
        workspaces={workspaces}
        onWorkspaceClick={handleWorkspaceClick}
        onDeleteWorkspace={handleDeleteWorkspace}
        onCreateTestSet={handleCreateTestSetFromMenu}
        onEditWorkspace={handleEditWorkspace}
      />

      {/* Pagination */}
      {workspaces.length > 0 && totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageClick}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      )}

      {/* Modals */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onCreateWorkspace={() => setShowCreateWorkspaceModal(true)}
      />

      <CreateWorkspaceModal
        isOpen={showCreateWorkspaceModal}
        onClose={() => setShowCreateWorkspaceModal(false)}
        onConfirm={handleCreateWorkspace}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Test Set?"
        description="Are you sure you want to delete this Test Set?<br/><br/>This action cannot be undone. Any test sets or test runs associated with this environment may be affected."
      />

      <EditWorkspaceNameModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentName={workspaceToEdit?.name || ''}
        onConfirm={handleConfirmEdit}
      />
    </div>
  )
}
