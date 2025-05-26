'use client'

import type { Event } from '@prio-state'
import { isActivityHappeningSoon } from '@prio-state/feature/activity'
import { eventHasLocation } from '@prio-state/feature/events/utils'
import { getGoogleMapsLink } from '@prio-state/utils'
import { formatTimeWithTimezone } from '@prio-state/utils/time'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, ExternalLink, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ActivityCardProps {
  event: Event
  onEventClick: (event: Event) => void
  onEventMouseEnter?: (event: Event) => void
  onEventMouseLeave?: () => void
  className?: string
  isHovered?: boolean
}

export function ActivityCard({
  event,
  onEventClick,
  onEventMouseEnter,
  onEventMouseLeave,
  className,
  isHovered = false,
}: ActivityCardProps) {
  // Extract event data
  const title = event.getTitle()
  const description = event.getDescription()

  // Date and time information
  const date = event.getDate()
  const eventDate = date?.getStart()?.toDate()
  const eventEndDate = date?.getEnd()?.toDate()
  const localTimeZone = date?.getLocalTimezone()
  const startTime = formatTimeWithTimezone(eventDate || new Date(), localTimeZone)
  const endTime = eventEndDate ? formatTimeWithTimezone(eventEndDate, localTimeZone) : ''
  const timeFromNow = eventDate ? formatDistanceToNow(eventDate, { addSuffix: true }) : ''
  const isHappeningSoon = isActivityHappeningSoon(eventDate)

  // Location information
  const location = event.getLocation()
  const coordinates = location?.getCoordinates()
  const hasLocation = eventHasLocation(event)

  // Media and source information
  const imageUrl = event.getImage()
  const eventSource = event.getSource()
  const sourceName = eventSource?.getName() || ''
  const sourceUrl = eventSource?.getUrl() || ''

  const handlePress = () => {
    onEventClick(event)
  }

  const handleHover = () => {
    if (onEventMouseEnter) {
      onEventMouseEnter(event)
    }
  }

  const handleHoverEnd = () => {
    if (onEventMouseLeave) {
      onEventMouseLeave()
    }
  }

  return (
    <Card
      className={cn(
        'relative my-3 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]',
        isHappeningSoon && 'border-2 border-primary',
        !hasLocation && 'border-dashed border-2 bg-muted/30',
        isHovered && 'ring-2 ring-primary shadow-md',
        className
      )}
      onClick={handlePress}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      {!hasLocation && (
        <span className="absolute top-0 right-0 inline-block bg-yellow-500/80 text-xs px-1 py-0.5 rounded text-black font-medium">
          No location
        </span>
      )}
      <div className="flex p-4">
        {/* Left side: Image with time information */}
        <div className="w-[80px] mr-4 shrink-0 flex flex-col items-center">
          {/* Start time displayed above the image */}
          <div className="mb-1.5 w-full text-center">
            <span className="text-[11px] font-medium text-foreground truncate block">{startTime}</span>
          </div>

          {imageUrl ? (
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden relative">
              <Image src={imageUrl} alt={title} fill className="object-cover" />
              {isHappeningSoon && (
                <div className="absolute top-0 right-0 bg-primary px-1.5 py-0.5 rounded-bl-md">
                  <span className="text-[9px] font-bold text-primary-foreground">Soon</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden relative bg-muted flex items-center justify-center">
              <Calendar className="h-7 w-7 text-muted-foreground" />
              {isHappeningSoon && (
                <div className="absolute top-0 right-0 bg-primary px-1.5 py-0.5 rounded-bl-md">
                  <span className="text-[9px] font-bold text-primary-foreground">Soon</span>
                </div>
              )}
            </div>
          )}

          {/* End time displayed below the image */}
          {endTime && (
            <div className="mt-1.5 w-full text-center">
              <span className="text-[11px] font-medium text-foreground truncate block">{endTime}</span>
            </div>
          )}
        </div>

        {/* Right side: Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 space-y-1">
          <div>
            <h4 className={cn('text-base font-semibold text-foreground mb-1 truncate', !hasLocation && 'text-muted-foreground')}>
              {title}
            </h4>
            {description && <p className="text-[12px] text-muted-foreground mb-2.5 line-clamp-2 leading-[1.3]">{description}</p>}
          </div>

          <div className="space-y-1.5">
            {/* Location row */}
            {location && (
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5 shrink-0" />
                <Link
                  href={getGoogleMapsLink(coordinates?.toString() || '')}
                  className="text-xs text-primary hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  View location
                </Link>
              </div>
            )}

            {/* Source row */}
            {sourceUrl && (
              <div className="flex items-center">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground mr-1.5 shrink-0" />
                <Link href={sourceUrl} className="text-xs text-primary hover:underline truncate" onClick={(e) => e.stopPropagation()}>
                  {sourceName}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
