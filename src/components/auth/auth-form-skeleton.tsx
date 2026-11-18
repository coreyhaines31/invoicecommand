import { Skeleton } from '@/components/ui/skeleton'

// Placeholder for auth forms that render client-side (they read the URL's
// search params), so the page keeps its shape instead of jumping when they load.
export function AuthFormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading form">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
