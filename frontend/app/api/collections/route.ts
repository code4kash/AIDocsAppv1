import { NextResponse } from "next/server"
import type { Collection } from "@/types/collections"

export async function GET() {
  // Mock data - would be replaced with DynamoDB queries in production
  const collections: Collection[] = [
    { id: "work", name: "Work", count: 12 },
    { id: "research", name: "Research", count: 8 },
    { id: "articles", name: "Articles", count: 5 },
    { id: "design", name: "Design", count: 7 },
  ]

  return NextResponse.json({ collections })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, parentId } = body

    // In production, this would create a new collection in DynamoDB

    return NextResponse.json({
      success: true,
      collection: {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        count: 0,
        parentId: parentId || null,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 })
  }
}
