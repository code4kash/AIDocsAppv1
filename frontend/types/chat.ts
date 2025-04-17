export interface ChatMessage {
  id: number
  sender: "user" | "ai" | "system"
  content: string
  timestamp: string
  attachment?: {
    url: string
    alt: string
  }
  usedResources?: number[]
  resources?: any[] // For system messages that reference resources
}

export interface ChatThread {
  id: number
  title: string
  lastMessage: string
  timestamp: string
  unread: boolean
}
