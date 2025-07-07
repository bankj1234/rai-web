import { Flame, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateWorkspace: () => void
}

export function WelcomeModal({ isOpen, onClose, onCreateWorkspace }: WelcomeModalProps) {
  const handleCustomWorkspace = () => {
    onClose()
    onCreateWorkspace()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-navy-900 border-slate-700 text-white max-w-2xl pt-4 px-4 pb-10 !rounded-2xl">
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400">
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle className="text-3xl mb-8 font-[500]">
            Welcome to
            <span className="ml-2">
              RAI To
              <span className="bg-gradient-to-r from-white to-navy-900 bg-clip-text text-transparent">
                ols
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full px-10">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Use Preset */}
            <div className="border-2 border-red-300 rounded-2xl p-6 hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-400 mb-3">Use Preset</h3>
                <p className="text-navy-100 text-sm">
                  Quickly test your model using 5 RAI dimensions.
                </p>
              </div>
            </div>

            {/* Custom Your Own */}
            <div
              className="border-2 border-blue-300 rounded-2xl p-6 hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={handleCustomWorkspace}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-500 mb-3">
                  Custom Your Own
                </h3>
                <p className="text-navy-100 text-sm">
                  Set your own rules and upload a custom test set.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center max-w-[230px] w-full">
              <div className="flex-1 h-px bg-[#616161]"></div>
              <span className="px-4 text-[#CEDBF3] text-sm">or</span>
              <div className="flex-1 h-px bg-[#616161]"></div>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={onClose}
              className="text-blue-500 hover:text-blue-300"
            >
              Select your own workspaces
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
