'use client'

import { type EventCollection, EventCollectionVisibilityType, type EventCollectionWithSummary } from '@prio-state'
import { Image } from 'expo-image'
import { Edit, FileIcon, Lock, Share2, Trash2, User } from 'lucide-react-native'
import React, { useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'

// Types
interface CollectionCardProps {
  collectionWithSummary: EventCollectionWithSummary
  images: string[]
  eventCount: number
  onClick?: (collection: EventCollection) => void
  onEdit?: (collection: EventCollection) => void
  onShare?: (collection: EventCollectionWithSummary) => void
  onDelete?: (collection: EventCollection) => void
  canEdit?: boolean
  canShare?: boolean
  canDelete?: boolean
}

// Action button component
const ActionButton = ({ icon, onPress, destructive = false }: { icon: React.ReactNode; onPress: () => void; destructive?: boolean }) => (
  <Button size="sm" variant="ghost" className="h-8 w-8" onPress={onPress}>
    {React.cloneElement(icon as React.ReactElement, {
      className: cn('h-4 w-4', destructive ? 'text-destructive/70' : 'text-foreground/70'),
      size: 16,
    })}
  </Button>
)

// Main component
export function CollectionCard({
  collectionWithSummary,
  images,
  eventCount,
  onClick,
  onEdit,
  onShare,
  onDelete,
  canEdit = false,
  canShare = false,
  canDelete = false,
}: CollectionCardProps) {
  const hasImages = images.length > 0
  const collection = collectionWithSummary?.getCollection()
  // Event handlers
  const handlePress = useCallback(() => {
    if (collection && onClick) onClick(collection)
  }, [collection, onClick])

  const handleEdit = useCallback(() => {
    if (collection && onEdit) onEdit(collection)
  }, [collection, onEdit])

  const handleShare = useCallback(() => {
    if (collectionWithSummary && onShare) onShare(collectionWithSummary)
  }, [collectionWithSummary, onShare])

  const handleDelete = useCallback(() => {
    if (collection && onDelete) onDelete(collection)
  }, [collection, onDelete])

  return (
    <Card className="relative my-2 overflow-hidden border-0">
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        {/* Cover Image */}
        <View className="relative w-full h-40 overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
          {hasImages && (
            <Image
              source={images[0]}
              contentFit="cover"
              style={{
                width: '100%',
                height: '100%',
              }}
              transition={300}
            />
          )}
        </View>

        {/* Card Header */}
        <CardHeader>
          <View className="flex items-start justify-between">
            <View className="flex-1 mb-1">
              <CardTitle className="line-clamp-2">{collection?.getName()}</CardTitle>
            </View>
            <View className="flex-row items-center gap-2">
              <User size={16} className="text-muted-foreground" />
              <Text className="text-xs text-muted-foreground">{collection?.getOwnerUserName()}</Text>
            </View>
          </View>
        </CardHeader>

        {/* Card Content */}
        <CardContent>
          <View className="space-y-2">
            {/* Collection Owner */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2 gap-2">
                <Badge variant="secondary" className="flex-row items-center gap-2">
                  <FileIcon size={16} />
                  <Text className="text-xs">{eventCount}</Text>
                </Badge>

                {collection?.getVisibility() === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE && (
                  <Badge variant="secondary" className="flex-row items-center gap-2">
                    <Lock size={16} />
                    <Text className="text-xs">Private</Text>
                  </Badge>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-1">
                {canEdit && <ActionButton icon={<Edit />} onPress={handleEdit} />}
                {<ActionButton icon={<Share2 />} onPress={handleShare} />}
                {canDelete && <ActionButton icon={<Trash2 />} onPress={handleDelete} destructive />}
              </View>
            </View>
          </View>
        </CardContent>
      </TouchableOpacity>
    </Card>
  )
}
