import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Shown while the dashboard waits on the session and invoice query. It mirrors
// the real layout so nothing jumps when the content arrives.
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4" role="status" aria-label="Loading your dashboard">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="size-9 rounded-full" />
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-72 max-w-full" />
          </div>
          <Skeleton className="h-9 w-44" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mb-8 p-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-28" />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Skeleton className="mb-6 h-6 w-36" />
          <Skeleton className="mb-4 h-9 w-full" />
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="hidden h-5 w-16 md:block" />
              </div>
            ))}
          </div>
        </Card>
        <span className="sr-only">Loading your dashboard</span>
      </div>
    </div>
  )
}
