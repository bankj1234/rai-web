'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[]
  onMobileMenuClick?: () => void
}

export default function Header({ breadcrumbs, onMobileMenuClick }: HeaderProps) {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Handle logout logic here
    router.push('/')
    setShowLogoutMenu(false)
  }

  const handleBreadcrumbClick = (href?: string) => {
    if (href) {
      router.push(href)
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-none p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white touch-manipulation"
              onClick={onMobileMenuClick}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Mobile Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {index > 0 && <span className="text-slate-400"> / </span>}
                  <button
                    onClick={() => handleBreadcrumbClick(item.href)}
                    className={`${
                      index === breadcrumbs.length - 1
                        ? 'text-white font-medium'
                        : item.href
                          ? 'text-slate-400 hover:text-white cursor-pointer'
                          : 'text-slate-400'
                    }`}
                    disabled={!item.href}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Profile Icon */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 p-0"
            >
              <User className="h-4 w-4 text-white" />
            </Button>

            {showLogoutMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLogoutMenu(false)}
                />
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-10 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-50 min-w-32 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-white hover:bg-slate-600 cursor-pointer transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block p-8">
        <div className="flex items-center justify-between">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <span className="text-slate-400"> / </span>}
                <button
                  onClick={() => handleBreadcrumbClick(item.href)}
                  className={`${
                    index === breadcrumbs.length - 1
                      ? 'text-white font-medium'
                      : item.href
                        ? 'text-slate-400 hover:text-white cursor-pointer'
                        : 'text-slate-400'
                  }`}
                  disabled={!item.href}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>

          {/* Profile Icon with Logout */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 p-0"
            >
              <User className="h-4 w-4 text-white" />
            </Button>

            {showLogoutMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLogoutMenu(false)}
                />
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-10 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-50 min-w-32 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-white hover:bg-slate-600 cursor-pointer transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
