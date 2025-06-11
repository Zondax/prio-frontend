'use client'

import { EventKeys, eventLabels } from '@mono-state/feature/events/config'
import { SearchIcon } from 'lucide-react-native'
import React from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { EmptyState } from '../ui/empty-state'

interface NoEventsProps {
  style?: StyleProp<ViewStyle>
}

export function NoEvents({ style }: NoEventsProps) {
  return (
    <View className="flex-1 items-center justify-center py-4" style={style}>
      <EmptyState
        icon={SearchIcon}
        title={eventLabels[EventKeys.NO_EVENTS].title}
        subtitle={eventLabels[EventKeys.NO_EVENTS].subtitle}
        className={'h-full w-full'}
      />
    </View>
  )
}
