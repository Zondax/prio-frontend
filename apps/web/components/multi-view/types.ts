export type { GridRenderItem } from '../virtualized-grid/types'
import type { GridRenderItem as GridRenderItemType } from '../virtualized-grid/types'

export type LoadMoreCallback = () => void

// Move to map component
interface MapMarkerItem {
  dummy: string
}

export type MultiGridRenderItem = GridRenderItemType & MapMarkerItem
