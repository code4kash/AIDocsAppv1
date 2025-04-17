"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Folder, FolderPlus } from "lucide-react"

interface CreateFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collections: { id: string; name: string; count: number; subfolders: any[] }[]
  onCreateCollection: (collection: { id: string; name: string; count: number; subfolders: any[] }) => void
}

export function CreateFolderModal({ open, onOpenChange, collections, onCreateCollection }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("")
  const [parentFolder, setParentFolder] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would make an API call to create the folder
      console.log("Creating folder:", {
        name: folderName,
        parent: parentFolder || null,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new collection object
      const newCollection = {
        id: folderName.toLowerCase().replace(/\s+/g, "-"),
        name: folderName,
        count: 0,
        subfolders: [],
      }

      // Call the callback with the new collection
      onCreateCollection(newCollection)

      // Reset form and close modal
      setFolderName("")
      setParentFolder("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating folder:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>Create a new collection to organize your resources.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                placeholder="Enter collection name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent">Parent Collection (Optional)</Label>
              <Select value={parentFolder} onValueChange={setParentFolder}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="Select parent collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Root level)</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      <div className="flex items-center">
                        <Folder className="mr-2 h-4 w-4" />
                        {collection.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Leave empty to create a root-level collection.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Collection
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
