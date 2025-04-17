"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AddNewModal } from "@/components/add-new-modal"
import DashboardLayout from "@/components/dashboard-layout"
import {
  FileText,
  LinkIcon,
  MoreHorizontal,
  MessageSquare,
  Trash2,
  Plus,
  Search,
  Folder,
  Star,
  Clock,
  Share2,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  FileIcon,
  BookOpen,
  FileImage,
  FileAudio,
  FileVideo,
  Download,
} from "lucide-react"
import { CreateFolderModal } from "@/components/create-folder-modal"
import { DeleteCollectionModal } from "@/components/delete-collection-modal"
import { useRouter, useSearchParams } from "next/navigation"

// Mock data for resources
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
  {
    id: 3,
    title: "Medium Article on AI",
    type: "url",
    collection: "Articles",
    tags: ["article", "tech", "ai"],
    date: "3 days ago",
    url: "https://medium.com/article",
    preview: "/placeholder.svg?height=100&width=200",
    processed: true,
  },
  {
    id: 4,
    title: "Product Roadmap.xlsx",
    type: "document",
    format: "xlsx",
    collection: "Work",
    tags: ["work", "planning"],
    date: "Yesterday",
    preview: "/placeholder.svg?height=100&width=200",
    size: "1.2 MB",
    processed: false,
  },
  {
    id: 5,
    title: "Design System Documentation",
    type: "url",
    collection: "Design",
    tags: ["design", "reference"],
    date: "5 days ago",
    url: "https://design-system.com",
    preview: "/placeholder.svg?height=100&width=200",
    processed: true,
  },
  {
    id: 6,
    title: "Company Logo.png",
    type: "image",
    format: "png",
    collection: "Design",
    tags: ["design", "branding"],
    date: "2 weeks ago",
    preview: "/placeholder.svg?height=100&width=200",
    size: "0.8 MB",
    processed: false,
  },
  {
    id: 7,
    title: "Quarterly Report.pdf",
    type: "document",
    format: "pdf",
    collection: "Work",
    tags: ["work", "finance"],
    date: "2 weeks ago",
    preview: "/placeholder.svg?height=100&width=200",
    size: "3.5 MB",
    processed: true,
  },
  {
    id: 8,
    title: "Product Demo.mp4",
    type: "video",
    format: "mp4",
    collection: "Work",
    tags: ["marketing", "product"],
    date: "1 month ago",
    preview: "/placeholder.svg?height=100&width=200",
    size: "24.5 MB",
    processed: false,
  },
]

// Mock data for collections
const collections = [
  {
    id: "work",
    name: "Work",
    count: 12,
    subfolders: [
      { id: "work-projects", name: "Projects", count: 5 },
      { id: "work-documents", name: "Documents", count: 7 },
    ],
  },
  {
    id: "personal",
    name: "Personal",
    count: 8,
    subfolders: [
      { id: "personal-photos", name: "Photos", count: 3 },
      { id: "personal-finance", name: "Finance", count: 5 },
    ],
  },
  { id: "archive", name: "Archive", count: 3, subfolders: [] },
]

// Mock data for tags
const tags = [
  { id: "proposal", name: "Proposal", count: 4 },
  { id: "research", name: "Research", count: 6 },
  { id: "academic", name: "Academic", count: 3 },
  { id: "article", name: "Article", count: 5 },
  { id: "tech", name: "Tech", count: 7 },
  { id: "planning", name: "Planning", count: 2 },
  { id: "design", name: "Design", count: 4 },
  { id: "finance", name: "Finance", count: 3 },
  { id: "ai", name: "AI", count: 5 },
  { id: "marketing", name: "Marketing", count: 2 },
]

