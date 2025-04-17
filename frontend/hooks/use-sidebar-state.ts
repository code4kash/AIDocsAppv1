"use client"

import { useState, useEffect } from "react"

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load the collapsed state from localStorage on component mount
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed")
    if (storedState !== null) {
      setIsCollapsed(storedState === "true")
    }
    setIsLoaded(true)
  }, [])

  // Update localStorage when the collapsed state changes
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  return { isCollapsed, toggleSidebar, isLoaded }
}
