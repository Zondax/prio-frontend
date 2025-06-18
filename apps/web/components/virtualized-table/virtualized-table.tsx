'use client'

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { Skeleton } from '../ui/skeleton'
import type { VirtualizedTableProps } from './types'

/**
 * VirtualizedTable - A table component that uses virtualization for efficiently rendering large datasets
 * Based on TanStack Virtual and TanStack Table
 * TODO: add support for pagination
 */
export default function VirtualizedTable<TData>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  rowHeight = 50,
  overscan = 10,
  sorting = [],
  onSortingChange,
  className,
  renderSkeleton,
  skeletonRowCount = 10,
  tableHeight,
}: VirtualizedTableProps<TData>) {
  // Create a ref for the scrolling container
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 50,
      size: 150,
    },
  })

  // Get the rows from the table
  const { rows } = table.getRowModel()

  // Create a virtualizer for the rows
  const virtualizer = useVirtualizer({
    count: isLoading ? skeletonRowCount : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  })

  // Get the virtualized items
  const virtualRows = virtualizer.getVirtualItems()

  // Calculate the total size of the table
  const totalSize = virtualizer.getTotalSize()

  // Render the loading skeleton if needed
  const renderSkeletonRow = (index: number) => {
    if (renderSkeleton) {
      return renderSkeleton(index)
    }

    // Default skeleton renderer that uses column information
    return table.getHeaderGroups().map((headerGroup) => {
      return headerGroup.headers.map((header) => {
        // Default column with icon + text layout
        return (
          <TableCell key={`skeleton-cell-${header.id}`}>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className={'h-4 w-[50%]'} />
            </div>
          </TableCell>
        )
      })
    })
  }

  // Render the sorting icon based on column sorting state
  const renderSortingIcon = (isSorted: false | 'asc' | 'desc') => {
    if (isSorted === 'asc') {
      return <ChevronUp className="h-4 w-4" />
    }
    if (isSorted === 'desc') {
      return <ChevronDown className="h-4 w-4" />
    }
    return <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div
      ref={parentRef}
      className={cn('w-full overflow-auto', className)}
      style={{
        height: tableHeight ? `${tableHeight}px` : '100%',
        position: 'relative',
      }}
    >
      <div style={{ height: `${totalSize}px`, width: 'fit-content', minWidth: '100%' }}>
        <Table className="relative">
          <TableHeader className="sticky top-0 z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        position: 'relative',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={cn('flex items-center gap-1', header.column.getCanSort() && 'cursor-pointer select-none')}
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={header.column.getCanSort() ? `Sort by ${header.column.columnDef.header}` : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <span className="ml-1">{renderSortingIcon(header.column.getIsSorted())}</span>}
                        </button>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {virtualRows.map((virtualRow, index) => {
              const row = isLoading ? null : rows[virtualRow.index]

              return (
                <TableRow
                  key={virtualRow.key}
                  onClick={row ? () => onRowClick?.(row.original) : undefined}
                  className={cn(row && onRowClick && 'cursor-pointer')}
                  data-state={row?.getIsSelected() ? 'selected' : undefined}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                    width: '100%',
                  }}
                >
                  {isLoading
                    ? renderSkeletonRow(virtualRow.index)
                    : row
                        ?.getVisibleCells()
                        .map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
