'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to workspace-list with welcome task on first visit
    router.replace('/workspace?task=welcome')
  }, [router])
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
}

export default HomePage
