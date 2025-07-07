import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
}

export function ErrorModal({
  isOpen,
  onClose,
  title = 'Unknown error',
  description = 'An unexpected error occurred during file upload. Please try again later.',
}: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-navy-900 border-navy-900 text-white max-w-lg py-10 px-10 !rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-white mt-0 mb-5">
            {title}
          </DialogTitle>
          <DialogDescription className="text-neutral-300 mt-2 text-center text-md">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center sm:flex-row mt-6">
          <Button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white max-w-[226px]"
          >
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
