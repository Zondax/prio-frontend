import { formatTimeWithDayIndicator, sortTransportsByDuration } from '@mono-state/feature/activity'
import type { TransportInfo } from '@mono-state/feature/activity/transportUtils'
import type React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { TRANSPORT_ICONS } from '@/lib/scheduler'

interface TravelTimeBlockProps {
  transports: TransportInfo[]
  formatTime: (minutes: number) => string
  localTimezone?: string
}

export const TravelTimeBlock: React.FC<TravelTimeBlockProps> = ({ transports, formatTime, localTimezone }) => {
  // Check if we have any valid transport options
  const hasValidTransports = transports.length > 0

  // Sort transports by duration (fastest first) if we have valid transports
  const sortedTransports = hasValidTransports ? sortTransportsByDuration(transports) : []

  // Find the fastest possible transport option
  const fastestPossible = sortedTransports.find((t) => t.isPossible)

  // Determine background style based on transport status
  const getBackgroundStyle = () => {
    if (!hasValidTransports) {
      return styles.warningBackground
    }
    if (fastestPossible) {
      return styles.successBackground
    }
    return styles.errorBackground
  }

  return (
    <View style={[styles.container, getBackgroundStyle()]}>
      <View style={styles.content}>
        {/* Travel time indicators - only show if we have transport options */}
        {hasValidTransports ? (
          <View style={styles.transportsContainer}>
            {sortedTransports.map((transport, index) => {
              const IconComponent = TRANSPORT_ICONS[transport.type]
              const transportStyle = transport.isPossible ? styles.possibleTransport : styles.impossibleTransport

              return (
                <TouchableOpacity key={index} style={styles.transportButton}>
                  <View style={[styles.transportBadge, transportStyle]}>
                    <IconComponent style={styles.icon} />
                    <Text style={styles.durationText}>{Math.round(transport.duration)}m</Text>
                  </View>
                  <View style={styles.transportDetails}>
                    <Text style={styles.timeText}>
                      {formatTimeWithDayIndicator(transport.leaveTime, formatTime).displayTime} →{' '}
                      {formatTimeWithDayIndicator(transport.arrivalTime, formatTime).displayTime}
                    </Text>
                    {!transport.isPossible && (
                      <Text style={styles.warningText}>Needs {Math.round(transport.duration - transport.availableTime)}m more</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        ) : (
          <View style={styles.noRouteContainer}>
            <Text style={styles.noRouteText}>No route data available</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 4,
  },
  content: {
    padding: 8,
  },
  warningBackground: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  successBackground: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  errorBackground: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  transportsContainer: {
    gap: 8,
  },
  transportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    minWidth: 80,
    justifyContent: 'center',
  },
  possibleTransport: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  impossibleTransport: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  icon: {
    width: 16,
    height: 16,
  },
  durationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  transportDetails: {
    flex: 1,
  },
  timeText: {
    fontSize: 13,
    color: '#374151',
  },
  warningText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  },
  noRouteContainer: {
    padding: 8,
    alignItems: 'center',
  },
  noRouteText: {
    fontSize: 13,
    color: '#b45309',
  },
})
