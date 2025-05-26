'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface ShareDialogSkeletonContentProps {
  title?: string
}

export function ShareDialogSkeletonContent({ title }: ShareDialogSkeletonContentProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="mb-4">
        {/* Replace DialogTitle with a Skeleton */}
        <Skeleton className="h-6 w-3/4" />
        {title && <span className="sr-only">Loading share options for {title}</span>}
      </div>

      {/* Invite people section skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-2/5" />
      </div>

      {/* People with access section skeleton */}
      <div className="space-y-3 pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={`skeleton-person-item-${i}`} className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* General access section skeleton */}
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-1/3 mb-1" />
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full mt-1" /> {/* Icon placeholder */}
          <div className="flex-1 space-y-1">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Footer Buttons Skeleton (optional, shown if canManagePermissions might be true) */}
      <div className="mt-6 flex justify-end gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  )
}
