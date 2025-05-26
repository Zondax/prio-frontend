/**
 * Type definition for events UI labels
 */
export interface EventsLabels {
  title: string
  subtitle: string
  buttonLabel?: string
}

export enum EventKeys {
  NO_EVENTS = 'noEvents',
}

/**
 * Common labels for events UI components
 * Used across web and mobile platforms for consistent messaging
 */
export const eventLabels: Record<EventKeys, EventsLabels> = {
  [EventKeys.NO_EVENTS]: {
    title: 'No events found',
    subtitle: "We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.",
  },
}
