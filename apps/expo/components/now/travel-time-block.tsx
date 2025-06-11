import type { Activity } from '@mono-state'
import { formatTimeWithDayIndicator, sortTransportsByDuration } from '@mono-state/feature/activity'
import type { TransportInfo } from '@mono-state/feature/activity/transportUtils'
import type React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { TRANSPORT_ICONS } from '@/lib/scheduler'

import { useTimelineLayout } from './timeline-layout-context'

interface Position {
  startY: number
  endY: number
}

interface TravelTimeBlockProps {
  transports: TransportInfo[]
  formatTime: (minutes: number) => string
  localTimezone?: string
  destinationActivity?: Activity
  sourceIndex?: number
  destinationIndex?: number
  position?: Position
}

export const TravelTimeBlock: React.FC<TravelTimeBlockProps> = ({
  transports,
  formatTime,
  localTimezone,
  destinationActivity,
  sourceIndex = 0,
  destinationIndex = 1,
  position,
}) => {
  const { gridWidth, topOffset } = useTimelineLayout()

  // Check if we have any valid transport options
  const hasValidTransports = transports.length > 0

  // Sort transports by duration (fastest first) if we have valid transports
  const sortedTransports = hasValidTransports ? sortTransportsByDuration(transports) : []

  // Find the fastest possible transport option
  const fastestPossible = sortedTransports.find((t) => t.isPossible)

  const destinationLocation = destinationActivity?.getEvent()?.getLocation()?.getCoordinates()?.toString() || ''

  // For timeline view with position
  if (position) {
    const { startY, endY } = position

    return (
      <View
        className="absolute z-30 pointer-events-none"
        style={{
          left: 0,
          top: startY + topOffset,
          width: typeof gridWidth === 'string' ? '100%' : gridWidth,
          height: endY - startY,
        }}
      >
        <View className="relative w-full h-full">
          {/* Background color based on whether travel is possible or routes exist */}
          <View
            className={
              !hasValidTransports
                ? 'absolute inset-0 border rounded-lg bg-amber-100/30 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/50'
                : fastestPossible
                  ? 'absolute inset-0 border rounded-lg bg-green-100/30 dark:bg-green-950/20 border-green-200/50 dark:border-green-800/50'
                  : 'absolute inset-0 border rounded-lg bg-red-100/30 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/50'
            }
          />

          {/* Travel time indicators - only show if we have transport options */}
          {hasValidTransports && (
            <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-1 pointer-events-auto">
              {sortedTransports.map((transport, index) => {
                const IconComponent = TRANSPORT_ICONS[transport.type]

                return (
                  <TouchableOpacity key={index}>
                    <View
                      className={
                        transport.isPossible
                          ? 'flex flex-row items-center gap-1 px-1.5 py-0.5 rounded-full border bg-green-100 border-green-200 dark:bg-green-950 dark:border-green-800'
                          : 'flex flex-row items-center gap-1 px-1.5 py-0.5 rounded-full border bg-red-100 border-red-200 dark:bg-red-950 dark:border-red-800'
                      }
                    >
                      <IconComponent
                        size={16}
                        className={transport.isPossible ? 'color-green-700 dark:color-green-300' : 'color-red-700 dark:color-red-300'}
                      />
                      <Text className="text-xs">{Math.round(transport.duration)}m</Text>
                    </View>

                    {/* This would be a tooltip in web, but we're just showing the info directly for now */}
                    <View className="hidden">
                      <Text className="font-medium mb-1">{transport.isPossible ? '✓ Travel possible' : '✗ Travel not possible'}</Text>
                      <View className="flex flex-row flex-wrap">
                        <Text className="text-muted-foreground w-20 mr-2">Leave:</Text>
                        <Text>{formatTimeWithDayIndicator(transport.leaveTime, formatTime).displayTime}</Text>

                        <Text className="text-muted-foreground w-20 mr-2">Arrive:</Text>
                        <Text>{formatTimeWithDayIndicator(transport.arrivalTime, formatTime).displayTime}</Text>

                        <Text className="text-muted-foreground w-20 mr-2">Duration:</Text>
                        <Text>{Math.round(transport.duration)} minutes</Text>

                        {!transport.isPossible && (
                          <>
                            <Text className="text-muted-foreground w-20 mr-2">Available:</Text>
                            <Text>{Math.round(transport.availableTime)} minutes</Text>

                            <Text className="text-muted-foreground w-20 mr-2">Needed:</Text>
                            <Text>{Math.round(transport.duration - transport.availableTime)} more minutes</Text>
                          </>
                        )}

                        {destinationLocation && (
                          <>
                            <Text className="text-muted-foreground w-20 mr-2">Route:</Text>
                            <Text className="text-primary">View on Google Maps</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          {/* Message when no routes available */}
          {!hasValidTransports && (
            <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <TouchableOpacity>
                <View className="bg-amber-100 border border-amber-200 dark:bg-amber-950 dark:border-amber-800 px-2 py-0.5 rounded-full">
                  <Text className="text-xs text-amber-700 dark:text-amber-300">No route data</Text>
                </View>

                {/* This would be a tooltip in web */}
                <View className="hidden">
                  <Text>No travel information available between these locations</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
  }

  // For list view without position (similar to web implementation)
  return (
    <View className="py-2 px-4 my-2">
      <View className="relative w-full">
        {/* Travel time indicators - only show if we have transport options */}
        {hasValidTransports && (
          <View className="flex flex-row gap-1 justify-center">
            {sortedTransports.map((transport, index) => {
              const IconComponent = TRANSPORT_ICONS[transport.type]

              return (
                <TouchableOpacity key={index}>
                  <View
                    className={
                      transport.isPossible
                        ? 'flex flex-row items-center gap-1 px-1.5 py-0.5 rounded-full border bg-green-100 border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'flex flex-row items-center gap-1 px-1.5 py-0.5 rounded-full border bg-red-100 border-red-200 dark:bg-red-950 dark:border-red-800'
                    }
                  >
                    <IconComponent
                      size={16}
                      className={transport.isPossible ? 'color-green-700 dark:color-green-300' : 'color-red-700 dark:color-red-300'}
                    />
                    <Text
                      className={
                        transport.isPossible ? 'text-xs text-green-700 dark:text-green-300' : 'text-xs text-red-700 dark:text-red-300'
                      }
                    >
                      {Math.round(transport.duration)}m
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {/* Message when no routes available */}
        {!hasValidTransports && (
          <View className="flex justify-center items-center">
            <TouchableOpacity>
              <View className="bg-amber-100 border border-amber-200 dark:bg-amber-950 dark:border-amber-800 px-2 py-0.5 rounded-full">
                <Text className="text-xs text-amber-700 dark:text-amber-300">No route data</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}
