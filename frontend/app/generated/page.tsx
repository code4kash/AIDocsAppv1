"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BarChart2, Headphones, Download, Share2, MoreHorizontal, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for generated content
const generatedContent = [
  {
    id: 1,
    title: "Project Proposal Summary",
    type: "summary",
    date: "2 days ago",
    source: "Project Proposal.pdf",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    title: "Research Paper Key Points",
    type: "key-points",
    date: "1 week ago",
    source: "Research Paper.docx",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    title: "Product Roadmap Timeline",
    type: "diagram",
    date: "3 days ago",
    source: "Product Roadmap.xlsx",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    title: "Quarterly Report Narration",
    type: "audio",
    date: "Yesterday",
    source: "Quarterly Report.pdf",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 5,
    title: "Design System Documentation Summary",
    type: "summary",
    date: "5 days ago",
    source: "Design System Documentation",
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 6,
    title: "Project Dependencies",
    type: "diagram",
    date: "2 weeks ago",
    source: "Project Proposal.pdf",
    preview: "/placeholder.svg?height=100&width=200",
  },
]

export default function GeneratedPage() {
  return (
    <DashboardLayout>
      <div className="w-full p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Generated Content</h1>
              <p className="text-muted-foreground mt-2">View and manage AI-generated content from your files</p>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="summaries">Summaries</TabsTrigger>
                <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search generated content..."
                  className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {generatedContent.map((content) => (
                  <GeneratedCard key={content.id} content={content} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summaries" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {generatedContent
                  .filter((c) => c.type === "summary" || c.type === "key-points")
                  .map((content) => (
                    <GeneratedCard key={content.id} content={content} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="diagrams" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {generatedContent
                  .filter((c) => c.type === "diagram")
                  .map((content) => (
                    <GeneratedCard key={content.id} content={content} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="audio" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {generatedContent
                  .filter((c) => c.type === "audio")
                  .map((content) => (
                    <GeneratedCard key={content.id} content={content} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

function GeneratedCard({ content }: { content: any }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base truncate">{content.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
          <img src={content.preview || "/placeholder.svg"} alt={content.title} className="object-cover" />
          <div className="absolute bottom-2 right-2">
            <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm">
              {content.type === "summary" && <FileText className="h-4 w-4" />}
              {content.type === "key-points" && <BarChart2 className="h-4 w-4" />}
              {content.type === "diagram" && <BarChart2 className="h-4 w-4" />}
              {content.type === "audio" && <Headphones className="h-4 w-4" />}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {content.type === "summary" && "Summary"}
            {content.type === "key-points" && "Key Points"}
            {content.type === "diagram" && "Diagram"}
            {content.type === "audio" && "Audio"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {content.source}
          </Badge>
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-muted-foreground">{content.date}</span>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
