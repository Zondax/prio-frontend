import { FilterTagType } from '@mono-state/stores/event'
import { Calendar, Clock, MapPin, Sparkles, Star } from 'lucide-react-native'
import type React from 'react'

/**
 * Get the appropriate icon component for a filter tag type
 * @param type The filter tag type
 * @returns React node with the icon component
 */
export const getFilterTagIcon = (type: FilterTagType): React.ReactNode => {
  switch (type) {
    case FilterTagType.FILTER_TAG_TYPE_LOCATION:
      return <MapPin size={12} className="text-blue-800 dark:text-blue-300" />
    case FilterTagType.FILTER_TAG_TYPE_TIME:
      return <Clock size={12} className="text-purple-800 dark:text-purple-300" />
    case FilterTagType.FILTER_TAG_TYPE_DATE:
      return <Calendar size={12} className="text-amber-800 dark:text-amber-300" />
    case FilterTagType.FILTER_TAG_TYPE_CATEGORY:
      return <Sparkles size={12} className="text-emerald-800 dark:text-emerald-300" />
    case FilterTagType.FILTER_TAG_TYPE_KEYWORD:
      return <Star size={12} className="text-gray-800 dark:text-gray-300" />
    default:
      return <Sparkles size={12} className="text-gray-800 dark:text-gray-300" />
  }
}

/**
 * Map of filter tag types to their corresponding color classes
 * TODO: When we move to filter-management package, the colors are not displayed correctly.
 * We need to define them previously, so Tailwind generate all of the css classes.
 * https://tailwindcss.com/docs/detecting-classes-in-source-files
 * Investigate how we can fix this.
 */
export const filterTagColorMap: Record<string, string> = {
  [FilterTagType.FILTER_TAG_TYPE_LOCATION]: 'flag-blue',
  [FilterTagType.FILTER_TAG_TYPE_TIME]: 'flag-purple',
  [FilterTagType.FILTER_TAG_TYPE_DATE]: 'flag-amber',
  [FilterTagType.FILTER_TAG_TYPE_CATEGORY]: 'flag-emerald',
  [FilterTagType.FILTER_TAG_TYPE_KEYWORD]: 'flag-gray',
  [FilterTagType.FILTER_TAG_TYPE_UNSPECIFIED]: 'flag-gray',
}

/**
 * Get the color class for a filter tag type
 * @param type The filter tag type
 * @returns The corresponding color class or a default if not found
 */
export const getFilterTagColor = (type: FilterTagType): string => {
  return filterTagColorMap[type] || 'flag-gray'
}
