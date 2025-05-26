# VirtualizedGrid Component

The `VirtualizedGrid` is a React component designed for efficiently rendering large, scrollable grids of items. It leverages virtualization to ensure good performance by only rendering items currently visible in the viewport (plus an overscan buffer).

## Core Features

- **Row Virtualization**: Uses `@tanstack/react-virtual` to render only visible rows, significantly improving performance for large datasets.
- **Responsive Column Layout**:
  - Supports defining different numbers of columns for various screen breakpoints (`sm`, `md`, `lg`) via the `layoutConfig.columnConfig` prop.
  - Dynamically adjusts the number of columns based on the container's width using `ResizeObserver` and the `useColumns` hook.
- **Item Spanning (Column Spanning)**:
  - Individual grid items can span multiple columns by specifying a `colSpan` property in their data.
  - The `useItemChunks` hook intelligently arranges items into rows, considering their `colSpan` and attempting to fill small gaps with a lookahead mechanism for denser layouts.
- **Infinite Scrolling / Load More**:
  - Supports loading more items as the user scrolls towards the end of the grid.
  - Managed by the `useLoadMore` hook, which primarily uses an `IntersectionObserver` on a sentinel element for efficient detection, with a throttled scroll listener as a fallback.
  - Configurable through `loadMore` (callback), `isLoading`, `hasMore`, and `loadMoreThreshold` props.
- **Customizable Item Rendering**:
  - Users provide a `gridRender` function for each item (`item.gridRender(itemData, index)`), allowing full control over how individual items are displayed.
- **Skeleton Loaders**:
  - Supports displaying skeleton loaders via the `renderSkeleton` prop while items are loading (e.g., during infinite scroll or initial load).
- **Empty State**:
  - Allows rendering a custom component (`emptyComponent`) when there are no items to display and the grid is not in a loading state.
- **Dynamic Spacing**:
  - Configurable horizontal and vertical spacing between grid items using the `layoutConfig.spacing` prop. This prop can accept a number (for uniform spacing), a string (Tailwind spacing unit, e.g., "4" for 16px), or an object `{ x, y }` for separate axis spacing.
- **Debugging Tools**:
  - Optional `debugConfig` prop to enable logging (`debugConfig.enabled`) and a visual grid overlay (`debugConfig.showGridVisualization`) to aid in layout debugging.

## Key Behaviors & Implementation Details

- **Hooks**:
  - `useVirtualizer` (`@tanstack/react-virtual`): Manages the virtualization of rows.
  - `useColumns`: Calculates the current number of grid columns based on container width and responsive configuration.
  - `useItemChunks`: Processes the flat list of items into an array of "chunks" (rows), respecting `colSpan` properties and trying to optimize row filling.
  - `useLoadMore`: Implements the infinite scroll logic.
- **Utilities**:
  - `getSpacingValues`: Parses the `spacing` prop into pixel values.
  - `getGridColumnClasses`: Generates responsive Tailwind CSS classes (e.g., `grid-cols-1 md:grid-cols-2`) for the row containers.
- **DOM Structure**:
  - Each virtualized row is a `div` acting as a CSS grid container.
  - The `gridRender` function's output for each item is placed directly into this row grid. It is the responsibility of the `gridRender` function to ensure its output correctly utilizes the item's `colSpan` (e.g., by applying appropriate CSS like Tailwind's `col-span-X`).
- **Performance Considerations**:
  - Memoization is used for `itemChunks` and pre-rendered items/skeletons to minimize re-renders.
  - Event handlers (resize, scroll) are throttled or use `IntersectionObserver` to avoid performance bottlenecks.

## Props Overview

- `items: GridRenderItem[]`: The array of data items to render. Each item must include a `gridRender` function and can optionally have `colSpan`.
- `renderSkeleton?: (index: number) => ReactNode`: Function to render skeleton elements.
- `emptyComponent?: ReactNode`: Component to show when `items` is empty.
- `isLoading?: boolean`: Indicates if the grid is in a loading state.
- `hasMore?: boolean`: True if more items can be loaded.
- `loadMore?: () => void`: Callback to fetch more items.
- `loadMoreThreshold?: number`: Percentage from the bottom to trigger `loadMore` (default 0.3).
- `overscanRows?: number`: Number of rows to render beyond the visible area (default 5).
- `layoutConfig?: LayoutConfig`: Object to configure columns, row height, and spacing.
  - `columnConfig?: { sm?, md?, lg? }`
  - `rowHeight?: number` (default 440)
  - `spacing?: number | string | { x?, y? }` (default 0)
- `debugConfig?: DebugConfig`: Object to enable debugging features.
  - `enabled?: boolean` (default false)
  - `showGridVisualization?: boolean` (default false)
- `className?: string`: Custom CSS class for the main grid container.

This README provides a good overview of the `VirtualizedGrid` component, its features, how it works, and how to use it.
