'use client'

import { type EventCollection, EventCollectionVisibilityType, type EventCollectionWithSummary } from '@prio-state'
import { ArrowLeft, ChevronLeft, File, Globe, Lock, Settings, Share2, User } from 'lucide-react'

import { Button } from '@/components/ui/button'

// import { SearchInput } from '@/components/collection/search-input'

import type { ViewType } from './collections-config'

interface CollectionHeaderProps {
  collectionWithSummary?: EventCollectionWithSummary
  itemsCount?: number
  viewType: ViewType
  onViewTypeChange: (value: ViewType) => void
  onBackClick: () => void
  onShareClick: (collectionWithSummary: EventCollectionWithSummary) => void
  onEditClick: (collection: EventCollection) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  isLoading?: boolean
}

// Simple skeleton component for text/rectangles
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />
}

// Privacy icon and label
function PrivacyIcon({ isLoading, visibility }: { isLoading: boolean; visibility?: EventCollectionVisibilityType }) {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-3.5 w-3.5" />
        <Skeleton className="h-3 w-12" />
      </>
    )
  }
  return (
    <>
      {visibility === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE ? (
        <Lock className="h-3.5 w-3.5" />
      ) : (
        <Globe className="h-3.5 w-3.5" />
      )}
      <span className="text-xs">
        {visibility === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE ? 'Private' : 'Public'}
      </span>
    </>
  )
}

