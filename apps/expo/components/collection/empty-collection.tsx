'use client'

import { FolderIcon, SearchIcon } from 'lucide-react-native'
import React from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { EmptyState } from '../ui/empty-state'

interface EmptyCollectionProps {
  style?: StyleProp<ViewStyle>
}

// TODO: Should we add in state the labels to share between the web and mobile?
export function EmptyCollection({ style }: EmptyCollectionProps) {
  return (
    <View style={style}>
      <EmptyState
        icon={FolderIcon}
        title="No events in this collection"
        subtitle="This collection is empty. Add events from the explore page or other collections."
        button={{
          href: '/(protected)/(tabs)',
          icon: SearchIcon,
          label: 'Search events',
        }}
        className={'h-full'}
      />
    </View>
  )
}
