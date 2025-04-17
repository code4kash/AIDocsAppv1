"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { FileUp, LinkIcon, Upload, ArrowRight, Check, AlertCircle, FileText, Globe, Loader2 } from "lucide-react"

interface AddNewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type WizardStep = "type" | "upload" | "url" | "processing" | "complete" | "error"

export function AddNewModal({ open, onOpenChange }: AddNewModalProps) {
  const [step, setStep] = useState<WizardStep>("type")
  const [resourceType, setResourceType] = useState<"file" | "url">("file")
  const [dragActive, setDragActive] = useState(false)
  const [url, setUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [autoProcess, setAutoProcess] = useState(true)
  const [collection, setCollection] = useState("")
  const [error, setError] = useState("")

  const resetState = () => {
    setStep("type")
    setResourceType("file")
    setDragActive(false)
    setUrl("")
    setSelectedFile(null)
    setProgress(0)
    setAutoProcess(true)
    setCollection("")
    setError("")
  }

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    // Move to next step automatically when file is selected
    setStep("upload")
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      setStep("url")
    }
  }

  const handleTypeSelect = (type: "file" | "url") => {
    setResourceType(type)
    setStep(type === "file" ? "upload" : "url")
  }

  const handleStartProcessing = () => {
    setStep("processing")

    // Simulate processing
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          setStep("complete")
          return 100
        }
        return prevProgress + 5
      })
    }, 300)
  }

  const renderStepContent = () => {
    switch (step) {
      case "type":
        return (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={`flex flex-col h-auto py-6 ${resourceType === "file" ? "border-primary" : ""}`}
                onClick={() => handleTypeSelect("file")}
              >
                <FileText className="h-10 w-10 mb-2" />
                <span className="text-lg font-medium">Upload File</span>
                <span className="text-sm text-muted-foreground mt-1">Upload a document, image, or other file</span>
              </Button>
              <Button
                variant="outline"
                className={`flex flex-col h-auto py-6 ${resourceType === "url" ? "border-primary" : ""}`}
                onClick={() => handleTypeSelect("url")}
              >
                <Globe className="h-10 w-10 mb-2" />
                <span className="text-lg font-medium">Add URL</span>
                <span className="text-sm text-muted-foreground mt-1">Import content from a web page or blog</span>
              </Button>
            </div>
          </div>
        )

      case "upload":
        return (
          <div className="space-y-6 py-4">
            <div
              className={`relative flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-semibold">File selected</h3>
                    <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>
                    Choose a different file
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-background p-3 shadow-sm">
                    <FileUp className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Drag & drop your file</h3>
                    <p className="text-sm text-muted-foreground">or click to browse (max 50MB)</p>
                  </div>
                  <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                  <Button asChild>
                    <label htmlFor="file-upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Browse Files
                    </label>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="collection">Add to Collection (Optional)</Label>
                <Select value={collection} onValueChange={setCollection}>
                  <SelectTrigger id="collection">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-process"
                  checked={autoProcess}
                  onCheckedChange={(checked) => setAutoProcess(!!checked)}
                />
                <Label htmlFor="auto-process" className="text-sm">
                  Automatically process file for AI analysis
                </Label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("type")}>
                Back
              </Button>
              <Button onClick={handleStartProcessing} disabled={!selectedFile}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue
              </Button>
            </div>
          </div>
        )

      case "url":
        return (
          <div className="space-y-6 py-4">
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Web Page or Blog URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    placeholder="https://example.com/article"
                    className="pl-9"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the URL of the web page or blog post you want to import
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="collection">Add to Collection (Optional)</Label>
                <Select value={collection} onValueChange={setCollection}>
                  <SelectTrigger id="collection">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="archive">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-process"
                  checked={autoProcess}
                  onCheckedChange={(checked) => setAutoProcess(!!checked)}
                />
                <Label htmlFor="auto-process" className="text-sm">
                  Automatically process content for AI analysis
                </Label>
              </div>
            </form>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("type")}>
                Back
              </Button>
              <Button onClick={handleStartProcessing} disabled={!url.trim()}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue
              </Button>
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {resourceType === "file" ? "Uploading and Processing" : "Fetching and Processing"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {resourceType === "file"
                  ? "Your file is being uploaded and processed. This may take a moment."
                  : "The content is being fetched and processed. This may take a moment."}
              </p>
              <div className="w-full max-w-md mb-2">
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">{progress}% complete</p>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {resourceType === "file" ? "File Uploaded Successfully" : "URL Content Added Successfully"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {resourceType === "file"
                  ? `Your file "${selectedFile?.name}" has been uploaded and ${
                      autoProcess ? "processed" : "added"
                    } to your resources.`
                  : `The content from "${url}" has been ${autoProcess ? "processed" : "added"} to your resources.`}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={resetState}>
                  Add Another
                </Button>
                <Button onClick={handleClose}>Done</Button>
              </div>
            </div>
          </div>
        )

      case "error":
        return (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-100 p-4 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Something Went Wrong</h3>
              <p className="text-sm text-muted-foreground mb-2">{error || "An unexpected error occurred."}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Please try again or contact support if the issue persists.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={resetState}>
                  Try Again
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose()
        } else {
          onOpenChange(true)
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
          <DialogDescription>
            {step === "type" && "Choose the type of resource you want to add."}
            {step === "upload" && "Upload a file to your resources."}
            {step === "url" && "Add content from a web page or blog."}
            {step === "processing" && "Processing your resource..."}
            {step === "complete" && "Your resource has been added successfully."}
            {step === "error" && "There was an error adding your resource."}
          </DialogDescription>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  )
}
