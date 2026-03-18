import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { useAuthStore } from '@/stores/useAuthStore'

function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})