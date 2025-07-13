import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import type { BreadcrumbDataItem } from '@zondax/ui-common/client'
import { HOME_BREADCRUMB, prioRouteConfig } from './breadcrumb-config'

export function useBreadcrumbData(): BreadcrumbDataItem[] {
  const pathname = usePathname()

  return useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbDataItem[] = [HOME_BREADCRUMB]

    // Skip base path segment and process the rest
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      const nextSegment = pathSegments[i + 1]

      // Find route configuration for this segment
      const routeConfig = prioRouteConfig.segments.find((config) => config.segment === segment)

      if (!routeConfig) continue

      if (nextSegment && routeConfig.resolver) {
        // Entity-specific page (e.g., /goals/123)
        const entityItem = routeConfig.resolver(nextSegment)
        if (entityItem) {
          // Add parent context if available
          if (routeConfig.parentResolver) {
            const parentItem = routeConfig.parentResolver(nextSegment)
            if (parentItem) {
              items.push(parentItem)
            }
          }

          items.push(entityItem)
          i++ // Skip the ID segment
        } else {
          // Entity not found, just show category page
          items.push({
            label: routeConfig.label,
            href: `${prioRouteConfig.basePath}/${segment}`,
          })
        }
      } else {
        // Category page (e.g., /goals)
        items.push({
          label: routeConfig.label,
          href: `${prioRouteConfig.basePath}/${segment}`,
        })
      }
    }

    return items
  }, [pathname])
}
