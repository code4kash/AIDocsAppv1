// This utility helps manage resource context between pages

// Store the currently selected resource for chat
let selectedResourceForChat: number | null = null

export function setResourceForChat(resourceId: number | null) {
  selectedResourceForChat = resourceId
}

export function getResourceForChat() {
  const resource = selectedResourceForChat
  // Clear after getting to prevent stale data
  selectedResourceForChat = null
  return resource
}

// Format URL for chat with resource
export function getChatUrlWithResource(resourceId: number) {
  return `/chat?resource=${resourceId}&newChat=true`
}
