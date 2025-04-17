"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"

interface ResourceChatConfirmationProps {
  resourceTitle: string
  onDismiss: () => void
}

export function ResourceChatConfirmation({ resourceTitle, onDismiss }: ResourceChatConfirmationProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!visible) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Starting chat with resource</p>
            <p className="text-sm text-muted-foreground mt-1">"{resourceTitle}" has been added to your conversation</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setVisible(false)
              onDismiss()
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
