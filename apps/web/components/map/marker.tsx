'use client'

import { type MapMarker, MapMarkerKind, type MarkerEvent, createSingleEventMarker } from '@prio-state'
import { RMarker } from 'maplibre-react-components'
import { useTheme } from 'next-themes'
import { useCallback, useRef, useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

interface MarkerProps {
  mapMarker: MapMarker
  index: number
  onMarkerClick?: (marker: MapMarker) => void
  isSelected?: boolean
}

interface MarkerContentProps {
  mapMarker: MapMarker
  isSelected?: boolean
  onClick: (e: React.MouseEvent) => void
}

interface GroupedMarkerProps {
  mapMarker: MapMarker
  onClick: (e: React.MouseEvent) => void
  onMarkerClick?: (marker: MapMarker) => void
}

export function Marker({ mapMarker, index, onMarkerClick, isSelected }: MarkerProps) {
  const lat = mapMarker.getCoordinates()?.getLatitude()
  const lng = mapMarker.getCoordinates()?.getLongitude()

  if (!lat || !lng) return null

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMarkerClick) {
      onMarkerClick(mapMarker)
    }
  }

  const isGrouped = mapMarker.getKind() === MapMarkerKind.MAP_MARKER_KIND_EVENT_GROUPED

  return (
    <RMarker
      key={`marker-${index}`}
      longitude={lng}
      latitude={lat}
      initialAnchor="center"
      className={cn(isGrouped ? 'z-[1]' : 'z-[2]', 'hover:z-[10]')}
    >
      {isGrouped ? (
        <GroupedMarker mapMarker={mapMarker} onClick={handleMarkerClick} onMarkerClick={onMarkerClick} />
      ) : (
        <SingleMarker mapMarker={mapMarker} isSelected={isSelected} onClick={handleMarkerClick} />
      )}
    </RMarker>
  )
}

function SingleMarker({ mapMarker, isSelected, onClick }: MarkerContentProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  const imageUrl = mapMarker.hasEvent() ? mapMarker.getEvent()?.getImage() || '' : ''
  const title = mapMarker.hasEvent() ? mapMarker.getEvent()?.getTitle() || '' : ''

  // Fix the type error by safely handling the date
  const startDate = mapMarker.hasEvent() ? mapMarker.getEvent()?.getStartDate() : null
  const time = startDate ? new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  const isHighlighted = isSelected || isHovered

  return (
    <button
      type="button"
      tabIndex={0}
      className={cn(
        'appearance-none bg-transparent border-none p-0 m-0 text-left font-normal',
        'relative rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 ease-in-out transform h-10 min-w-10',
        resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100',
        isHighlighted
          ? 'scale-105 shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-auto max-w-[150px] pr-2'
          : 'shadow-[0_2px_6px_rgba(0,0,0,0.1)] w-10 max-w-10 pr-0'
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(e as any)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar
        className={cn('w-10 h-10 border-2 shrink-0 transition-all duration-200', resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-white')}
      >
        <AvatarImage src={imageUrl} alt={title} />
      </Avatar>

      <div
        className={cn(
          'flex flex-col items-start overflow-hidden whitespace-nowrap transition-[opacity,width,max-width] duration-200 ease-in-out',
          isHighlighted ? 'opacity-100 w-auto max-w-[140px] pl-2' : 'opacity-0 w-0 max-w-0 pl-0'
        )}
      >
        <span className="text-xs font-medium text-foreground truncate max-w-full">{title}</span>
        {time && <span className="text-xs text-muted-foreground">{time}</span>}
      </div>
    </button>
  )
}

function GroupedMarker({ mapMarker, onClick, onMarkerClick }: GroupedMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  const count = mapMarker.getEventGroup()?.getEventCount() || 0
  const events = mapMarker.getEventGroup()?.getEventsIncludedList() || []
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  /**
   * Handle click on an individual event within a group
   * Creates a single event marker and passes it to the onMarkerClick handler
   */
  const handleEventClick = useCallback(
    (event: MarkerEvent, e: React.MouseEvent) => {
      e.stopPropagation()
      if (onMarkerClick) {
        // Create a single event marker and pass it to the handler
        const singleMarker = createSingleEventMarker(event, mapMarker)
        onMarkerClick(singleMarker)
      }
    },
    [mapMarker, onMarkerClick]
  )

  // Handle wheel events to prevent map zooming while scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          type="button"
          tabIndex={0}
          className={cn(
            'appearance-none bg-transparent border-none p-0 m-0 text-left font-normal',
            'relative rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-200 w-10 h-10',
            isHovered ? 'scale-110 z-10' : 'z-0'
          )}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClick(e as any)
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={cn('w-full h-full flex items-center justify-center rounded-full', isHovered ? 'bg-primary' : 'bg-primary/90')}>
            <span className="text-sm text-primary-foreground">{count}</span>
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-3 border-b">
            <h4 className="font-semibold">Events in this area</h4>
            <p className="text-xs text-muted-foreground">{count} events grouped at this location</p>
          </div>
          <div
            ref={scrollContainerRef}
            className="max-h-[200px] overflow-y-auto p-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,0,0,0.2) transparent',
            }}
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === ' ') {
                e.preventDefault()
              }
            }}
            tabIndex={-1}
          >
            {events.length > 0 ? (
              <ul className="space-y-2">
                {events.map((event) => (
                  <li key={event.getId()} className="list-none">
                    <button
                      type="button"
                      className="w-full text-left flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer appearance-none bg-transparent border-none font-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onClick={(e) => handleEventClick(event, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleEventClick(event, e as any)
                        }
                      }}
                    >
                      {event.getImage() && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={event.getImage()} alt={event.getTitle()} />
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.getTitle()}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-2 text-center text-sm text-muted-foreground">
                <p>Click to view all events in this area</p>
              </div>
            )}
          </div>
        </Card>
      </HoverCardContent>
    </HoverCard>
  )
}
