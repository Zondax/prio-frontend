import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export interface VirtualizedTableProps<TData> {
  /**
   * The data to display in the table
   */
  data: TData[]

  /**
   * Column definitions for the table
   */
  columns: ColumnDef<TData, any>[]

  /**
   * Whether the table is loading
   */
  isLoading?: boolean

  /**
   * Optional callback for when a row is selected
   */
  onRowClick?: (row: TData) => void

  /**
   * Height of each row in pixels (used for virtualization)
   */
  rowHeight?: number

  /**
   * Number of rows to render outside the visible area
   */
  overscan?: number

  /**
   * Optional sorting state to control sorting
   */
  sorting?: SortingState

  /**
   * Optional callback for when sorting changes
   */
  onSortingChange?: OnChangeFn<SortingState>

  /**
   * Optional classname for the table container
   */
  className?: string

  /**
   * Optional renderer for skeleton rows when loading
   */
  renderSkeleton?: (index: number) => ReactNode

  /**
   * Number of skeleton rows to render when loading
   */
  skeletonRowCount?: number

  /**
   * Optional height for the table. If not provided, table will take full height
   */
  tableHeight?: number
}
