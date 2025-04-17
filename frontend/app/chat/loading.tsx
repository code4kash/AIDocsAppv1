import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ChatLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Chat Threads */}
          <Card className="lg:col-span-3">
            <CardHeader className="px-4 py-3">
              <Skeleton className="h-6 w-[120px]" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex w-full items-start gap-3 p-4">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[200px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="p-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Main Chat Area */}
          <Card className="lg:col-span-6 flex flex-col">
            <CardHeader className="px-6 py-4 border-b">
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 overflow-auto p-6 space-y-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[80%] ${i % 2 === 0 ? "flex-row-reverse" : ""}`}>
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton
                            className={`h-20 w-[250px] rounded-lg ${
                              i % 2 === 0 ? "rounded-tr-none" : "rounded-tl-none"
                            }`}
                          />
                          <Skeleton className="h-3 w-[80px] mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="border-t p-4">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-10 w-[80px]" />
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Sidebar - Knowledge Base */}
          <Card className="lg:col-span-3">
            <CardHeader className="px-4 py-3">
              <Skeleton className="h-6 w-[120px]" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-3 border-b">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="p-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <Skeleton className="h-5 w-[120px] mb-2" />
                  <div className="space-y-2 pl-4">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-sm" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      ))}
                  </div>
                </div>
                <Skeleton className="h-1 w-full" />
                <div>
                  <Skeleton className="h-5 w-[120px] mb-2" />
                  <div className="space-y-2">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-md" />
                      ))}
                  </div>
                </div>
              </div>
              <div className="p-3 border-t">
                <Skeleton className="h-4 w-[150px] mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
