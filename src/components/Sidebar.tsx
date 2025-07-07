'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Box, CircleDollarSign, Folders, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isSidebarOpen: boolean
  onCloseSidebar: () => void
}

export default function Sidebar({ isSidebarOpen, onCloseSidebar }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  const handleNavigate = (path: string) => {
    router.push(path)
    onCloseSidebar() // Close sidebar on mobile after navigation
  }
  return (
    <div
      className={`fixed left-0 top-0 h-full w-72 z-30 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
      aria-hidden={!isSidebarOpen && 'true'}
    >
      <div className="mt-3 ml-3 rounded-3xl bg-[#1A1F37] border-r border-slate-700 h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 flex justify-center">
              <h1 className="text-xl font-[400]">
                <span className="text-white">RAI Guard</span>
                <span className="bg-gradient-to-r from-white to-[#1A1F37] bg-clip-text text-transparent">
                  rail
                </span>
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400 hover:text-white touch-manipulation"
              onClick={onCloseSidebar}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="my-6">
            <div
              className="h-px w-full"
              style={{
                background: 'linear-gradient(to right, #1A1F37, white 50%, #1A1F37)',
              }}
            />
          </div>

          <nav className="space-y-2">
            <div
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                isActive('/workspace')
                  ? 'bg-[#330007] text-white'
                  : 'text-white hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => handleNavigate('/workspace')}
            >
              <Folders
                className={`h-8 w-8 p-2 rounded-xl ${
                  isActive('/workspace') ? 'bg-red-900' : 'text-red-500'
                }`}
              />
              <span className="font-medium">Workspaces</span>
            </div>
            <div
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                isActive('/environments')
                  ? 'bg-[#330007] text-white'
                  : 'text-white hover:text-white hover:bg-slate-700'
              }`}
              onClick={() => handleNavigate('/environments')}
            >
              <Box
                className={`h-8 w-8 p-2 rounded-xl ${
                  isActive('/environments') ? 'bg-red-900' : 'text-red-500'
                }`}
              />
              <span className="font-medium">Environments</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 text-white hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <ShieldCheck className="h-8 w-8 p-2 text-blue-600" />
              <span>Guardrail</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 text-white hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <CircleDollarSign className="h-8 w-8 p-2 text-blue-600" />
              <span>API Token</span>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