export default function ResourcesPage() {
  const [addNewModalOpen, setAddNewModalOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    work: true,
    personal: false,
  })
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    dateAdded: false,
    fileTypes: true,
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedResources, setSelectedResources] = useState<number[]>([])
  const [processingQueue, setProcessingQueue] = useState<number[]>([4, 6, 8]) // Mock IDs of resources in processing queue
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [deleteCollectionModalOpen, setDeleteCollectionModalOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<{
    id: string
    name: string
    parentId?: string
  } | null>(null)
  const [collectionsState, setCollectionsState] = useState(collections)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we should open the Add New modal
  useEffect(() => {
    if (searchParams.get("openAddNewModal") === "true") {
      setAddNewModalOpen(true)
      // Remove the query parameter to avoid reopening the modal on refresh
      router.replace("/resources", { scroll: false })
    }
  }, [searchParams, router])

  const startChatWithResource = (resourceId: number) => {
    // Navigate to chat page with resource ID as query parameter
    router.push(`/chat?resource=${resourceId}&newChat=true`)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  const toggleResourceSelection = (id: number) => {
    setSelectedResources((prev) => (prev.includes(id) ? prev.filter((resourceId) => resourceId !== id) : [...prev, id]))
  }

  const selectAllResources = () => {
    if (selectedResources.length === resources.length) {
      setSelectedResources([])
    } else {
      setSelectedResources(resources.map((r) => r.id))
    }
  }

  const processResource = (id: number) => {
    if (!processingQueue.includes(id)) {
      setProcessingQueue((prev) => [...prev, id])
      // In a real app, you would start the processing here
      // For demo purposes, we'll just add it to the queue
    }
  }

  const getResourceIcon = (resource: any) => {
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

  const getFilteredResources = () => {
    if (!selectedCollection) {
      return resources
    }

    // Find the collection or subfolder
    const collection = collectionsState.find((c) => c.id === selectedCollection)
    if (collection) {
      return resources.filter((resource) => resource.collection === collection.name)
    }

    // Check if it's a subfolder
    for (const collection of collectionsState) {
      const subfolder = collection.subfolders.find((sf) => sf.id === selectedCollection)
      if (subfolder) {
        // In a real app, you would have a more complex data model
        // For now, we'll just filter by the subfolder name
        return resources.filter(
          (resource) => resource.collection === collection.name && resource.tags.includes(subfolder.name.toLowerCase()),
        )
      }
    }

    return resources
  }

  const handleCreateCollection = (newCollection: { id: string; name: string; count: number; subfolders: any[] }) => {
    setCollectionsState((prev) => [...prev, newCollection])
  }

  const handleDeleteCollection = () => {
    if (!collectionToDelete) return

    if (collectionToDelete.parentId) {
      // Handle subfolder deletion
      setCollectionsState((prev) =>
        prev.map((collection) => {
          if (collection.id === collectionToDelete.parentId) {
            return {
              ...collection,
              subfolders: collection.subfolders.filter((subfolder) => subfolder.id !== collectionToDelete.id),
            }
          }
          return collection
        }),
      )
    } else {
      // Handle main collection deletion
      setCollectionsState((prev) => prev.filter((collection) => collection.id !== collectionToDelete.id))
    }

    // If the deleted collection was selected, reset the selection
    if (selectedCollection === collectionToDelete.id) {
      setSelectedCollection(null)
    }

    setCollectionToDelete(null)
  }

  const openDeleteModal = (collectionId: string, collectionName: string, parentId?: string) => {
    setCollectionToDelete({ id: collectionId, name: collectionName, parentId })
    setDeleteCollectionModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Left Sidebar - Collection Navigation */}
        <div className="hidden md:block w-64 border-r h-full overflow-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Collections</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCreateFolderModalOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Collection</span>
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="p-2">
              <div className="space-y-1">
                <div className="px-2 py-1.5">
                  <h4 className="text-sm font-medium">My Collections</h4>
                </div>

                {collectionsState.map((collection) => (
                  <div key={collection.id} className="space-y-1 group">
                    <div className="flex items-center">
                      <Button
                        variant={selectedCollection === collection.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm h-9"
                        onClick={() => {
                          toggleFolder(collection.id)
                          setSelectedCollection(collection.id)
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <Folder className="h-4 w-4 mr-2" />
                            <span>{collection.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {collection.count}
                            </Badge>
                            {collection.subfolders.length > 0 && (
                              <>
                                {expandedFolders[collection.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteModal(collection.id, collection.name)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete Collection</span>
                      </Button>
                    </div>

                    {expandedFolders[collection.id] && collection.subfolders.length > 0 && (
                      <div className="ml-4 pl-2 border-l">
                        {collection.subfolders.map((subfolder) => (
                          <div key={subfolder.id} className="flex items-center group">
                            <Button
                              variant={selectedCollection === subfolder.id ? "secondary" : "ghost"}
                              className="w-full justify-start text-sm h-8"
                              onClick={() => setSelectedCollection(subfolder.id)}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <Folder className="h-4 w-4 mr-2" />
                                  <span>{subfolder.name}</span>
                                </div>
                                <Badge variant="outline">{subfolder.count}</Badge>
                              </div>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                openDeleteModal(subfolder.id, subfolder.name, collection.id)
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete Subfolder</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1 mb-4">
                <Button
                  variant={selectedCollection === null ? "secondary" : "ghost"}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setSelectedCollection(null)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>All Resources</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {resources.length}
                    </Badge>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      <span>Favorites</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      7
                    </Badge>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Recent</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      12
                    </Badge>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      <span>Shared</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      5
                    </Badge>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Trash</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      3
                    </Badge>
                  </div>
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="px-2 py-2">
                <h4 className="text-sm font-medium mb-2">Storage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>75% used</span>
                    <span>15GB of 20GB</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-3/4 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex h-full">
          <div className="flex-1 overflow-auto">
            <div className="w-full p-4 md:p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      {selectedCollection
                        ? collections.find((c) => c.id === selectedCollection)?.name ||
                          collections.flatMap((c) => c.subfolders).find((sf) => sf?.id === selectedCollection)?.name ||
                          "My Resources"
                        : "My Resources"}
                    </h1>
                    {selectedCollection && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>All Resources</span>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        {(() => {
                          const collection = collections.find((c) => c.id === selectedCollection)
                          if (collection) {
                            return <span>{collection.name}</span>
                          }

                          // Check if it's a subfolder
                          for (const collection of collections) {
                            const subfolder = collection.subfolders.find((sf) => sf.id === selectedCollection)
                            if (subfolder) {
                              return (
                                <>
                                  <span>{collection.name}</span>
                                  <ChevronRight className="h-4 w-4 mx-1" />
                                  <span>{subfolder.name}</span>
                                </>
                              )
                            }
                          }

                          return null
                        })()}
                      </div>
                    )}
                    <p className="text-muted-foreground mt-2">
                      Manage your documents, files, and processed web content
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="sm:w-auto w-full" onClick={() => setAddNewModalOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <Tabs defaultValue="all" className="w-full">
                        <div className="flex justify-between items-center">
                          <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="urls">URLs</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                          </TabsList>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className={viewMode === "grid" ? "bg-accent" : ""}
                              onClick={() => setViewMode("grid")}
                            >
                              <LayoutGrid className="h-4 w-4" />
                              <span className="sr-only">Grid View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className={viewMode === "list" ? "bg-accent" : ""}
                              onClick={() => setViewMode("list")}
                            >
                              <List className="h-4 w-4" />
                              <span className="sr-only">List View</span>
                            </Button>
                          </div>
                        </div>

                        <div className="relative my-4">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="search" placeholder="Search resources..." className="w-full pl-8" />
                        </div>

                        {selectedResources.length > 0 && (
                          <div className="flex items-center justify-between bg-accent/50 p-2 rounded-md mb-4">
                            <div className="flex items-center">
                              <Checkbox
                                id="select-all"
                                checked={selectedResources.length === resources.length}
                                onCheckedChange={selectAllResources}
                                className="mr-2"
                              />
                              <Label htmlFor="select-all" className="text-sm">
                                {selectedResources.length} selected
                              </Label>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}

                        <TabsContent value="all" className="mt-0">
                          {viewMode === "grid" ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {getFilteredResources().map((resource) => (
                                <ResourceCard
                                  key={resource.id}
                                  resource={resource}
                                  isSelected={selectedResources.includes(resource.id)}
                                  onSelect={() => toggleResourceSelection(resource.id)}
                                  isProcessing={processingQueue.includes(resource.id)}
                                  onProcess={() => processResource(resource.id)}
                                  getResourceIcon={getResourceIcon}
                                  startChatWithResource={startChatWithResource}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {getFilteredResources().map((resource) => (
                                <ResourceListItem
                                  key={resource.id}
                                  resource={resource}
                                  isSelected={selectedResources.includes(resource.id)}
                                  onSelect={() => toggleResourceSelection(resource.id)}
                                  isProcessing={processingQueue.includes(resource.id)}
                                  onProcess={() => processResource(resource.id)}
                                  getResourceIcon={getResourceIcon}
                                  startChatWithResource={startChatWithResource}
                                />
                              ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="documents" className="mt-0">
                          {viewMode === "grid" ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {getFilteredResources()
                                .filter((r) => r.type === "document")
                                .map((resource) => (
                                  <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={selectedResources.includes(resource.id)}
                                    onSelect={() => toggleResourceSelection(resource.id)}
                                    isProcessing={processingQueue.includes(resource.id)}
                                    onProcess={() => processResource(resource.id)}
                                    getResourceIcon={getResourceIcon}
                                    startChatWithResource={startChatWithResource}
                                  />
                                ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {getFilteredResources()
                                .filter((r) => r.type === "document")
                                .map((resource) => (
                                  <ResourceListItem
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={selectedResources.includes(resource.id)}
                                    onSelect={() => toggleResourceSelection(resource.id)}
                                    isProcessing={processingQueue.includes(resource.id)}
                                    onProcess={() => processResource(resource.id)}
                                    getResourceIcon={getResourceIcon}
                                    startChatWithResource={startChatWithResource}
                                  />
                                ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="urls" className="mt-0">
                          {viewMode === "grid" ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {getFilteredResources()
                                .filter((r) => r.type === "url")
                                .map((resource) => (
                                  <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={selectedResources.includes(resource.id)}
                                    onSelect={() => toggleResourceSelection(resource.id)}
                                    isProcessing={processingQueue.includes(resource.id)}
                                    onProcess={() => processResource(resource.id)}
                                    getResourceIcon={getResourceIcon}
                                    startChatWithResource={startChatWithResource}
                                  />
                                ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {getFilteredResources()
                                .filter((r) => r.type === "url")
                                .map((resource) => (
                                  <ResourceListItem
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={selectedResources.includes(resource.id)}
                                    onSelect={() => toggleResourceSelection(resource.id)}
                                    isProcessing={processingQueue.includes(resource.id)}
                                    onProcess={() => processResource(resource.id)}
                                    getResourceIcon={getResourceIcon}
                                    startChatWithResource={startChatWithResource}
                                  />
                                ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="media" className="mt-0">
                          {viewMode === "grid" ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                              {getFilteredResources()
                                .filter((r) => ["image", "video", "audio"].includes(r.type))
                                .map((resource) => (
                                  <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={selectedResources.includes(resource.id)}
                                    onSelect={() => toggleResourceSelection(resource.id)}
                                    isProcessing={processingQueue.includes(resource.id)}
                                    onProcess={() => processResource(resource.id)}
                                    getResourceIcon={getResourceIcon}
                                    startChatWithResource={startChatWithResource}
                                  />
                                ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {getFilteredResources()
                                .filter((r) => ["image", "video", "audio"].includes(r.type))
                                .map((resource) => (
                                  <ResourceListItem
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={selectedResources.includes(resource.id)}
                                    onSelect={() => toggleResourceSelection(resource.id)}
                                    isProcessing={processingQueue.includes(resource.id)}
                                    onProcess={() => processResource(resource.id)}
                                    getResourceIcon={getResourceIcon}
                                    startChatWithResource={startChatWithResource}
                                  />
                                ))}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  {/* Right Sidebar - Filters */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreateFolderModal
          open={createFolderModalOpen}
          onOpenChange={setCreateFolderModalOpen}
          collections={collectionsState}
          onCreateCollection={handleCreateCollection}
        />
        <DeleteCollectionModal
          open={deleteCollectionModalOpen}
          onOpenChange={setDeleteCollectionModalOpen}
          collectionName={collectionToDelete?.name || ""}
          onDelete={handleDeleteCollection}
        />
        <AddNewModal open={addNewModalOpen} onOpenChange={setAddNewModalOpen} />
      </div>
    </DashboardLayout>
  )
}

function ResourceCard({
  resource,
  isSelected,
  onSelect,
  isProcessing,
  onProcess,
  getResourceIcon,
  startChatWithResource,
}: {
  resource: any
  isSelected: boolean
  onSelect: () => void
  isProcessing: boolean
  onProcess: () => void
  getResourceIcon: (resource: any) => React.ReactNode
  startChatWithResource: (resourceId: number) => void
}) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox checked={isSelected} onCheckedChange={() => onSelect()} className="mr-1" />
            <CardTitle className="text-base truncate">{resource.title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => startChatWithResource(resource.id)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Chat with AI</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
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
          <img src={resource.preview || "/placeholder.svg"} alt={resource.title} className="object-cover" />
          <div className="absolute bottom-2 right-2">
            <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm">{getResourceIcon(resource)}</div>
          </div>
          {resource.format && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="uppercase text-xs">
                {resource.format}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {resource.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-muted-foreground">{resource.date}</span>
          {resource.processed ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={(e) => {
                e.stopPropagation()
                startChatWithResource(resource.id)
              }}
            >
              <MessageSquare className="mr-1 h-4 w-4" />
              Chat
            </Button>
          ) : isProcessing ? (
            <Button variant="outline" size="sm" className="h-8 px-2" disabled>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-8 px-2" onClick={onProcess}>
              Process
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function ResourceListItem({
  resource,
  isSelected,
  onSelect,
  isProcessing,
  onProcess,
  getResourceIcon,
  startChatWithResource,
}: {
  resource: any
  isSelected: boolean
  onSelect: () => void
  isProcessing: boolean
  onProcess: () => void
  getResourceIcon: (resource: any) => React.ReactNode
  startChatWithResource: (resourceId: number) => void
}) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/10 transition-colors ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <Checkbox checked={isSelected} onCheckedChange={() => onSelect()} className="mr-1" />
      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted shrink-0">
        <img src={resource.preview || "/placeholder.svg"} alt={resource.title} className="object-cover h-full w-full" />
        <div className="absolute bottom-0 right-0">
          <div className="rounded-tl-md bg-background/80 p-1 backdrop-blur-sm">{getResourceIcon(resource)}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{resource.title}</h3>
          <span className="text-xs text-muted-foreground ml-2 shrink-0">{resource.date}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {resource.format && (
            <Badge variant="secondary" className="uppercase text-xs">
              {resource.format}
            </Badge>
          )}
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 2}
              </Badge>
            )}
          </div>
          {resource.size && <span className="text-xs text-muted-foreground">{resource.size}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {resource.processed ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              startChatWithResource(resource.id)
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Chat with AI</span>
          </Button>
        ) : isProcessing ? (
          <Button variant="outline" size="sm" className="h-8 px-2" disabled>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-8 px-2" onClick={onProcess}>
            Process
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => startChatWithResource(resource.id)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Chat with AI</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              <span>Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
