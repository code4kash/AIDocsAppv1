import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export default function ResourcesLoading() {
  return (
    <div className="flex h-full">
      {/* Left Sidebar Skeleton */}
      <div className="hidden md:block w-64 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[80px]" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-5 w-[30px] rounded-full" />
                </div>
              ))}
          </div>
          <Skeleton className="h-1 w-full" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="h-5 w-[30px] rounded-full" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Skeleton className="h-10 w-[180px]" />
                  <Skeleton className="h-4 w-[300px] mt-2" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-[60px]" />
                      <Skeleton className="h-10 w-[80px]" />
                      <Skeleton className="h-10 w-[60px]" />
                      <Skeleton className="h-10 w-[60px]" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                  </div>

                  <Skeleton className="h-10 w-full mb-6" />

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i}>
                          <CardHeader className="p-4 pb-0">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-sm" />
                                <Skeleton className="h-5 w-[150px]" />
                              </div>
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <Skeleton className="h-[120px] w-full rounded-md" />
                          </CardContent>
                          <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
                            <div className="flex gap-2">
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-5 w-16 rounded-full" />
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="flex w-full items-center justify-between">
                              <Skeleton className="h-4 w-[80px]" />
                              <Skeleton className="h-8 w-[60px]" />
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Right Sidebar Skeleton */}
                <div className="md:w-64 border-l">
                  <div className="p-4 border-b">
                    <Skeleton className="h-6 w-[100px]" />
                  </div>
                  <div className="p-4 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-[120px]" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                      <div className="pl-6 space-y-2 mt-2">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-sm" />
                                <Skeleton className="h-5 w-[100px]" />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <Skeleton className="h-1 w-full" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-[80px]" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array(8)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton key={i} className="h-6 w-[80px] rounded-full" />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
