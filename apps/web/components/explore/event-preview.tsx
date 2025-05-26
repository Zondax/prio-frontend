'use client'

import { extractEventData } from '@prio-state'
import type { Event, EventDetailState } from '@prio-state/stores/event'

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import type { SelectionProps } from './event-card'
import { EventDetailsContent } from './event-details-content'

interface EventDetailsProps {
  eventDetailState: EventDetailState | null
  onClose: () => void
  isPinned?: boolean
  onPinToggle?: (event: Event) => void
  showPinButtons?: boolean
  selection?: SelectionProps
}

export function EventDetailsPreview({
  eventDetailState,
  onClose,
  isPinned = false,
  onPinToggle,
  showPinButtons = true,
  selection,
}: EventDetailsProps) {
  if (!eventDetailState) return null

  const { isLoading, event } = eventDetailState

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto flex flex-col h-full">
        <SheetHeader>
          {isLoading ? (
            <div className="flex items-center justify-between">
              <SheetTitle className="sr-only">Loading event details</SheetTitle>
              <Skeleton className="h-8 w-3/4" />
              {showPinButtons && selection && <Skeleton className="h-8 w-8 rounded-md" />}
            </div>
          ) : event ? (
            <SheetTitle className="sr-only">{extractEventData(event).title}</SheetTitle>
          ) : null}
        </SheetHeader>

        <EventDetailsContent
          eventDetailState={eventDetailState}
          isPinned={isPinned}
          onPinToggle={onPinToggle}
          showPinButtons={showPinButtons}
          selection={selection}
        />

        {isLoading && (
          <SheetFooter className="shrink-0">
            <div className="flex gap-2 w-full">
              <Skeleton className="h-10 w-full" />
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
