import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface EventCardSkeletonProps {
  isCompact?: boolean
  colSpan?: number
}

export function EventCardSkeleton({ isCompact = false, colSpan = 1 }: EventCardSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden flex flex-col h-full relative rounded-md w-full', `col-span-${colSpan}`)} data-colspan={colSpan}>
      <div className={cn('relative w-full overflow-hidden rounded-t-lg', isCompact ? 'h-32' : 'h-48')}>
        <Skeleton className="h-full w-full" />
        {colSpan > 1 && (
          <div className="absolute left-4 top-4 flex gap-2">
            <Skeleton className="h-5 w-20 rounded-sm" />
          </div>
        )}
        <div className="absolute right-4 top-4">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      <div className={cn('px-4 pt-4 w-full min-h-[2em]', isCompact && 'p-3')}>
        <Skeleton className={cn('mb-1', isCompact ? 'h-4 w-11/12' : 'h-5 w-11/12')} />
        <Skeleton className={cn(isCompact ? 'h-4 w-3/4' : 'h-5 w-3/4')} />
      </div>

      <div className={cn('px-4 pt-2 flex-grow w-full', isCompact && 'px-3 pt-1')}>
        <Skeleton className={cn('mb-1', isCompact ? 'h-3 w-full' : 'h-4 w-full')} />
        <Skeleton className={cn('mb-1', isCompact ? 'h-3 w-5/6' : 'h-4 w-5/6')} />
        <Skeleton className={cn(isCompact ? 'h-3 w-4/6' : 'h-4 w-4/6')} />
      </div>

      <div className={cn('px-4 pt-3 pb-4 mt-auto w-full', isCompact && 'px-3 py-2')}>
        <div className="space-y-2 text-sm w-full">
          <div className="flex items-center w-full">
            <Skeleton className="mr-2 h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {(colSpan > 1 || !isCompact) && (
            <div className="flex items-center w-full">
              <Skeleton className="mr-2 h-4 w-4 shrink-0" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
