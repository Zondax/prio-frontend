import type { Activity } from '@prio-state'
import { formatTimeWithDayIndicator, sortTransportsByDuration } from '@prio-state/feature/activity'
import type { TransportInfo } from '@prio-state/feature/activity/transportUtils'
import { getGoogleMapsLink } from '@prio-state/utils'
import type React from 'react'
import { useMemo } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TRANSPORT_ICONS } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

import { useTimelineLayout } from './timeline-layout-context'

interface Position {
  startY: number
  endY: number
}

interface TravelTimeBlockProps {
  position: Position
  transports: TransportInfo[]
  formatTime: (minutes: number) => string
  localTimezone?: string
  destinationActivity?: Activity
  sourceId?: string
  destinationId?: string
  sourceIndex?: number
  destinationIndex?: number
}

export const TravelTimeBlock: React.FC<TravelTimeBlockProps> = ({
  position: { startY, endY },
  transports,
  formatTime,
  localTimezone,
  destinationActivity,
  sourceId,
  destinationId,
  sourceIndex = 0,
  destinationIndex = 1,
}) => {
  const { columnWidth, columnGap, topOffset } = useTimelineLayout()

  // Check if we have any valid transport options
  const hasValidTransports = transports.length > 0

  // Sort transports by duration (fastest first) if we have valid transports
  const sortedTransports = hasValidTransports ? sortTransportsByDuration(transports) : []

  // Find the fastest possible transport option
  const fastestPossible = sortedTransports.find((t) => t.isPossible)

  const destinationLocation = destinationActivity?.getEvent()?.getLocation()?.getCoordinates()?.toString() || ''

  // Calculate left position (source activity column)
  const leftPos = useMemo(() => {
    const leftStart = Math.min(sourceIndex, destinationIndex)
    const rightStart = Math.max(sourceIndex, destinationIndex)
    return `calc(${leftStart} * ${columnWidth} + ${leftStart} * ${columnGap}px)`
  }, [sourceIndex, destinationIndex, columnWidth, columnGap])

  // Calculate width (span from source to destination column)
  const width =
    sourceIndex === destinationIndex
      ? columnWidth
      : `calc(${Math.abs(destinationIndex - sourceIndex) + 1} * ${columnWidth} + ${Math.abs(destinationIndex - sourceIndex)} * ${columnGap}px)`

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: leftPos,
        top: `${startY + topOffset}px`,
        width,
        height: `${endY - startY}px`,
      }}
    >
      <div className="relative w-full h-full">
        {/* Background color based on whether travel is possible or routes exist */}
        <div
          className={cn(
            'absolute inset-0 border rounded-lg',
            !hasValidTransports
              ? 'bg-amber-100/30 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/50'
              : fastestPossible
                ? 'bg-green-100/30 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50'
                : 'bg-red-100/30 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/50'
          )}
        />

        {/* Travel time indicators - only show if we have transport options */}
        {hasValidTransports && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 pointer-events-auto">
            {sortedTransports.map((transport, index) => {
              const IconComponent = TRANSPORT_ICONS[transport.type]

              return (
                <TooltipProvider key={`${sourceId}-${destinationId}-${startY}-${endY}-${index}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-xs cursor-pointer',
                          transport.isPossible
                            ? 'bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300'
                            : 'bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{Math.round(transport.duration)}m</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="font-medium mb-1">{transport.isPossible ? '✓ Travel possible' : '✗ Travel not possible'}</div>
                      <div className="grid grid-cols-[auto_1fr] gap-x-2 text-sm">
                        <span className="text-muted-foreground">Leave:</span>
                        <span>{formatTimeWithDayIndicator(transport.leaveTime, formatTime).displayTime}</span>
                        <span className="text-muted-foreground">Arrive:</span>
                        <span>{formatTimeWithDayIndicator(transport.arrivalTime, formatTime).displayTime}</span>
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{Math.round(transport.duration)} minutes</span>
                        {!transport.isPossible && (
                          <>
                            <span className="text-muted-foreground">Available:</span>
                            <span>{Math.round(transport.availableTime)} minutes</span>
                            <span className="text-muted-foreground">Needed:</span>
                            <span>{Math.round(transport.duration - transport.availableTime)} more minutes</span>
                          </>
                        )}
                        {destinationLocation && (
                          <>
                            <span className="text-muted-foreground">Route:</span>
                            <a className="text-primary text-left hover:underline" href={getGoogleMapsLink(destinationLocation)}>
                              View on Google Maps
                            </a>
                          </>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        )}

        {/* Message when no routes available */}
        {!hasValidTransports && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-amber-100 border border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full text-xs">
                    No route data
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No travel information available between these locations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}
