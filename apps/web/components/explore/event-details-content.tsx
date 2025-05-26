'use client'

import { extractEventData } from '@prio-state'
import { createEventMapMarker } from '@prio-state/feature/map'
import type { Event, EventDetailState } from '@prio-state/stores/event'
import { formatText, getGoogleMapsLink } from '@prio-state/utils'
import { Calendar, Clock, ExternalLink, MapPin, Share2 } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { SheetTitle } from '@/components/ui/sheet' // Keep SheetTitle for consistency if needed, or remove if title is passed differently
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import type { SelectionProps } from './event-card'
import { EventDetailsMap } from './event-preview-map'
import { PinButton } from './pin-button'

import { hashString } from '../../lib/utils'

interface EventDetailsContentProps {
  eventDetailState: EventDetailState | null
  isPinned?: boolean
  onPinToggle?: (event: Event) => void
  showPinButtons?: boolean
  selection?: SelectionProps
}

export function EventDetailsContent({
  eventDetailState,
  isPinned = false,
  onPinToggle,
  showPinButtons = true,
  selection,
}: EventDetailsContentProps) {
  if (!eventDetailState) return null

  const { event, isLoading } = eventDetailState

  // Show skeleton loader when event is loading
  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-between">
          <SheetTitle className="sr-only">Loading event details</SheetTitle>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="flex-1 space-y-6 py-6">
          <Skeleton className="h-72 w-72 rounded-lg mx-auto" />

          <div className="grid gap-4 text-sm">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 mx-2" />
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
      </>
    )
  }

  if (!event) return null

  const { id, title, description, date, time, coordinates, location, imageUrl, sourceName, sourceUrl } = extractEventData(event)

  const eventMarker = createEventMapMarker(event)
  const markers = eventMarker ? [eventMarker] : []
  const center = eventMarker
    ? ([eventMarker.getCoordinates()?.getLongitude() || 0, eventMarker.getCoordinates()?.getLatitude() || 0] as [number, number])
    : undefined

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPinToggle) {
      onPinToggle(event)
    }
  }

  const shouldShowPinButtons = showPinButtons && !!selection && !!onPinToggle

  return (
    <>
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="line-clamp-2 max-w-full">
                {/* Use a regular h2 or similar for title, or pass SheetTitle as a prop if needed */}
                <h2 className="text-2xl font-bold line-clamp-2">{title}</h2>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs text-wrap max-h-[90dvh]">{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!imageUrl && shouldShowPinButtons && selection && (
          <PinButton isPinned={isPinned} eventId={id} onPinToggle={handlePinToggle} showDropdown={true} selection={selection} />
        )}
      </div>

      <div className="flex-1 space-y-6 py-6">
        {imageUrl && (
          <div className="relative w-fit mx-auto flex justify-center">
            <img src={imageUrl} alt={title} className="relative h-72 w-72 rounded-lg object-cover z-0" />
            {shouldShowPinButtons && selection && (
              <PinButton
                isPinned={isPinned}
                eventId={id}
                onPinToggle={handlePinToggle}
                className="absolute right-4 top-4 z-10"
                showDropdown={true}
                selection={selection}
              />
            )}
          </div>
        )}

        <div className="grid gap-4 text-sm">
          {date && time && (
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="font-medium">{date}</span>
              <span className="mx-2">·</span>
              <Clock className="mr-2 h-4 w-4" />
              <span>{time}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 shrink-0" />
              <a
                href={getGoogleMapsLink(location)}
                className="hover:underline text-brand-horizon"
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </div>
          )}
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <a
                href={sourceUrl}
                className="hover:underline text-brand-horizon flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                From {sourceName}
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="mx-2">·</span>
              <button
                type="button"
                className="hover:underline text-brand-horizon flex items-center gap-1"
                onClick={() => {
                  // TODO: Add your share event logic here
                }}
              >
                Share Event
                <Share2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">About this event</h3>
          <div className="text-sm leading-relaxed text-muted-foreground">
            {formatText(description).map((text) => (
              <p key={`event-${id}-desc-paragraph-${hashString(text)}`} className="mb-4">
                {text}
              </p>
            ))}
          </div>
        </div>

        {location && (
          <div className="space-y-2">
            <h3 className="font-semibold">Location</h3>
            <div className="relative h-64 w-full overflow-hidden rounded-lg border">
              {coordinates && <EventDetailsMap markers={markers} center={center} height="100%" zoom={14} />}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
