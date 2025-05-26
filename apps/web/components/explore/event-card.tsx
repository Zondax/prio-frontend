'use client'

import type { FormattedEventData } from '@prio-state'
import type { Event } from '@prio-state/stores/event'
import { getGoogleMapsLink } from '@prio-state/utils'
import { Calendar, ExternalLink, MapPin, Star } from 'lucide-react'
import { type ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { EVENT_PLACEHOLDER_IMAGE_PATH } from '@/lib/images'
import { cn } from '@/lib/utils'

import { PinButton } from './pin-button'

export interface SelectionProps {
  isSelectionModeActive: boolean
  isEventSelected: (eventId: string) => boolean
  toggleEventSelection: (eventId: string) => void
  selectEvents?: (eventIds: string[]) => void
}

interface EventCardProps {
  eventData: FormattedEventData
  isPinned?: boolean
  onEventClick: (eventData: FormattedEventData) => void
  onPinToggle?: (eventData: FormattedEventData) => void
  isCompact?: boolean
  colSpan?: number
  showExternalLink?: boolean
  showPinIcon?: boolean
  selection?: SelectionProps
}

export const EventCard = forwardRef(
  (
    {
      eventData,
      onEventClick,
      onPinToggle,
      isPinned = false,
      isCompact = false,
      colSpan = 1,
      showExternalLink = false,
      showPinIcon = true,
      selection,
    }: EventCardProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [displayExternalLink, setDisplayExternalLink] = useState(showExternalLink)
    const [isCreateCollectionDialogOpen, setIsCreateCollectionDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [imageError, setImageError] = useState(false)

    // Reset search query when dropdown closes
    useEffect(() => {
      const handleClickOutside = () => {
        setSearchQuery('')
      }

      document.addEventListener('click', handleClickOutside)

      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }, [])

    const displayImageUrl = imageError || !eventData.imageUrl ? EVENT_PLACEHOLDER_IMAGE_PATH : eventData.imageUrl

    const attendees = 0
    const likes = 0
    const tags: string[] = []
    const category = 'test'

    // Randomly assign either undefined, $0 or a price between $5-$50
    // TODO: Remove this once we have a real price
    const price = useMemo(() => {
      return Math.random() > 0.3 ? 0 : Math.random() > 0.5 ? Math.floor(Math.random() * 46) + 5 : undefined
    }, [eventData.id])

    const { isSelectionModeActive = false, isEventSelected = () => false, toggleEventSelection = () => {}, selectEvents } = selection || {}

    const handleEventClick = () => {
      onEventClick(eventData)
    }

    const handleExternalLinkToggle = (e: React.MouseEvent) => {
      e.stopPropagation()
      setDisplayExternalLink(!displayExternalLink)
    }

    const handlePinToggle = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onPinToggle) {
        onPinToggle(eventData)
      }
    }

    const handleImageError = () => {
      setImageError(true)
    }

    return (
      <>
        <Card
          ref={ref}
          className={cn(
            'group cursor-pointer hover:shadow-md rounded-md transition-shadow duration-200 overflow-hidden flex flex-col h-full relative',
            `col-span-${colSpan}`
          )}
          onClick={handleEventClick}
          data-colspan={colSpan}
        >
          {/* Pinned indicator overlay */}
          {isPinned && <div className={cn('absolute inset-0 border-2 z-10 pointer-events-none rounded-md border-primary')} />}
          {/* Card Header: Image + Title */}
          <div className="flex flex-col">
            {displayImageUrl && (
              <div className={cn('relative w-full overflow-hidden', isCompact ? 'h-32' : 'h-48')}>
                <img
                  src={displayImageUrl}
                  alt={eventData.title}
                  className={cn('h-full w-full object-cover transition-all')}
                  onError={handleImageError}
                />
                <div className="absolute left-4 top-4 flex gap-2">
                  {colSpan > 1 && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" /> {colSpan === 3 ? 'Featured +' : 'Featured'}
                    </Badge>
                  )}
                </div>
                {showPinIcon && (
                  <PinButton
                    isPinned={isPinned}
                    eventId={eventData.id}
                    onPinToggle={handlePinToggle}
                    className="absolute right-4 top-4 z-10"
                    showDropdown={false}
                    selection={{ isSelectionModeActive, isEventSelected, toggleEventSelection, selectEvents }}
                  />
                )}
              </div>
            )}
            <div className={cn('px-4 pt-4', isCompact && 'p-3')}>
              <div className="flex items-start justify-between">
                <CardTitle className={cn('line-clamp-2 min-h-[2em]', isCompact && 'text-sm')}>{eventData.title}</CardTitle>
                {!displayImageUrl && showPinIcon && (
                  <div className="flex gap-2 ml-2 shrink-0">
                    <PinButton
                      isPinned={isPinned}
                      eventId={eventData.id}
                      onPinToggle={handlePinToggle}
                      showDropdown={false}
                      selection={{ isSelectionModeActive, isEventSelected, toggleEventSelection, selectEvents }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Content: Description */}
          <div className={cn('px-4 pt-2 flex-grow', isCompact && 'px-3 pt-1')}>
            <CardDescription className={cn('line-clamp-3', isCompact && 'text-xs')}>{eventData.description}</CardDescription>
          </div>

          {/* Card Footer: Metadata */}
          <div className={cn('px-4 pt-3 pb-4 mt-auto', isCompact && 'px-3 py-2')}>
            <div className="space-y-2 text-sm">
              {eventData.date && eventData.time && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4 shrink-0" />
                  {eventData.date} at {eventData.time}
                </div>
              )}
              {eventData.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 shrink-0" />
                  <a
                    href={getGoogleMapsLink(eventData.location)}
                    className="hover:underline text-clear-horizon"
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
              {/* External source link toggle */}
              {eventData.sourceUrl && displayExternalLink && (
                <div className="flex items-center text-muted-foreground">
                  <ExternalLink className="mr-2 h-4 w-4 shrink-0" />
                  <a
                    href={eventData.sourceUrl}
                    className="hover:underline text-clear-horizon"
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit {eventData.sourceName}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className={cn('text-xs text-muted-foreground/60', isCompact && 'hidden')}>
                      from{' '}
                      <a
                        href={eventData.sourceUrl}
                        className="hover:underline text-clear-horizon"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {eventData.sourceName}
                      </a>
                    </span>
                  </span>
                </div>
              </div>
              {tags.filter((tag) => tag.startsWith('type/') || tag.startsWith('tech/')).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags
                    .filter((tag) => tag.startsWith('type/') || tag.startsWith('tech/'))
                    .slice(0, isCompact ? 1 : 2)
                    .map((tag) => (
                      <Badge key={tag} variant="outline" className={cn('text-xs', 'bg-muted/50')}>
                        {tag.split('/')[1]}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </>
    )
  }
)

EventCard.displayName = 'EventCard'
