"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"
import { FilterDialog } from "@/components/filter-dialog"
import {
  MessageSquare,
  Send,
  Mic,
  Paperclip,
  FileText,
  BarChart2,
  Headphones,
  Bot,
  User,
  Plus,
  Search,
  Folder,
  FileIcon,
  LinkIcon,
  FileImage,
  FileVideo,
  FileAudio,
  Trash2,
  Star,
  Info,
  HelpCircle,
  BookOpen,
  Filter,
  X,
  AlertCircle,
  Tag,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { useChat } from "@/hooks/use-chat"
import { useResources } from "@/hooks/use-resources"
import type { ChatThread } from "@/types/chat"
import type { Resource } from "@/types/resources"
import { useRouter } from "next/navigation"
import { ResourceChatConfirmation } from "@/components/resource-chat-confirmation"

// Mock chat threads data - would come from API in production
const chatThreads: ChatThread[] = [
  {
    id: 1,
    title: "Project Proposal Analysis",
    lastMessage: "Can you summarize the key points?",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Research Paper Review",
    lastMessage: "What are the main findings?",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    title: "Product Roadmap Discussion",
    lastMessage: "Generate a timeline diagram",
    timestamp: "3 days ago",
    unread: false,
  },
  {
    id: 4,
    title: "Marketing Strategy",
    lastMessage: "Help me draft an email campaign",
    timestamp: "1 week ago",
    unread: false,
  },
  {
    id: 5,
    title: "Financial Report Analysis",
    lastMessage: "Extract key metrics from Q3 report",
    timestamp: "2 weeks ago",
    unread: false,
  },
]

// Mock resources data to match with resources page
const resources = [
  {
    id: 1,
    title: "Project Proposal.pdf",
    type: "document",
    format: "pdf",
    collection: "Work",
    tags: ["work", "proposal"],
    date: "2 days ago",
    preview: "/placeholder.svg?height=100&width=200",
    size: "2.4 MB",
    processed: true,
  },
  {
    id: 2,
    title: "Research Paper.docx",
    type: "document",
    format: "docx",
    collection: "Research",
    tags: ["research", "academic"],
    date: "1 week ago",
    preview: "/placeholder.svg?height=100&width=200",
    size: "1.8 MB",
    processed: true,
  },
  // Add more resources as needed
]

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [activeThread, setActiveThread] = useState(1)
  const [chatTitle, setChatTitle] = useState("AI Chat")
  const [selectedResources, setSelectedResources] = useState<number[]>([1, 3]) // Pre-selected resources
  const [activeResources, setActiveResources] = useState<number[]>([]) // Resources actively used in the current chat
  const [showResourcePreview, setShowResourcePreview] = useState<number | null>(null)
  const [knowledgeBaseApplied, setKnowledgeBaseApplied] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showResourceConfirmation, setShowResourceConfirmation] = useState(false)
  const [resourceConfirmationTitle, setResourceConfirmationTitle] = useState("")

  const router = useRouter()
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const resourceParam = searchParams.get("resource")
  const newChatParam = searchParams.get("newChat")

  // Handle resource context when page loads
  useEffect(() => {
    if (resourceParam && newChatParam === "true") {
      // Find the resource by ID
      const resourceId = Number.parseInt(resourceParam)
      const resource = resources.find((r) => r.id === resourceId)

      if (resource) {
        // Create a new chat thread
        const newThreadId = chatThreads.length + 1

        // Add the resource to selected resources
        setSelectedResources([resourceId])

        // Apply the resource to the chat
        setActiveResources([resourceId])
        setKnowledgeBaseApplied(true)

        // Set the active thread to the new thread
        setActiveThread(newThreadId)

        // Set chat title based on resource
        setChatTitle(`Chat about ${resource.title}`)

        // Add a system message indicating the resource has been added
        setMessages([
          {
            id: Date.now(),
            sender: "system",
            content: `Started a new conversation with resource: ${resource.title}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            resources: [resource],
          },
        ])

        // Show confirmation
        setResourceConfirmationTitle(resource.title)
        setShowResourceConfirmation(true)

        // Clear the URL parameters to prevent reloading the same context
        router.replace("/chat")
      }
    }
  }, [resourceParam, newChatParam])

  // Use our custom hooks
  const { messages, isLoading, error, sendMessage, setMessages } = useChat(activeThread)

  const {
    resources,
    isLoading: resourcesLoading,
    error: resourcesError,
    filters: activeFilters,
    setFilters: setActiveFilters,
    searchQuery,
    setSearchQuery,
  } = useResources()

  // Calculate total active filters
  const totalActiveFilters = Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0)

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      collections: [],
      tags: [],
      fileTypes: [],
      dateRanges: [],
    })
  }

  const applyResourcesToChat = () => {
    setLoadingProgress(0)

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setActiveResources([...selectedResources])
          setKnowledgeBaseApplied(true)

          // Add a system message indicating the knowledge base has been updated
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "system",
              content: `Knowledge base updated with ${selectedResources.length} resources.`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              resources: selectedResources.map((id) => resources.find((r) => r.id === id)),
            },
          ])

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Reset the knowledge base
  const resetKnowledgeBase = () => {
    setActiveResources([])
    setKnowledgeBaseApplied(false)

    // Add a system message indicating the knowledge base has been reset
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "system",
        content: "Knowledge base has been reset. I'm now using general knowledge only.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessage(message, activeResources)
    setMessage("")
  }

  const toggleResourceSelection = (id: number) => {
    setSelectedResources((prev) => (prev.includes(id) ? prev.filter((resourceId) => resourceId !== id) : [...prev, id]))
  }

  const getResourceIcon = (resource: Resource) => {
    if (resource.type === "document") {
      return <FileText className="h-4 w-4" />
    } else if (resource.type === "url") {
      return <LinkIcon className="h-4 w-4" />
    } else if (resource.type === "image") {
      return <FileImage className="h-4 w-4" />
    } else if (resource.type === "video") {
      return <FileVideo className="h-4 w-4" />
    } else if (resource.type === "audio") {
      return <FileAudio className="h-4 w-4" />
    } else {
      return <FileIcon className="h-4 w-4" />
    }
  }

  const getResourceById = (id: number) => {
    return resources.find((resource) => resource.id === id)
  }

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: "user",
          content: "I've uploaded my project proposal. Can you summarize the key points?",
          timestamp: "2:30 PM",
        },
      ])
    }
  }, [messages.length, setMessages])

  return (
    <DashboardLayout>
      <div className="w-full p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Chat</h1>
            <p className="text-muted-foreground mt-2">Chat with AI about your files and generate content</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
            {/* Left Sidebar - Chat Threads */}
            <Card className="lg:col-span-3 flex flex-col">
              <CardHeader className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                </div>
              </CardHeader>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search conversations..." className="w-full pl-8 py-2" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="divide-y">
                  {chatThreads.map((thread) => (
                    <button
                      key={thread.id}
                      className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-accent ${
                        activeThread === thread.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setActiveThread(thread.id)}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          <MessageSquare className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="font-medium leading-none">{thread.title}</p>
                          {thread.unread && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">{thread.timestamp}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t">
                <Button
                  className="w-full"
                  onClick={() => {
                    // Create a new thread
                    setActiveThread(chatThreads.length + 1)
                    // Clear messages
                    setMessages([])
                    // Clear resources
                    setSelectedResources([])
                    setActiveResources([])
                    setKnowledgeBaseApplied(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Conversation
                </Button>
              </div>
            </Card>

            {/* Main Chat Area */}
            <Card className="lg:col-span-6 flex flex-col">
              <CardHeader className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{chatTitle}</CardTitle>
                    {activeResources.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="ml-2 cursor-help">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {activeResources.length} {activeResources.length === 1 ? "resource" : "resources"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This chat is using {activeResources.length} resources from your knowledge base</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Info className="mr-2 h-4 w-4" />
                        <span>Chat details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        <span>Save as favorite</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete conversation</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "system" ? (
                        <div className="w-full">
                          <div className="bg-muted/50 rounded-lg p-3 text-center text-sm text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                              <Info className="h-4 w-4" />
                              {msg.content}
                            </div>
                            {msg.resources && (
                              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                                {msg.resources.map((resource: Resource) => (
                                  <Badge key={resource.id} variant="outline" className="text-xs">
                                    {resource.title}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback>
                              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`rounded-lg p-4 ${
                                msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="whitespace-pre-line">{msg.content}</p>
                              {msg.attachment && (
                                <div className="mt-2">
                                  <img
                                    src={msg.attachment.url || "/placeholder.svg"}
                                    alt={msg.attachment.alt}
                                    className="rounded-md max-w-full"
                                  />
                                </div>
                              )}

                              {/* Show which resources were used for this response */}
                              {msg.sender === "ai" && msg.usedResources && msg.usedResources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-background/20">
                                  <p className="text-xs mb-1 opacity-70">Sources:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {msg.usedResources.map((resourceId: number) => {
                                      const resource = getResourceById(resourceId)
                                      return resource ? (
                                        <Badge
                                          key={resourceId}
                                          variant="secondary"
                                          className="text-xs cursor-pointer hover:bg-secondary/80"
                                          onClick={() => setShowResourcePreview(resourceId)}
                                        >
                                          {getResourceIcon(resource)}
                                          <span className="ml-1">{resource.title}</span>
                                        </Badge>
                                      ) : null
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="rounded-lg p-4 bg-muted min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <div className="flex space-x-1">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                              </div>
                              <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="summarize">Summarize</TabsTrigger>
                    <TabsTrigger value="generate">Generate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="mt-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Button type="button" variant="outline" size="icon" className="shrink-0">
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                      <Button type="button" variant="outline" size="icon" className="shrink-0">
                        <Mic className="h-4 w-4" />
                        <span className="sr-only">Voice input</span>
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="Type your message..."
                          className="w-full pr-10"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" size="icon" className="shrink-0" disabled={isLoading || !message.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="summarize" className="mt-0">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Generate a summary of the current file or conversation
                      </p>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <FileText className="mr-2 h-4 w-4" />
                          Text Summary
                        </Button>
                        <Button className="flex-1">
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Key Points
                        </Button>
                        <Button className="flex-1">
                          <Headphones className="mr-2 h-4 w-4" />
                          Audio Narration
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="generate" className="mt-0">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Generate content based on the current file or conversation
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline">Diagram</Button>
                        <Button variant="outline">Timeline</Button>
                        <Button variant="outline">Flowchart</Button>
                        <Button variant="outline">Mind Map</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Right Sidebar - Knowledge Base */}
            <Card className="lg:col-span-3 flex flex-col">
              <CardHeader className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Knowledge Base</CardTitle>
                  <div className="flex items-center gap-1">
                    {activeResources.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={resetKnowledgeBase}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reset Knowledge Base</span>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <span>What is the knowledge base?</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>How to use resources</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>Managing collections</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Knowledge Base Status */}
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={activeResources.length > 0 ? "default" : "outline"} className="text-xs">
                      {activeResources.length > 0
                        ? `${activeResources.length} Active Resources`
                        : "No Active Resources"}
                    </Badge>
                    {totalActiveFilters > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Filter className="h-3 w-3 mr-1" />
                        {totalActiveFilters} {totalActiveFilters === 1 ? "Filter" : "Filters"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Button size="sm" variant="outline" className="h-8" onClick={() => setFilterDialogOpen(true)}>
                      <Filter className="h-3 w-3 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Loading progress when applying resources */}
                {loadingProgress > 0 && loadingProgress < 100 && (
                  <div className="mt-3">
                    <Progress value={loadingProgress} className="h-1" />
                    <p className="text-xs text-center mt-1 text-muted-foreground">Processing resources...</p>
                  </div>
                )}

                {/* Active filters summary */}
                {totalActiveFilters > 0 && loadingProgress === 0 && (
                  <div className="mt-3 bg-muted/30 rounded-md p-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Filter className="h-3 w-3 mr-1" />
                        Active Filters:
                      </p>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs p-0">
                        Clear
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeFilters.collections.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Folder className="h-3 w-3 mr-1" />
                          {activeFilters.collections.length}{" "}
                          {activeFilters.collections.length === 1 ? "Collection" : "Collections"}
                        </Badge>
                      )}
                      {activeFilters.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {activeFilters.tags.length} {activeFilters.tags.length === 1 ? "Tag" : "Tags"}
                        </Badge>
                      )}
                      {activeFilters.fileTypes.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <FileIcon className="h-3 w-3 mr-1" />
                          {activeFilters.fileTypes.length} {activeFilters.fileTypes.length === 1 ? "Type" : "Types"}
                        </Badge>
                      )}
                      {activeFilters.dateRanges.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {activeFilters.dateRanges.length} Date{" "}
                          {activeFilters.dateRanges.length === 1 ? "Range" : "Ranges"}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Active resources display */}
                {activeResources.length > 0 && loadingProgress === 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1 mb-1">
                      <BookOpen className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Active resources:</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeResources.map((id) => {
                        const resource = getResourceById(id)
                        return resource ? (
                          <Badge key={id} variant="secondary" className="text-xs">
                            {getResourceIcon(resource)}
                            <span className="ml-1 max-w-[100px] truncate">{resource.title}</span>
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* Warning when no resources are active */}
                {activeResources.length === 0 && loadingProgress === 0 && (
                  <div className="mt-3 flex items-center gap-2 text-amber-500 bg-amber-500/10 p-2 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-xs">
                      No resources are currently active. The AI will use general knowledge only.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    className="w-full pl-8 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {resourcesLoading ? (
                    // Loading state
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-md animate-pulse">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-muted-foreground/20 rounded-sm" />
                            <div className="h-4 w-32 bg-muted-foreground/20 rounded-md" />
                          </div>
                          <div className="h-5 w-16 bg-muted-foreground/20 rounded-full" />
                        </div>
                      ))
                  ) : resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">No resources match your filters</p>
                      {totalActiveFilters > 0 && (
                        <Button variant="link" size="sm" onClick={clearAllFilters} className="mt-1">
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    resources.map((resource) => (
                      <div
                        key={resource.id}
                        className={`flex items-center justify-between p-2 rounded-md ${
                          selectedResources.includes(resource.id) ? "bg-accent" : "hover:bg-accent/50"
                        } ${activeResources.includes(resource.id) ? "border border-primary/30" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`resource-${resource.id}`}
                            checked={selectedResources.includes(resource.id)}
                            onCheckedChange={() => toggleResourceSelection(resource.id)}
                          />
                          <div className="flex items-center gap-2">
                            {getResourceIcon(resource)}
                            <Label
                              htmlFor={`resource-${resource.id}`}
                              className="text-sm cursor-pointer truncate max-w-[150px]"
                            >
                              {resource.title}
                            </Label>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {activeResources.includes(resource.id) && (
                            <Badge variant="outline" className="mr-1 text-xs bg-primary/10">
                              Active
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {resource.format || resource.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Selected Resources</span>
                    <Badge variant="secondary">{selectedResources.length}</Badge>
                  </div>
                  <Button
                    variant="default"
                    className="w-full"
                    disabled={
                      selectedResources.length === 0 ||
                      loadingProgress > 0 ||
                      (activeResources.length > 0 &&
                        JSON.stringify(selectedResources.sort()) === JSON.stringify(activeResources.sort()))
                    }
                    onClick={applyResourcesToChat}
                  >
                    Apply to Chat
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      {/* Resource Preview Modal */}
      {showResourcePreview !== null && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Resource Preview</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowResourcePreview(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              {(() => {
                const resource = getResourceById(showResourcePreview)
                if (!resource) return null

                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">{getResourceIcon(resource)}</div>
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.format || resource.type} • {resource.size || "Unknown size"} • {resource.date}
                        </p>
                      </div>
                    </div>

                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={resource.preview || "/placeholder.svg"}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        <Folder className="h-3 w-3 mr-1" />
                        {resource.collection}
                      </Badge>
                      {resource.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="p-4 border rounded-md bg-muted/50">
                      <h5 className="font-medium mb-2">Content Preview</h5>
                      <p className="text-sm">
                        {resource.type === "document" &&
                          "This document contains information about project proposals, timelines, budgets, and team composition. It outlines the expected ROI and project milestones."}
                        {resource.type === "url" &&
                          "This web page contains articles and documentation about design systems, components, and best practices for UI development."}
                        {resource.type === "image" &&
                          "This image shows the company logo in various formats and color schemes for different applications."}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowResourcePreview(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  if (!selectedResources.includes(showResourcePreview)) {
                    toggleResourceSelection(showResourcePreview)
                  }
                  setShowResourcePreview(null)
                }}
              >
                {selectedResources.includes(showResourcePreview) ? "Already Selected" : "Add to Selection"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Chat Confirmation */}
      {showResourceConfirmation && (
        <ResourceChatConfirmation
          resourceTitle={resourceConfirmationTitle}
          onDismiss={() => setShowResourceConfirmation(false)}
        />
      )}
    </DashboardLayout>
  )
}

function MoreVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}
