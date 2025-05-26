import { type EventCollection, EventCollectionVisibilityType, type EventCollectionWithSummary, type ViewType } from '@prio-state'
import { ArrowLeft, File, Globe, Lock, Settings, Share2, User } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Button } from '../ui/button'

interface CollectionHeaderProps {
  collectionWithSummary?: EventCollectionWithSummary
  totalEvents?: number
  viewType: ViewType
  onViewTypeChange: (value: ViewType) => void
  onBackPress: () => void
  onSharePress: (collectionWithSummary: EventCollectionWithSummary) => void
  onEditPress: (collection: EventCollection) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  isLoading?: boolean
}

// Simple skeleton component for rectangles
function Skeleton({ width = 80, height = 16, style = {} }: { width?: number; height?: number; style?: any }) {
  return (
    <View
      className="bg-gray-200 rounded-md my-1"
      style={{
        width,
        height,
        ...style,
      }}
    />
  )
}

// Privacy icon and label
function PrivacyIcon({ isLoading, visibility }: { isLoading: boolean; visibility?: number }) {
  if (isLoading) {
    return (
      <View className="flex-row items-center gap-1">
        <Skeleton width={16} height={16} />
        <Skeleton width={40} height={12} />
      </View>
    )
  }
  const isPrivate = visibility === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE
  return (
    <View className="flex-row items-center gap-1">
      {isPrivate ? <Lock size={16} /> : <Globe size={16} />}
      <Text className="text-xs text-gray-500">{isPrivate ? 'Private' : 'Public'}</Text>
    </View>
  )
}

// Collection name
function CollectionName({ isLoading, name }: { isLoading: boolean; name?: string }) {
  if (isLoading) {
    return <Skeleton width={160} height={24} />
  }
  return (
    <Text className="text-xl font-semibold" numberOfLines={1}>
      {name}
    </Text>
  )
}

// Owner info
function OwnerInfo({ isLoading, owner }: { isLoading: boolean; owner?: string }) {
  if (!owner && !isLoading) return null
  return (
    <View className="flex-row items-center gap-1">
      <User size={14} />
      <Text className="text-xs text-gray-500">{owner}</Text>
      {isLoading && <Skeleton width={40} height={12} />}
    </View>
  )
}

// Items count
function ItemsCount({ isLoading, totalEvents }: { isLoading: boolean; totalEvents?: number }) {
  if (totalEvents === undefined && !isLoading) return null
  return (
    <View className="flex-row items-center gap-1">
      <File size={16} />
      <Text className="text-xs text-gray-500">{totalEvents}</Text>
      {isLoading && <Skeleton width={32} height={12} />}
    </View>
  )
}

// Info row (privacy, owner, items)
function CollectionHeaderInfo({
  collection,
  totalEvents,
  isLoading,
}: {
  collection: ReturnType<EventCollectionWithSummary['getCollection']> | null | undefined
  totalEvents?: number
  isLoading: boolean
}) {
  const owner = collection?.getOwnerUserName()
  const visibility = collection?.getVisibility()
  return (
    <View className="flex-row items-center gap-3 mb-1">
      <PrivacyIcon isLoading={isLoading} visibility={visibility} />
      <Text className="text-gray-400 mx-1">•</Text>
      <OwnerInfo isLoading={isLoading} owner={owner} />
      <Text className="text-gray-400 mx-1">•</Text>
      <ItemsCount isLoading={isLoading} totalEvents={totalEvents} />
    </View>
  )
}

// Action buttons (Share, Edit)
function CollectionHeaderActions({
  isLoading,
  collectionWithSummary,
  collection,
  onSharePress,
  onEditPress,
}: {
  isLoading: boolean
  collectionWithSummary?: EventCollectionWithSummary
  collection: ReturnType<EventCollectionWithSummary['getCollection']> | null | undefined
  onSharePress: (collectionWithSummary: EventCollectionWithSummary) => void
  onEditPress: (collection: EventCollection) => void
}) {
  return (
    <View className="flex-row items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="mr-2"
        onPress={() => collectionWithSummary && onSharePress(collectionWithSummary)}
        disabled={isLoading}
      >
        <Share2 size={18} />
      </Button>
      <Button variant="ghost" size="icon" onPress={() => collection && onEditPress(collection)} disabled={isLoading}>
        <Settings size={18} />
      </Button>
    </View>
  )
}

/**
 * CollectionHeader - Header component for a single collection view (Expo/React Native)
 * Shows title, metadata, and action buttons
 */
export function CollectionHeader({
  collectionWithSummary,
  totalEvents,
  viewType,
  onViewTypeChange,
  onBackPress,
  onSharePress,
  onEditPress,
  searchQuery,
  onSearchChange,
  isLoading: isCollectionLoading,
}: CollectionHeaderProps) {
  const collection = collectionWithSummary?.getCollection()
  const isLoading = isCollectionLoading || collection === null
  const name = collection?.getName()

  return (
    <View className="py-4 px-4 bg-white border-b border-gray-200">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={onBackPress} className="mr-2 p-1">
          <ArrowLeft size={20} />
        </TouchableOpacity>
        <CollectionName isLoading={isLoading} name={name} />
      </View>
      <CollectionHeaderInfo collection={collection} totalEvents={totalEvents} isLoading={!!isLoading} />
      <View className="flex-row items-center mt-2">
        <CollectionHeaderActions
          isLoading={!!isLoading}
          collectionWithSummary={collectionWithSummary}
          collection={collection}
          onSharePress={onSharePress}
          onEditPress={onEditPress}
        />
      </View>
    </View>
  )
}
