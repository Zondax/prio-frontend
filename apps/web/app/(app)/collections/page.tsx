'use client'

import { useRouter } from 'next/navigation'

import { Collections } from '@/components/collection/collections'

/**
 * Collections Page Component
 *
 * Displays a list of all user collections and provides options to create new collections
 * or edit existing ones. Navigation to individual collections happens through routing.
 */
export default function CollectionPage() {
  const router = useRouter()

  // Handle collection selection - navigate to collection page
  const handleCollectionSelect = (collectionId: string) => {
    // Navigate to the collection page using the ID
    router.push(`/collections/${collectionId}`)
  }

  return (
    <div className="flex flex-col h-full">
      <Collections onCollectionSelect={handleCollectionSelect} />
    </div>
  )
}
