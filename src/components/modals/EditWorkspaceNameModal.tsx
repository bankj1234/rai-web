import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface EditWorkspaceNameModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (newName: string) => void
  currentName: string
}

export function EditWorkspaceNameModal({
  isOpen,
  onClose,
  onConfirm,
  currentName,
}: EditWorkspaceNameModalProps) {
  const [workspaceName, setWorkspaceName] = useState(currentName)

  // Update local state when currentName changes
  useEffect(() => {
    setWorkspaceName(currentName)
  }, [currentName])

  const handleClose = () => {
    onClose()
    // Reset form to current name
    setWorkspaceName(currentName)
  }

  const handleConfirm = () => {
    if (workspaceName.trim()) {
      onConfirm(workspaceName.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-navy-900 border-navy-900 text-white max-w-lg py-10 px-10 !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Workspace Name</DialogTitle>
        </DialogHeader>
        <div className="space-y-7 py-4">
          <div>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-neutral-700 border-neutral-600 text-darkBlue-100 placeholder-slate-400 focus:border-darkBlue-200 focus:ring-darkBlue-200"
              placeholder="Workspace name*"
              autoFocus
            />
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
            disabled={!workspaceName.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
