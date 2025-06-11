import { expect, test } from '@playwright/test'
import type { Locator } from '@playwright/test'

// Helper function to extract the pixel value from variant names like "XS (max-w-xs / 320px)"
function getExpectedMaxWidth(variantName: string): number | null {
  const match = variantName.match(/\/ (\d+)px\)/)
  return match?.[1] ? Number.parseInt(match[1], 10) : null
}

// Helper function to create a data-testid friendly string from variant name
function getVariantTestId(variantName: string): string {
  return `variant-container-${variantName.replace(/[^a-zA-Z0-9_\\-]/g, '-').replace(/--+/g, '-')}`
}

const Y_TOLERANCE_SAME_ROW = 10

// Helper function to get bounding boxes for a specified number of items
async function getBoundingBoxesForItems(
  variantName: string,
  itemsLocator: Locator,
  numberOfItems: number
): Promise<(null | { x: number; y: number; width: number; height: number })[]> {
  const boundingBoxes: (null | { x: number; y: number; width: number; height: number })[] = []
  if (numberOfItems === 0) {
    console.log(`[${variantName}] No items requested for bounding box inspection.`)
    return boundingBoxes
  }
  for (let i = 0; i < numberOfItems; i++) {
    const currentItem = itemsLocator.nth(i)
    // Ensure item is visible before getting its bounding box
    await expect(currentItem, `Item ${i + 1} for ${variantName} should be visible before getting bounding box.`).toBeVisible()
    const bbox = await currentItem.boundingBox()
    boundingBoxes.push(bbox)
  }
  return boundingBoxes
}

