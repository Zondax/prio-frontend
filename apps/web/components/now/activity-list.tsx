'use client'

import type { Event } from '@prio-state'
import type { Activity } from '@prio-state'
import Image from 'next/image'
import { useCallback } from 'react'

import { useTimelineLayout } from './timeline-layout-context'

interface ActivityListProps {
  activities?: Activity[]
  isLoading: boolean
  expandedActivityId: string | null
  handleEventClick: (event: Event) => void
  renderActivityButton?: (activity: Activity, isExpanded: boolean, onClick: () => void) => React.ReactNode
}

export function ActivityList({ activities, isLoading, expandedActivityId, handleEventClick, renderActivityButton }: ActivityListProps) {
  const { columnWidth, headerHeight: height, columnGap } = useTimelineLayout()

  const handleClick = useCallback(
    (event?: Event | undefined) => {
      if (!event) return
      handleEventClick(event)
    },
    [handleEventClick]
  )

  return (
    <div className="sticky top-0 left-0 z-50 mb-4 bg-background" style={{ height: `${height}px` }}>
      <div className="flex h-full items-end pb-2 bg-background gap-4" style={{ gap: columnGap }}>
        {isLoading ? (
          // Show 3 skeleton loaders
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                style={{
                  width: 'calc(100% / 3)',
                }}
                className="shrink-0"
              >
                <div className="animate-pulse bg-muted h-7 rounded-md w-full" />
              </div>
            ))}
          </>
        ) : (
          activities?.map((activity) => (
            <div
              key={activity.getId()}
              style={{
                width: columnWidth,
              }}
              className="shrink-0"
            >
              {renderActivityButton ? (
                renderActivityButton(activity, expandedActivityId === activity.getId(), () => handleClick(activity.getEvent()))
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(activity.getEvent())}
                  className="text-left px-2 py-2 text-sm bg-muted/50 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-sm">
                          <Image
                            src={activity.getEvent()?.getImage() || 'https://placehold.co/20x20'}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="font-semibold truncate">{activity.getEvent()?.getTitle()}</div>
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
