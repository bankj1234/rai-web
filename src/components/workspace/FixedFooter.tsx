'use client'

import { Button } from '@/components/ui/button'

interface FixedFooterProps {
  onBackToWorkspaces: () => void
  onRunTest?: () => void
  disabled?: boolean
}

export function FixedFooter({
  onBackToWorkspaces,
  onRunTest,
  disabled,
}: FixedFooterProps) {
  return (
    <div className="fixed rounded-xl bottom-2 left-0 right-0 bg-[#020F35] border-none p-4 lg:ml-[285px] lg:mr-[30px] mr-[20px] ml-[20px] z-10">
      <div className="flex flex-col-reverse lg:flex-row lg:justify-end lg:items-center space-y-4 space-y-reverse lg:space-y-0 lg:space-x-4">
        <Button
          variant="ghost"
          onClick={onBackToWorkspaces}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 w-full lg:w-auto"
        >
          Back to workspaces
        </Button>
        <Button
          onClick={onRunTest}
          disabled={disabled}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full lg:w-auto touch-manipulation rounded-sm px-12"
        >
          Run Test
        </Button>
      </div>
    </div>
  )
}
