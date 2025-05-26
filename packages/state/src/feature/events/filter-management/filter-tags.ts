import { FilterTagType } from '@prio-grpc/entities/proto/api/v1/event_pb'

/**
 * Search examples with filter tags for demonstration
 */
export const SEARCH_EXAMPLES = [
  {
    text: 'Events in Paris next weekend',
    filterTags: [
      { type: FilterTagType.FILTER_TAG_TYPE_LOCATION, value: 'Paris' },
      { type: FilterTagType.FILTER_TAG_TYPE_DATE, value: 'Next weekend' },
    ],
  },
  {
    text: 'Music concerts at 8pm',
    filterTags: [
      { type: FilterTagType.FILTER_TAG_TYPE_CATEGORY, value: 'Music' },
      { type: FilterTagType.FILTER_TAG_TYPE_TIME, value: '8:00 PM' },
    ],
  },
  {
    text: 'Art exhibitions on April 15',
    filterTags: [
      { type: FilterTagType.FILTER_TAG_TYPE_CATEGORY, value: 'Art' },
      { type: FilterTagType.FILTER_TAG_TYPE_DATE, value: 'April 15' },
    ],
  },
]
