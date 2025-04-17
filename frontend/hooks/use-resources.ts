"use client"

import { useState, useEffect } from "react"
import type { Resource, ResourceFilter } from "@/types/resources"

export function useResources(
  initialFilters: ResourceFilter = {
    collections: [],
    tags: [],
    fileTypes: [],
    dateRanges: [],
  },
) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ResourceFilter>(initialFilters)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchResources() {
      setIsLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams()

        if (searchQuery) {
          params.append("query", searchQuery)
        }

        if (filters.collections.length > 0) {
          filters.collections.forEach((collection) => {
            params.append("collection", collection)
          })
        }

        if (filters.tags.length > 0) {
          filters.tags.forEach((tag) => {
            params.append("tag", tag)
          })
        }

        if (filters.fileTypes.length > 0) {
          filters.fileTypes.forEach((type) => {
            params.append("type", type)
          })
        }

        // Fetch resources from API
        const response = await fetch(`/api/resources?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch resources")
        }

        const data = await response.json()
        setResources(data.resources)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [filters, searchQuery])

  return {
    resources,
    isLoading,
    error,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  }
}
