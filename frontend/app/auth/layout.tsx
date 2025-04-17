import type React from "react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - AI File Assistant",
  description: "Sign in or sign up to AI File Assistant",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b h-14 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">AI File Assistant</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AI File Assistant. All rights reserved.</p>
      </footer>
    </div>
  )
}
