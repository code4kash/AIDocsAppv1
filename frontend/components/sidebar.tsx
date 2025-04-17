"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  MessageSquare,
  ImageIcon,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart2,
  },
  {
    title: "My Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Generated Content",
    href: "/generated",
    icon: ImageIcon,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { isCollapsed, toggleSidebar, isLoaded } = useSidebarState()
  const isMobile = useIsMobile()

  // Don't render anything until we've loaded the collapsed state from localStorage
  // This prevents a flash of the expanded sidebar on page load
  if (!isLoaded) {
    return null
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="fixed right-4 top-4 z-50 md:hidden">
        <ThemeToggle />
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out border-r md:translate-x-0 md:z-10",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-[70px]" : "md:w-64",
        )}
      >
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div
              className={cn(
                "p-4 flex items-center justify-between transition-all duration-300",
                isCollapsed ? "px-2 flex-col" : "px-6",
              )}
            >
              {!isCollapsed && <h1 className="text-xl font-bold">AI Assistant</h1>}
              <div className="flex items-center gap-2">{!isCollapsed && <ThemeToggle />}</div>
            </div>

            {/* User profile */}
            {user && (
              <div className={cn("px-4 mb-2", isCollapsed && "px-2")}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3 bg-accent",
                    isCollapsed && "justify-center p-2",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2">
              {navItems.map((section, i) => (
                <div key={i} className="py-2">
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={section.href}
                          className={cn(
                            "flex items-center justify-center rounded-lg p-2 transition-all hover:bg-accent",
                            pathname === section.href || pathname.startsWith(section.href + "/")
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <section.icon className="h-5 w-5" />
                          <span className="sr-only">{section.title}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">{section.title}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link
                      href={section.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                        pathname === section.href || pathname.startsWith(section.href + "/")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <section.icon className="h-5 w-5" />
                      {section.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Sidebar footer */}
            <div className={cn("p-4", isCollapsed && "p-2")}>
              <Separator className="my-2" />
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-full h-10 flex justify-center" onClick={signOut}>
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Sign out</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sign out</TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              )}
            </div>

            {/* Help section - only show in expanded mode */}
            {!isCollapsed && (
              <div className="p-6">
                <div className="rounded-lg bg-primary/10 p-4">
                  <p className="text-sm font-medium">Need help?</p>
                  <p className="text-xs text-muted-foreground mt-1">Check our documentation or contact support</p>
                </div>
              </div>
            )}
          </div>
        </TooltipProvider>
      </div>
      {/* Sidebar toggle button */}
      {!isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-20 rounded-full h-8 w-8 flex items-center justify-center",
            isCollapsed
              ? "left-[60px] -ml-4 border border-border shadow-sm bg-background"
              : "left-[254px] -ml-4 border border-border shadow-sm bg-background",
          )}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
        </Button>
      )}
    </>
  )
}
