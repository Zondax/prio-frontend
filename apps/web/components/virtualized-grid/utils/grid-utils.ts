import { cn } from '@/lib/utils'

import type { SpacingValues } from '../types'

/**
 * Get spacing values in pixels from various input formats (number, string, or object)
 */
export function getSpacingValues(spacing?: number | string | { x?: number | string; y?: number | string }): SpacingValues {
  // Default spacing value: gap-6 = 24px
  const DEFAULT_SPACING = 24

  if (spacing === undefined) {
    return { horizontalSpacing: DEFAULT_SPACING, verticalSpacing: DEFAULT_SPACING }
  }

  // Handle number input (px value)
  if (typeof spacing === 'number') {
    return { horizontalSpacing: spacing, verticalSpacing: spacing }
  }

  // Handle string input (Tailwind class)
  if (typeof spacing === 'string') {
    // Convert Tailwind spacing class to pixels (e.g. "4" becomes 16px)
    const pixelValue = Number.parseInt(spacing) * 4
    return { horizontalSpacing: pixelValue, verticalSpacing: pixelValue }
  }

  // Handle object input (separate x and y values)
  const horizontalValue = spacing.x ?? DEFAULT_SPACING / 4
  const verticalValue = spacing.y ?? DEFAULT_SPACING / 4

  // Convert values to pixels
  const horizontalSpacing = typeof horizontalValue === 'string' ? Number.parseInt(horizontalValue) * 4 : horizontalValue
  const verticalSpacing = typeof verticalValue === 'string' ? Number.parseInt(verticalValue) * 4 : verticalValue

  // If only x is provided, use DEFAULT_SPACING for verticalSpacing
  if (spacing.x !== undefined && spacing.y === undefined) {
    return { horizontalSpacing, verticalSpacing: DEFAULT_SPACING }
  }

  // If only y is provided, use DEFAULT_SPACING for horizontalSpacing
  if (spacing.y !== undefined && spacing.x === undefined) {
    return { horizontalSpacing: DEFAULT_SPACING, verticalSpacing }
  }

  return { horizontalSpacing, verticalSpacing }
}

/**
 * Generate grid column class based on the number of columns
 */
export function getGridColumnClasses(numColumns: number): string {
  const cols = Math.max(1, Math.floor(numColumns))
  // Return specific, full static strings for Tailwind JIT to reliably find.
  // Add more cases if grids can exceed 12 columns, though up to 8 is in tests.
  switch (cols) {
    case 1:
      return 'grid grid-cols-1'
    case 2:
      return 'grid grid-cols-2'
    case 3:
      return 'grid grid-cols-3'
    case 4:
      return 'grid grid-cols-4'
    case 5:
      return 'grid grid-cols-5'
    case 6:
      return 'grid grid-cols-6'
    case 7:
      return 'grid grid-cols-7'
    case 8:
      return 'grid grid-cols-8'
    case 9:
      return 'grid grid-cols-9'
    case 10:
      return 'grid grid-cols-10'
    case 11:
      return 'grid grid-cols-11'
    case 12:
      return 'grid grid-cols-12'
    default:
      // Fallback for > 12, though Tailwind might not have these by default without safelisting patterns
      // or if your config only supports up to 12.
      // For safety, cap at 12 or return a known good default if that makes sense.
      console.warn(`[getGridColumnClasses] Unexpected column count: ${cols}. Defaulting to grid-cols-1.`)
      return 'grid grid-cols-1' // Or handle as an error, or ensure your safelist covers it.
  }
}
