'use client'

import { FolderIcon, PlusIcon } from 'lucide-react-native'
import React from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { EmptyState } from '../ui/empty-state'

interface EmptyCollectionsProps {
  style?: StyleProp<ViewStyle>
  onCreateClick: () => void
}

// TODO: Should we add in state the labels to share between the web and mobile?
export function EmptyCollections({ style, onCreateClick }: EmptyCollectionsProps) {
  return (
    <View style={style}>
      <EmptyState
        icon={FolderIcon}
        title="No collections found"
        subtitle={<>You don&apos;t have any collections yet. Would you like to create one?</>}
        button={{
          onPress: onCreateClick,
          icon: PlusIcon,
          label: 'Create collection',
        }}
        className={'h-full'}
      />
    </View>
  )
}
