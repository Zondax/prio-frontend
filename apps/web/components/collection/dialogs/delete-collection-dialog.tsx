'use client'

import { useDeleteCollection } from '@prio-state/feature/collections/hooks/useCollectionActions'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface DeleteCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionId?: string
  collectionName?: string
  onDelete: (collectionId: string) => Promise<void>
  isDeleting?: boolean
  onSuccess?: () => void
}

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  collectionName,
  onDelete,
  isDeleting = false,
  onSuccess,
}: DeleteCollectionDialogProps) {
  const { handleDelete, isDisabled, showDeletingText } = useDeleteCollection({
    collectionId,
    onDelete,
    onSuccess,
    onOpenChange,
    isDeleting,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl max-w-sm p-6">
        <DialogHeader className="space-y-2">
          <div className="mx-auto bg-destructive/10 p-2 rounded-full w-fit">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <DialogTitle className="text-lg font-semibold text-center mt-2">Delete Collection</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Are you sure you want to delete <span className="font-medium text-foreground">{collectionName || 'this collection'}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-md h-9 flex-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDisabled}
            className={cn('rounded-md h-9 flex-1', showDeletingText && 'opacity-70')}
          >
            {showDeletingText ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
