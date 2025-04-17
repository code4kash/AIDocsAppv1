"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    // Simulate verification process
    const timer = setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Email verification</CardTitle>
        <CardDescription>Verifying your email address</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6">
        {isVerifying ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-center text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        ) : isVerified ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center space-y-2">
              <p className="font-medium">Your email has been verified!</p>
              <p className="text-sm text-muted-foreground">You can now sign in to your account.</p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/auth/signin">Continue to sign in</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
              <p className="font-medium text-destructive">Verification failed</p>
              <p className="text-sm text-muted-foreground">The verification link may have expired or is invalid.</p>
            </div>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/auth/signin">Back to sign in</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
