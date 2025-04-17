"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Folder,
  Tag,
  FileText,
  LinkIcon,
  FileImage,
  FileVideo,
  FileAudio,
  Calendar,
  Search,
  X,
  Filter,
  Check,
} from "lucide-react"

// Mock collections for knowledge base
const collections = [
  { id: "work", name: "Work", count: 12 },
  { id: "research", name: "Research", count: 8 },
  { id: "articles", name: "Articles", count: 5 },
  { id: "design", name: "Design", count: 7 },
]

// Mock tags
const allTags = [
  { id: "proposal", name: "Proposal", count: 4 },
  { id: "project", name: "Project", count: 6 },
  { id: "planning", name: "Planning", count: 5 },
  { id: "research", name: "Research", count: 8 },
  { id: "academic", name: "Academic", count: 3 },
  { id: "analysis", name: "Analysis", count: 4 },
  { id: "ai", name: "AI", count: 7 },
  { id: "technology", name: "Technology", count: 5 },
  { id: "trends", name: "Trends", count: 3 },
  { id: "roadmap", name: "Roadmap", count: 2 },
  { id: "product", name: "Product", count: 6 },
  { id: "design", name: "Design", count: 7 },
  { id: "ui", name: "UI", count: 4 },
  { id: "documentation", name: "Documentation", count: 5 },
  { id: "logo", name: "Logo", count: 2 },
  { id: "branding", name: "Branding", count: 3 },
]

// File types for filtering
const fileTypes = [
  { id: "document", name: "Documents", icon: FileText },
  { id: "url", name: "Web Pages", icon: LinkIcon },
  { id: "image", name: "Images", icon: FileImage },
  { id: "video", name: "Videos", icon: FileVideo },
  { id: "audio", name: "Audio", icon: FileAudio },
]

// Date ranges for filtering
const dateRanges = [
  { id: "today", name: "Today" },
  { id: "yesterday", name: "Yesterday" },
  { id: "week", name: "This Week" },
  { id: "month", name: "This Month" },
  { id: "older", name: "Older" },
]

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeFilters: {
    collections: string[]
    tags: string[]
    fileTypes: string[]
    dateRanges: string[]
  }
  onFilterChange: (filters: {
    collections: string[]
    tags: string[]
    fileTypes: string[]
    dateRanges: string[]
  }) => void
}

export function FilterDialog({ open, onOpenChange, activeFilters, onFilterChange }: FilterDialogProps) {
  // Local state for filters that will only be applied when the user clicks "Apply Filters"
  const [localFilters, setLocalFilters] = useState({ ...activeFilters })
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate total active filters
  const totalActiveFilters = Object.values(localFilters).reduce((sum, filters) => sum + filters.length, 0)

  // Toggle a filter value
  const toggleFilter = (type: keyof typeof localFilters, value: string) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev }
      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter((v) => v !== value)
      } else {
        newFilters[type] = [...newFilters[type], value]
      }
      return newFilters
    })
  }

  // Clear all filters
  const clearAllFilters = () => {
    setLocalFilters({
      collections: [],
      tags: [],
      fileTypes: [],
      dateRanges: [],
    })
  }

  // Apply filters and close dialog
  const applyFilters = () => {
    onFilterChange(localFilters)
    onOpenChange(false)
  }

  // Reset to current active filters and close dialog
  const cancelFilters = () => {
    setLocalFilters({ ...activeFilters })
    onOpenChange(false)
  }

  // Filter tags based on search query
  const filteredTags = allTags.filter((tag) =>
    searchQuery ? tag.name.toLowerCase().includes(searchQuery.toLowerCase()) : true,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Resources
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="collections" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="collections" className="flex items-center gap-1">
              <Folder className="h-3 w-3" />
              <span>Collections</span>
              {localFilters.collections.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {localFilters.collections.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>Tags</span>
              {localFilters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {localFilters.tags.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="types" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Types</span>
              {localFilters.fileTypes.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {localFilters.fileTypes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Dates</span>
              {localFilters.dateRanges.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {localFilters.dateRanges.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="collections" className="mt-0 space-y-4">
              <div className="space-y-2">
                {collections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`collection-${collection.id}`}
                        checked={localFilters.collections.includes(collection.id)}
                        onCheckedChange={() => toggleFilter("collections", collection.id)}
                      />
                      <Label htmlFor={`collection-${collection.id}`} className="text-sm cursor-pointer">
                        {collection.name}
                      </Label>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {collection.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tags" className="mt-0 space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tags..."
                  className="w-full pl-8 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={localFilters.tags.includes(tag.id) ? "default" : "outline"}
                    className="text-xs cursor-pointer py-1 px-2"
                    onClick={() => toggleFilter("tags", tag.id)}
                  >
                    {tag.name}
                    {localFilters.tags.includes(tag.id) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>

              {filteredTags.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No tags match your search</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="types" className="mt-0 space-y-4">
              <div className="space-y-2">
                {fileTypes.map((type) => (
                  <div key={type.id} className="flex items-center py-1">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={localFilters.fileTypes.includes(type.id)}
                      onCheckedChange={() => toggleFilter("fileTypes", type.id)}
                    />
                    <Label htmlFor={`type-${type.id}`} className="ml-2 text-sm cursor-pointer flex items-center">
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dates" className="mt-0 space-y-4">
              <div className="space-y-2">
                {dateRanges.map((range) => (
                  <div key={range.id} className="flex items-center py-1">
                    <Checkbox
                      id={`date-${range.id}`}
                      checked={localFilters.dateRanges.includes(range.id)}
                      onCheckedChange={() => toggleFilter("dateRanges", range.id)}
                    />
                    <Label htmlFor={`date-${range.id}`} className="ml-2 text-sm cursor-pointer">
                      {range.name}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>

          {totalActiveFilters > 0 && (
            <>
              <Separator className="my-4" />
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Active Filters ({totalActiveFilters})
                  </h4>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-auto">
                  {localFilters.collections.map((id) => {
                    const collection = collections.find((c) => c.id === id)
                    return collection ? (
                      <Badge key={`col-${id}`} variant="secondary" className="text-xs">
                        <Folder className="h-3 w-3 mr-1" />
                        {collection.name}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter("collections", id)} />
                      </Badge>
                    ) : null
                  })}
                  {localFilters.tags.map((id) => {
                    const tag = allTags.find((t) => t.id === id)
                    return tag ? (
                      <Badge key={`tag-${id}`} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter("tags", id)} />
                      </Badge>
                    ) : null
                  })}
                  {localFilters.fileTypes.map((id) => {
                    const fileType = fileTypes.find((t) => t.id === id)
                    return fileType ? (
                      <Badge key={`type-${id}`} variant="secondary" className="text-xs">
                        <fileType.icon className="h-3 w-3 mr-1" />
                        {fileType.name}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter("fileTypes", id)} />
                      </Badge>
                    ) : null
                  })}
                  {localFilters.dateRanges.map((id) => {
                    const dateRange = dateRanges.find((d) => d.id === id)
                    return dateRange ? (
                      <Badge key={`date-${id}`} variant="secondary" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {dateRange.name}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleFilter("dateRanges", id)} />
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            </>
          )}
        </Tabs>

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={cancelFilters}>
            Cancel
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
