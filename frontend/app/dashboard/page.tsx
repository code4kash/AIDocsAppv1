"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Headphones, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="w-full p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome to AI File Assistant. Manage your files and generate AI content.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Files"
              value="24"
              description="Files and URLs"
              icon={<FileText className="h-5 w-5 text-primary" />}
            />
            <StatsCard
              title="AI Responses"
              value="128"
              description="Generated responses"
              icon={<MessageSquare className="h-5 w-5 text-indigo-500" />}
            />
            <StatsCard
              title="Audio Narrations"
              value="16"
              description="Generated audio"
              icon={<Headphones className="h-5 w-5 text-green-500" />}
            />
            <StatsCard
              title="Processing Time"
              value="2.4s"
              description="Average response time"
              icon={<Clock className="h-5 w-5 text-orange-500" />}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent file and AI interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Project Proposal.pdf</p>
                        <p className="text-xs text-muted-foreground">Summarized • 2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <QuickAction title="Upload a new file" description="Add a document, image, or audio file" />
                  <QuickAction title="Add URL" description="Import content from a web page" />
                  <QuickAction title="Start AI chat" description="Ask questions about your content" />
                  <QuickAction title="Generate summary" description="Create a summary of your document" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="rounded-full bg-background p-2 shadow-sm">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickAction({ title, description }: { title: string; description: string }) {
  const router = useRouter()

  const handleClick = () => {
    // Check if this is the "Upload a new file" or "Add URL" action
    if (title === "Upload a new file" || title === "Add URL") {
      router.push("/resources?openAddNewModal=true")
    } else if (title === "Start AI chat") {
      router.push("/chat")
    } else if (title === "Generate summary") {
      router.push("/generated")
    }
  }

  return null
}
