"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { Sidebar } from "@/components/sidebar"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { isCollapsed, isLoaded } = useSidebarState()

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render the dashboard content if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "flex-1 w-full transition-all duration-300 ease-in-out overflow-auto",
          isLoaded && (isCollapsed ? "md:ml-[70px]" : "md:ml-64"),
        )}
      >
        {children}
      </main>
    </div>
  )
}
