import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Environment } from '@/services/environment.service'

interface CreateWorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string, environmentId: string) => void
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
  onConfirm,
}: CreateWorkspaceModalProps) {
  const router = useRouter()
  const [workspaceName, setWorkspaceName] = useState('')
  const [selectedEnvironment, setSelectedEnvironment] = useState('')
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [isLoadingEnvironments, setIsLoadingEnvironments] = useState(false)

  // Fetch environments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEnvironments()
    }
  }, [isOpen])

  const fetchEnvironments = async () => {
    try {
      setIsLoadingEnvironments(true)
      const response = await fetch('/api/environments?page=1&limit=100')
      const data = await response.json()
      setEnvironments(data.data || [])

      // Set first environment as default if available
      if (data.data && data.data.length > 0) {
        setSelectedEnvironment(data.data[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch environments:', error)
    } finally {
      setIsLoadingEnvironments(false)
    }
  }

  const handleCreateEnvironment = () => {
    // Close modal and navigate to create environment page
    onClose()
    router.push('/environments/create')
  }

  const handleClose = () => {
    onClose()
    // Reset form
    setWorkspaceName('')
    setSelectedEnvironment('')
  }

  const handleConfirm = () => {
    // Only allow creating workspace if environment is selected
    if (!selectedEnvironment) {
      return
    }

    onConfirm(workspaceName, selectedEnvironment)
    // Reset form
    setWorkspaceName('')
    setSelectedEnvironment('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-navy-900 border-navy-900 text-white max-w-lg py-10 px-10 !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Workspace</DialogTitle>
        </DialogHeader>
        <div className="space-y-7 py-4">
          <div>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-neutral-700 border-neutral-600 text-darkBlue-100 placeholder-slate-400 focus:border-darkBlue-200 focus:ring-darkBlue-200"
              placeholder="Workspace name*"
            />
          </div>
          <div>
            {!isLoadingEnvironments && environments.length === 0 ? (
              // Show custom box when no environments
              <div
                onClick={handleCreateEnvironment}
                className="w-full bg-neutral-700 border border-neutral-600 text-darkBlue-100 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-neutral-600 transition-colors"
              >
                <span className="text-darkBlue-100">
                  No environment found (Create Environment)
                </span>
                <Plus className="h-4 w-4 text-darkBlue-100" />
              </div>
            ) : (
              // Show normal select when environments exist
              <Select
                value={selectedEnvironment}
                onValueChange={setSelectedEnvironment}
                disabled={isLoadingEnvironments}
              >
                <SelectTrigger className="w-full bg-neutral-700 border-neutral-600 text-darkBlue-100 focus:border-darkBlue-200 focus:ring-darkBlue-200">
                  <SelectValue
                    placeholder={
                      isLoadingEnvironments
                        ? 'Loading environments...'
                        : 'Select environment*'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {environments.map((environment) => (
                    <SelectItem
                      key={environment.id}
                      value={environment.id}
                      className="text-white"
                    >
                      {environment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-blue-500 text-blue-500 hover:bg-slate-700 flex-1 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-700 text-white flex-1 font-bold"
            disabled={
              !workspaceName.trim() || !selectedEnvironment || isLoadingEnvironments
            }
          >
            Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