// Owner info
function OwnerInfo({ isLoading, owner, desktop }: { isLoading: boolean; owner?: string; desktop: boolean }) {
  if (!owner && !isLoading) return null
  return (
    <div className={'flex items-center gap-1 text-muted-foreground text-xs'}>
      <User className={desktop ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{owner}</span>
      {isLoading && <Skeleton className={desktop ? 'h-3 w-12' : 'h-3 w-12'} />}
    </div>
  )
}

// Items count
function ItemsCount({ isLoading, totalEvents, desktop }: { isLoading: boolean; totalEvents?: number; desktop: boolean }) {
  if (!totalEvents && !isLoading) return null
  return (
    <div className={'flex items-center gap-1 text-muted-foreground text-xs'}>
      <File className={desktop ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      <span>{totalEvents}</span>
      {isLoading && <Skeleton className={desktop ? 'h-3 w-8' : 'h-3 w-8'} />}
    </div>
  )
}

// Info row (privacy, owner, items, likes)
function CollectionHeaderInfo({
  collection,
  itemsCount,
  isLoading,
  desktop,
}: {
  collection: ReturnType<EventCollectionWithSummary['getCollection']> | null | undefined
  itemsCount?: number
  isLoading: boolean
  desktop: boolean
}) {
  const owner = collection?.getOwnerUserName()
  const visibility = collection?.getVisibility()
  // const likes = collection?.likedBy?.length // Uncomment if likes are available
  const Divider = () => (desktop ? <div className="h-4 w-px bg-border" /> : <span className="text-muted-foreground/50 text-xs">•</span>)
  return (
    <div className={desktop ? 'flex items-center gap-2' : 'flex flex-wrap items-center gap-x-2 gap-y-1 mb-3'}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <PrivacyIcon isLoading={isLoading} visibility={visibility} />
      </div>
      <Divider />
      <OwnerInfo isLoading={isLoading} owner={owner} desktop={desktop} />
      <Divider />
      <ItemsCount isLoading={isLoading} totalEvents={itemsCount} desktop={desktop} />
      {/* <Divider />
      <Likes isLoading={isLoading} likes={likes} desktop={desktop} /> */}
    </div>
  )
}

// Action buttons (Share, Edit)
function CollectionHeaderActions({
  isLoading,
  collectionWithSummary,
  collection,
  onShareClick,
  onEditClick,
  desktop,
}: {
  isLoading: boolean
  collectionWithSummary?: EventCollectionWithSummary
  collection: ReturnType<EventCollectionWithSummary['getCollection']> | null | undefined
  onShareClick: (collectionWithSummary: EventCollectionWithSummary) => void
  onEditClick: (collection: EventCollection) => void
  desktop: boolean
}) {
  return (
    <>
      <Button
        variant="outline"
        size={desktop ? 'sm' : 'icon'}
        className={desktop ? 'rounded-full h-8 px-3 text-xs bg-background flex items-center' : 'rounded-full h-8 w-8'}
        onClick={() => collectionWithSummary && onShareClick(collectionWithSummary)}
        disabled={isLoading}
      >
        <Share2 className={desktop ? 'h-3.5 w-3.5 mr-1.5' : 'h-3.5 w-3.5'} />
        {desktop && 'Share'}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-8 w-8 shrink-0"
        onClick={() => collection && onEditClick(collection)}
        disabled={isLoading}
      >
        <Settings className="h-4 w-4" />
      </Button>
    </>
  )
}

/**
 * CollectionHeader - Header component for a single collection view
 * Shows title, metadata, search, view toggle, and action buttons
 * Optimized for both mobile and desktop views
 */
export function CollectionHeader({
  collectionWithSummary,
  itemsCount,
  viewType,
  onViewTypeChange,
  onBackClick,
  onShareClick,
  onEditClick,
  searchQuery,
  onSearchChange,
  isLoading: isCollectionLoading,
}: CollectionHeaderProps) {
  const collection = collectionWithSummary?.getCollection()
  const isLoading = isCollectionLoading || collection === null
  const name = collection?.getName()

  // Helper: render collection name or skeleton
  function renderCollectionName({ desktop }: { desktop: boolean }) {
    if (isLoading) {
      return <Skeleton className={desktop ? 'h-6 w-40' : 'h-5 w-32'} />
    }
    return <span className={desktop ? 'text-xl font-medium text-left truncate' : 'text-lg font-medium text-left truncate'}>{name}</span>
  }

  // Helper: render description or skeleton
  function renderDescription() {
    if (isLoading) {
      return <Skeleton className="h-4 w-full max-w-xl mt-1" />
    }
    return <p className="text-xs text-muted-foreground mt-1 max-w-xl min-h-8 line-clamp-2">{collection?.getDescription()}</p>
  }

  return (
    <div className="py-3 md:py-4 bg-background border-b border-border/30">
      <div className="space-y-3 md:space-y-0">
        {/* Desktop layout */}
        <div className="hidden md:block">
          <Button variant="link" size="sm" className="w-fit flex gap-2 px-0" onClick={onBackClick}>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">All Collections</span>
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1>{renderCollectionName({ desktop: true })}</h1>
                  <CollectionHeaderInfo collection={collection} itemsCount={itemsCount} isLoading={isLoading} desktop={true} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CollectionHeaderActions
                isLoading={isLoading}
                collectionWithSummary={collectionWithSummary}
                collection={collection}
                onShareClick={onShareClick}
                onEditClick={onEditClick}
                desktop={true}
              />
            </div>
          </div>

          {/* Display description if available */}
          {renderDescription()}
        </div>
        {/* Mobile layout */}
        <div className="md:hidden">
          <Button variant="link" size="sm" className="w-fit mb-2" onClick={onBackClick}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs font-medium">All Collections</span>
          </Button>
          <div className="flex items-center justify-between mb-2">
            <h1>{renderCollectionName({ desktop: false })}</h1>
            <div className="flex items-center gap-2">
              <CollectionHeaderActions
                isLoading={isLoading}
                collectionWithSummary={collectionWithSummary}
                collection={collection}
                onShareClick={onShareClick}
                onEditClick={onEditClick}
                desktop={false}
              />
            </div>
          </div>
          <CollectionHeaderInfo collection={collection} itemsCount={itemsCount} isLoading={isLoading} desktop={false} />
        </div>
      </div>
    </div>
  )
}
