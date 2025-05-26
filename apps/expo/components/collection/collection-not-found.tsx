'use client'

import { useRouter } from 'expo-router'
import { FolderX } from 'lucide-react-native'

import { EmptyState } from '../ui/empty-state'

/**
 * CollectionNotFound - Component to display when a collection is not found
 * Uses the shared EmptyState component for consistent UI
 *
 * @param message - Optional custom message to display
 */
export function CollectionNotFound() {
  const router = useRouter()

  return (
    <EmptyState
      icon={FolderX}
      title="Collection Not Found"
      subtitle={"The collection you're looking for doesn't exist or may have been removed."}
      button={{
        label: 'Go Back',
        onPress: () => router.back(),
        variant: 'outline',
      }}
      className="h-full w-full p-8"
    />
  )
}
