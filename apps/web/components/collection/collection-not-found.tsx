'use client'

import { FolderX } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { EmptyState } from '@/components/empty-state'

interface CollectionNotFoundProps {
  message?: string
}

/**
 * CollectionNotFound - Component to display when a collection is not found
 * Uses the shared EmptyState component for consistent UI
 *
 * @param message - Optional custom message to display
 */
export function CollectionNotFound({ message }: CollectionNotFoundProps) {
  const router = useRouter()

  return (
    <EmptyState
      icon={FolderX}
      title="Collection Not Found"
      subtitle={message || "The collection you're looking for doesn't exist or may have been removed."}
      button={{
        label: 'Go Back',
        onClick: () => router.back(),
      }}
      className="h-full w-full p-8"
    />
  )
}
