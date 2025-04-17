import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function GeneratedLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[60px]" />
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[80px]" />
            <Skeleton className="h-10 w-[60px]" />
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-8 w-[60px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
