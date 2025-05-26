'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { TableCell } from '@/components/ui/table'

/**
 * CollectionTableSkeleton - Component to display a loading skeleton for the collections table
 * Matches the column configuration from collections-table-columns.tsx
 */
export function CollectionTableSkeleton() {
  return (
    <>
      {/* Name column */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>

      {/* Owner column */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </TableCell>

      {/* Privacy column */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </TableCell>

      {/* Updated At column */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>

      {/* Actions column */}
      <TableCell>
        <div className="flex items-center gap-1 justify-end">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </TableCell>
    </>
  )
}
