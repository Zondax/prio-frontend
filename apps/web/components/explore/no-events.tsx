'use client'

import { EventKeys, eventLabels } from '@prio-state/feature/events/config'
import { SearchIcon } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'

interface NoEventsProps {
  style?: React.CSSProperties
}

export function NoEvents({ style }: NoEventsProps) {
  return (
    <div style={style} className={'h-full pt-4'}>
      <EmptyState
        icon={SearchIcon}
        title={eventLabels[EventKeys.NO_EVENTS].title}
        subtitle={eventLabels[EventKeys.NO_EVENTS].subtitle}
        className={'h-full'}
      />
    </div>
  )
}