test.describe('View Grid Page', () => {
  // Navigate to the page before running the tests
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/ui/view-grid')
  })

  // Check for the main heading once
  test('should display the main heading', async ({ page }) => {
    const heading = page.locator('h1:has-text("Grid View")')
    await expect(heading).toBeVisible()
  })

  // REVIEW: Please verify the expectedCols for each variant.
  // These are estimates based on container width minus assumed padding, divided by itemMinWidth (150px).
  const variantsToTest = [
    { name: 'XS (max-w-xs / 320px)', expectedItems: true, expectedCols: 2 },
    { name: 'SM (max-w-sm / 384px)', expectedItems: true, expectedCols: 2 },
    { name: 'MD (max-w-md / 448px)', expectedItems: true, expectedCols: 2 },
    { name: 'LG (max-w-lg / 512px)', expectedItems: true, expectedCols: 3 },
    { name: 'XL (max-w-xl / 576px)', expectedItems: true, expectedCols: 3 },
    { name: '2XL (max-w-2xl / 672px)', expectedItems: true, expectedCols: 4 },
    { name: '3XL (max-w-3xl / 768px)', expectedItems: true, expectedCols: 5 },
    { name: '4XL (max-w-4xl / 896px)', expectedItems: true, expectedCols: 5 },
    { name: '5XL (max-w-5xl / 1024px)', expectedItems: true, expectedCols: 6 },
    { name: '6XL (max-w-6xl / 1152px)', expectedItems: true, expectedCols: 7 },
    { name: '7XL (max-w-7xl / 1280px)', expectedItems: true, expectedCols: 8 },
  ]

  for (const variant of variantsToTest) {
    test(`display grid items [${variant.name}]`, async ({ page }) => {
      // Use the new data-testid for the variant container
      const variantTestId = getVariantTestId(variant.name)
      const variantContainer = page.locator(`[data-testid="${variantTestId}"]`)
      await expect(variantContainer).toBeVisible() // Check if the main container for the scenario is visible

      // The VirtualizedGrid component is a child of the variantContainer.
      // It's the element that will have data-container-width and data-num-columns.
      // We assume it's the first direct child div, or we might need a more specific selector if the DOM is more complex.
      const virtualizedGridElement = variantContainer.locator('> div').first() // Assuming it's a direct child div

      // The actual content is inside a child div that has the 'container' class and width constraints.
      // This is used for max-width check.
      const constrainedContentWrapper = variantContainer.locator('div.container')
      await expect(constrainedContentWrapper).toBeVisible()

      const expectedMaxWidth = getExpectedMaxWidth(variant.name)
      if (expectedMaxWidth !== null) {
        const boundingBox = await constrainedContentWrapper.boundingBox() // Check width on the div with max-w-*
        expect(boundingBox).not.toBeNull()
        const actualWidth = await constrainedContentWrapper.evaluate((node) => (node as HTMLElement).offsetWidth)
        expect(actualWidth).toBeGreaterThan(0)
        expect(actualWidth).toBeLessThanOrEqual(expectedMaxWidth + 10)
      }

      if (variant.expectedItems) {
        const itemSelector = '[data-testid^="grid-item-"]' // Use data-testid for items
        const allVisibleItems = constrainedContentWrapper.locator(itemSelector) // Items are within the constrained wrapper
        const N = variant.expectedCols

        if (variant.name === '2XL (max-w-2xl / 672px)') {
          console.log(`[PAUSING TEST for ${variant.name}] Inspect the DOM now.`)
          await page.pause()
        }

        if (N > 0) {
          const itemsToInspectCount = Math.min(await allVisibleItems.count(), 2 * N) // Inspect up to 2N items

          if (itemsToInspectCount === 0) {
            console.log(`[${variant.name}] No items found to inspect.`)
          } else {
            const itemBoundingBoxes = await getBoundingBoxesForItems(variant.name, allVisibleItems, itemsToInspectCount)
            console.log(
              `[${variant.name}] Bounding boxes for the first ${itemsToInspectCount} items:`,
              JSON.stringify(itemBoundingBoxes, null, 2)
            )

            // Perform checks based on bounding box y coordinates
            const item1_bbox = itemBoundingBoxes[0]
            if (!item1_bbox) {
              throw new Error(`[${variant.name}] Bounding box for item 1 is null.`)
            }
            const item1_y = item1_bbox.y
            console.log(`[${variant.name}] Item 1 (Y: ${item1_y})`)

            // Check items from 2 to N are on the same row as item1
            for (let i = 1; i < N; i++) {
              if (i < itemBoundingBoxes.length) {
                const currentItem_bbox = itemBoundingBoxes[i]
                if (!currentItem_bbox) {
                  throw new Error(`[${variant.name}] Bounding box for item ${i + 1} is null.`)
                }
                const currentItem_y = currentItem_bbox.y
                console.log(`[${variant.name}] Item ${i + 1} (Y: ${currentItem_y})`)
                expect(
                  Math.abs(currentItem_y - item1_y),
                  `REVIEW: For ${variant.name} (expecting ${N} cols), item ${i + 1} (Y: ${currentItem_y}) should be on the same row as item 1 (Y: ${item1_y}).`
                ).toBe(0)
              } else {
                console.warn(
                  `[${variant.name}] Not enough items to check item ${i + 1} for same row (inspected: ${itemBoundingBoxes.length})`
                )
                break // Stop if we don't have enough items
              }
            }

            // Check if item N+1 is on a new row
            if (itemBoundingBoxes.length > N) {
              const itemNplus1_bbox = itemBoundingBoxes[N]
              if (!itemNplus1_bbox) {
                throw new Error(`[${variant.name}] Bounding box for item ${N + 1} is null.`)
              }
              const itemNplus1_y = itemNplus1_bbox.y
              console.log(`[${variant.name}] Item ${N + 1} (Y: ${itemNplus1_y}) - (expected new row)`)
              expect(
                itemNplus1_y,
                `[${variant.name}] (expecting ${N} cols), item ${N + 1} (Y: ${itemNplus1_y}) should be on a new row below item 1 (Y: ${item1_y}).`
              ).toBeGreaterThan(item1_y)
            } else if (30 > N && itemsToInspectCount < N + 1) {
              console.warn(
                `For ${variant.name} (expecting ${N} cols): Only ${itemBoundingBoxes.length} items inspected, couldn't check item ${N + 1}. More items might exist in dataset.`
              )
            }
          }
        }
      } else {
        await expect(constrainedContentWrapper.locator('[data-testid^="grid-item-"]').first()).not.toBeVisible()
      }
    })
  }
})
