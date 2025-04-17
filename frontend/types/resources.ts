export interface Resource {
  id: number
  title: string
  type: string
  format?: string
  collection: string
  tags: string[]
  date: string
  dateAdded: string
  size?: string
  preview?: string
  url?: string
  processed?: boolean
}

export interface ResourceFilter {
  collections: string[]
  tags: string[]
  fileTypes: string[]
  dateRanges: string[]
}
