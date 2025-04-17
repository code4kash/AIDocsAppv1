"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  demoSignIn: () => void
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("ai-file-assistant-user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname?.startsWith("/auth/")
      const isPublicRoute = pathname === "/"

      if (user && isAuthRoute) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would be a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const newUser = {
        id: "user-1",
        name: "John Doe",
        email: email,
        image: "/placeholder.svg?height=32&width=32",
      }

      setUser(newUser)
      localStorage.setItem("ai-file-assistant-user", JSON.stringify(newUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const demoSignIn = () => {
    setIsLoading(true)

    // Create demo user
    const demoUser = {
      id: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
      image: "/placeholder.svg?height=32&width=32",
    }

    setUser(demoUser)
    localStorage.setItem("ai-file-assistant-user", JSON.stringify(demoUser))
    router.push("/dashboard")
    setIsLoading(false)
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would be a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const newUser = {
        id: "user-" + Math.floor(Math.random() * 1000),
        name,
        email,
        image: "/placeholder.svg?height=32&width=32",
      }

      setUser(newUser)
      localStorage.setItem("ai-file-assistant-user", JSON.stringify(newUser))
      router.push("/dashboard")
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("ai-file-assistant-user")
    router.push("/auth/signin")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, demoSignIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
