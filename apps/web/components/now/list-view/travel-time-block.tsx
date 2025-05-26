'use client'

import { formatTimeWithDayIndicator, sortTransportsByDuration } from '@prio-state/feature/activity'
import type { TransportInfo } from '@prio-state/feature/activity/transportUtils'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TRANSPORT_ICONS } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

interface TravelTimeBlockProps {
  transports: TransportInfo[]
  formatTime: (minutes: number) => string
  localTimezone?: string
}

export function TravelTimeBlock({ transports, formatTime, localTimezone }: TravelTimeBlockProps) {
  // Check if we have any valid transport options
  const hasValidTransports = transports.length > 0

  // Sort transports by duration (fastest first) if we have valid transports
  const sortedTransports = hasValidTransports ? sortTransportsByDuration(transports) : []

  // Find the fastest possible transport option
  const fastestPossible = sortedTransports.find((t) => t.isPossible)

  if (!hasValidTransports) {
    return null
  }

  return (
    <div className="my-4 rounded-md border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Travel</div>
        {fastestPossible ? (
          <div className="text-xs text-green-600">
            ✓ {Math.round(fastestPossible.duration)} min by {fastestPossible.type}
          </div>
        ) : (
          <div className="text-xs text-destructive">✗ Cannot reach in time</div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {sortedTransports.map((transport, index) => {
          const IconComponent = TRANSPORT_ICONS[transport.type]

          return (
            <TooltipProvider key={`${transport.type}-${index}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs',
                      transport.isPossible
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400'
                    )}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{Math.round(transport.duration)} min</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
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
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
