'use client'

import { useEffect, useState } from 'react'
import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Layout } from 'antd'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { getBreadcrumbs } from '@/utils/breadcrumbs'
import { SIGNIN_PATH } from '@/constants/auth.constants'

const { Content } = Layout

type LayoutProps = {
  children: ReactNode
}

const RootTemplate: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Define background class based on current path
  const getBackgroundClass = () => {
    // Handle dynamic routes for workspace create-test-set
    if (pathname.match(/^\/workspace\/[^/]+\/create-test-set$/)) {
      return 'min-h-screen bg-neutral-950'
    }

    // Handle environments pages
    if (
      pathname === '/environments/create' ||
      pathname.match(/^\/environments\/edit\/[^/]+$/) ||
      pathname.match(/^\/environments\/[^/]+$/)
    ) {
      return 'min-h-screen bg-neutral-950'
    }
    return 'min-h-screen bg-custom-gradient-dark bg-no-repeat bg-cover'
  }

  // Add event listener for escape key and manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Prevent body scroll when sidebar is open on mobile
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  const pathName = usePathname()

  const isLoginPage = pathName === SIGNIN_PATH || pathName === '/'

  if (isLoginPage) return <>{children}</>

  return (
    <Layout>
      <Content className="relative" style={{ height: 'calc(100dvh - 112px)' }}>
        {/* <HeaderBar /> */}

        <div className={getBackgroundClass()}>
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          )}

          {/* Sidebar */}
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="lg:ml-72 min-h-screen">
            {/* Header */}
            <Header
              breadcrumbs={getBreadcrumbs(pathname)}
              onMobileMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* Page Content */}
            {children}
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default RootTemplate
