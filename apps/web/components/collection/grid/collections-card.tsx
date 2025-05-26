'use client'

import { type EventCollection, EventCollectionVisibilityType } from '@prio-state'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, FileCogIcon, LockIcon, Share2, Trash2, User } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EVENT_PLACEHOLDER_IMAGE_PATH } from '@/lib/images'
import { cn, hashString } from '@/lib/utils'

// Types
interface CollectionCardProps {
  collection: EventCollection
  images: string[]
  eventCount: number
  onClick?: (collection: EventCollection) => void
  onEdit?: (collection: EventCollection) => void
  onShare?: (collection: EventCollection) => void
  onDelete?: (collection: EventCollection) => void
  canEdit?: boolean
  canShare?: boolean
  canDelete?: boolean
}

// Sub-components
const ActionButton = ({
  icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: (e: React.MouseEvent) => void
  destructive?: boolean
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClick}>
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: cn('h-3.5 w-3.5', destructive ? 'text-destructive/70' : 'text-foreground/70'),
          })}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const CollectionInfo = ({
  collection,
  isHovered,
  isMobile,
  eventCount,
}: {
  collection: EventCollection
  isHovered: boolean
  isMobile: boolean
  eventCount: number
}) => (
  <AnimatePresence>
    {(isHovered || isMobile) && (
      <motion.div
        className="flex items-center gap-2 mt-1"
        initial={!isMobile ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto' }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={!isMobile ? { opacity: 0, height: 0 } : { opacity: 1, height: 'auto' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center bg-muted/60 rounded-full px-2 py-0.5">
          <span className="text-xs text-muted-foreground">
            <FileCogIcon className="h-3 w-3 mr-1 inline" /> {eventCount}
          </span>
        </div>

        {collection.getVisibility() === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE && (
          <div className="flex items-center bg-muted/60 rounded-full px-2 py-0.5">
            <span className="text-xs text-muted-foreground">
              <LockIcon className="h-3 w-3 mr-1 inline" /> Private
            </span>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
)

const ActionButtons = ({
  isHovered,
  onEdit,
  onShare,
  onDelete,
  isMobile,
  canEdit = false,
  canShare = false,
  canDelete = false,
}: {
  isHovered: boolean
  onEdit: (e: React.MouseEvent) => void
  onShare: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
  isMobile: boolean
  canEdit?: boolean
  canShare?: boolean
  canDelete?: boolean
}) => (
  <AnimatePresence>
    {(isHovered || isMobile) && (
      <motion.div
        className="flex gap-1"
        initial={!isMobile ? { opacity: 0, y: 5 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={!isMobile ? { opacity: 0, y: 5 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {canEdit && <ActionButton icon={<Edit />} label="Edit" onClick={onEdit} />}
        <ActionButton icon={<Share2 />} label="Share" onClick={onShare} />
        {canDelete && <ActionButton icon={<Trash2 />} label="Delete" onClick={onDelete} destructive />}
      </motion.div>
    )}
  </AnimatePresence>
)

// Main component
export function CollectionCard({
  collection,
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
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const hasMultipleEvents = eventCount > 1

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Event handlers
  const handleClick = useCallback(() => {
    if (onClick) onClick(collection)
  }, [collection, onClick])

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onEdit) onEdit(collection)
    },
    [collection, onEdit]
  )

  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onShare) onShare(collection)
    },
    [collection, onShare]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onDelete) onDelete(collection)
    },
    [collection, onDelete]
  )

  // Render multi-image grid for cards with multiple events
  const renderMultiImageGrid = () => (
    <AnimatePresence>
      {(!isHovered || isMobile) && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {images.length > 0 ? (
            <Image src={images[0]} alt="Collection cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <Image
              src={EVENT_PLACEHOLDER_IMAGE_PATH}
              alt="Collection placeholder"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </motion.div>
      )}
      {isHovered && !isMobile && (
        <motion.div
          className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {images.length > 0
            ? images.slice(0, 4).map((src, index) => (
                <div key={src} className="relative w-full h-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`Collection image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))
            : Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={hashString(`placeholder-image-${index}`)} className="relative w-full h-full overflow-hidden">
                    <Image
                      src={EVENT_PLACEHOLDER_IMAGE_PATH}
                      alt="Collection placeholder"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Render static image for cards with 0 or 1 event
  const renderStaticImage = () => (
    <div className="absolute inset-0 bg-muted">
      {images.length > 0 ? (
        <Image src={images[0]} alt="Collection cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      ) : (
        <Image
          src={EVENT_PLACEHOLDER_IMAGE_PATH}
          alt="Collection placeholder"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}
    </div>
  )

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={!isMobile ? { y: -6 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="h-[200px] cursor-pointer mb-2 relative overflow-hidden" onClick={handleClick}>
        <motion.div
          className="relative w-full h-full rounded-md border border-border overflow-hidden"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* Display different content based on number of events */}
          {hasMultipleEvents ? renderMultiImageGrid() : renderStaticImage()}
        </motion.div>
      </div>

      {/* Card Info */}
      <div className="mt-1 px-2">
        {/* Title */}
        <motion.h3
          className="font-medium text-base truncate pr-2"
          animate={{
            color: !isMobile && isHovered && hasMultipleEvents ? 'var(--primary)' : 'var(--foreground)',
          }}
          transition={{ duration: 0.2 }}
        >
          {collection.getName()}
        </motion.h3>

        {/* Owner Info */}
        <div className="flex items-center mt-1 max-w-full">
          <User className="h-3 w-3 mr-1 shrink-0 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">{collection.getOwnerUserName()}</span>
        </div>

        {/* Collection Info and Action Buttons Row */}
        <div className="flex items-center justify-between mt-2">
          <CollectionInfo collection={collection} isHovered={isHovered} isMobile={isMobile} eventCount={eventCount} />
          <ActionButtons
            isHovered={isHovered}
            onEdit={handleEdit}
            onShare={handleShare}
            onDelete={handleDelete}
            isMobile={isMobile}
            canEdit={canEdit}
            canShare={canShare}
            canDelete={canDelete}
          />
        </div>
      </div>
    </motion.div>
  )
}
