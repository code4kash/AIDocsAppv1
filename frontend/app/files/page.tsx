"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, LinkIcon, MoreHorizontal, MessageSquare, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Loader2 } from "lucide-react"

// Mock data for files
const files = [
  {
    id: 1,
    title: "Project Proposal.pdf",
    type: "file",
    tags: ["work", "proposal"],
    date: "2 days ago",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    title: "Research Paper.docx",
    type: "file",
    tags: ["research", "academic"],
    date: "1 week ago",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    title: "Medium Article",
    type: "url",
    tags: ["article", "tech"],
    date: "3 days ago",
    url: "https://medium.com/article",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    title: "Product Roadmap.xlsx",
    type: "file",
    tags: ["work", "planning"],
    date: "Yesterday",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 5,
    title: "Design System Documentation",
    type: "url",
    tags: ["design", "reference"],
    date: "5 days ago",
    url: "https://design-system.com",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 6,
    title: "Quarterly Report.pdf",
    type: "file",
    tags: ["work", "finance"],
    date: "2 weeks ago",
    preview: "/placeholder.svg?height=100&width=200",
  },
]

export default function FilesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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
      <main className="flex-1 w-full md:ml-64 transition-all duration-200 ease-in-out overflow-auto">
        <div className="w-full p-4 md:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
                <p className="text-muted-foreground mt-2">Manage your uploaded files and added URLs</p>
              </div>
              <Button className="sm:w-auto w-full">
                <PlusIcon className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="urls">URLs</TabsTrigger>
                </TabsList>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search files..."
                    className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {files.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {files
                    .filter((f) => f.type === "file")
                    .map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="urls" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {files
                    .filter((f) => f.type === "url")
                    .map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

function FileCard({ file }: { file: any }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base truncate">{file.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Chat with AI</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
          <img src={file.preview || "/placeholder.svg"} alt={file.title} className="object-cover" />
          <div className="absolute bottom-2 right-2">
            <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm">
              {file.type === "file" ? <FileText className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {file.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-muted-foreground">{file.date}</span>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
