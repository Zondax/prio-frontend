'use client'

import { type EventCollection, EventCollectionVisibilityType, type EventCollectionWithSummary } from '@prio-state'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Calendar, Edit, FolderPlus, Globe, Heart, Lock, Share2, Trash, User } from 'lucide-react'

import { Button } from '@/components/ui/button'

// Name column cell renderer
const NameCell = ({ row }: { row: { original: EventCollection } }) => {
  const collection = row.original
  const numberOfItems: number = 0 // TODO: get number of items from collection

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="w-8 h-8 rounded-md bg-muted/50 flex items-center justify-center shrink-0 text-muted-foreground">
        <FolderPlus className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="font-medium truncate">{collection.getName()}</div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs min-w-0">
          <span>
            {numberOfItems} item{numberOfItems !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

// Owner column cell renderer
const OwnerCell = ({ row }: { row: { original: EventCollection } }) => {
  const collection = row.original
  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-muted-foreground" />
      <span className="truncate">{collection.getOwnerUserName()}</span>
    </div>
  )
}

// Privacy column cell renderer
const PrivacyCell = ({ row }: { row: { original: EventCollection } }) => {
  const collection = row.original
  return (
    <div className="flex items-center gap-2">
      {collection.getVisibility() === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE ? (
        <>
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span>Private</span>
        </>
      ) : (
        <>
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>Public</span>
        </>
      )}
    </div>
  )
}

// Likes column cell renderer
const LikesCell = ({ row }: { row: { original: EventCollection } }) => {
  const collection = row.original
  return (
    <div className="flex items-center gap-2">
      <Heart className="h-4 w-4 text-muted-foreground" />
      <span>0</span>
    </div>
  )
}

// Updated At column cell renderer
const UpdatedAtCell = ({ row }: { row: { original: EventCollection } }) => {
  const collection = row.original
  const updatedAt = collection.getUpdatedAt()?.toDate()
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <span>{updatedAt ? format(updatedAt, 'MMM d, yyyy') : '-'}</span>
    </div>
  )
}

interface ActionsCellProps {
  row: { original: EventCollection }
  onEdit: (collection: EventCollection) => void
  onShare: (collectionWithSummary: EventCollectionWithSummary) => void
  onDelete: (collection: EventCollection) => void
}

// Actions column cell renderer
const ActionsCell = ({ row, onEdit, onShare, onDelete }: ActionsCellProps) => {
  const collection = row.original

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(collection)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // onShare(collection) // TODO
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(collection)
  }

  return (
    <div className="flex items-center gap-1 justify-end">
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={handleEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Share" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        title="Delete"
        onClick={handleDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface CollectionsColumnsProps {
  onEdit: (collection: EventCollection) => void
  onShare: (collectionWithSummary: EventCollectionWithSummary) => void
  onDelete: (collection: EventCollection) => void
}

/**
 * Returns the columns definition for the collections table
 *
 * @param handlers - Object containing handlers for edit, share, and delete actions
 */
export function getCollectionsColumns({ onEdit, onShare, onDelete }: CollectionsColumnsProps): ColumnDef<EventCollection>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: NameCell,
      size: 300,
      enableSorting: false,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: OwnerCell,
      size: 150,
      enableSorting: false,
    },
    {
      accessorKey: 'privacy',
      header: 'Privacy',
      cell: PrivacyCell,
      size: 120,
      enableSorting: false,
    },
    // {
    //   accessorKey: 'likes',
    //   header: 'Likes',
    //   cell: LikesCell,
    //   size: 100,
    //   enableSorting: false,
    // },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: UpdatedAtCell,
      size: 150,
      minSize: 150,
      enableSorting: false,
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => <ActionsCell row={row} onEdit={onEdit} onShare={onShare} onDelete={onDelete} />,
      size: 120,
      enableSorting: false,
    },
  ]
}
