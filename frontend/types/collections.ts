export interface Collection {
  id: string
  name: string
  count: number
  parentId?: string | null
  subfolders?: Collection[]
}
