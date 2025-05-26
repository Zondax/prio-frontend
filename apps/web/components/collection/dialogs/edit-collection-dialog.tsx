'use client'

import { type EventCollection, useEditCollection } from '@prio-state'
import { Lock, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface EditCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection?: EventCollection
  onUpdate: (collectionId: string, data: Partial<EventCollection.AsObject>) => Promise<void>
  isUpdating?: boolean
  onSuccess?: () => void
}

export function EditCollectionDialog({
  open,
  onOpenChange,
  collection,
  onUpdate,
  isUpdating = false,
  onSuccess,
}: EditCollectionDialogProps) {
  const { isSaving, handleSubmit, name, setName, description, setDescription, isPrivate, setIsPrivate, handleClose } = useEditCollection({
    open,
    onOpenChange,
    collection,
    onUpdate,
    isUpdating,
    onSuccess,
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!collection) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl max-w-sm p-6">
        <DialogHeader className="space-y-2">
          <div className="mx-auto bg-blue-500/10 p-2 rounded-full w-fit">
            <Pencil className="h-5 w-5 text-blue-500" />
          </div>
          <DialogTitle className="text-lg font-semibold text-center mt-2">Edit Collection</DialogTitle>
          <DialogDescription className="text-center text-sm">Update details for “{collection.getName()}”</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="collection-name" className="text-xs font-medium">
              Collection Name
            </Label>
            <Input
              id="collection-name"
              placeholder="Enter collection name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1.5 h-9 rounded-md bg-muted/50 placeholder:text-muted-foreground/50"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="collection-description" className="text-xs font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="collection-description"
              placeholder="Enter collection description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 rounded-md resize-none h-20 bg-muted/50 placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className={cn('h-7 w-7 rounded-full flex items-center justify-center', 'bg-secondary/40')}>
                <Lock size={14} className="text-secondary-foreground" />
              </div>
              <div>
                <Label htmlFor="privacy-toggle" className="text-xs font-medium">
                  Private Collection
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">Only visible to you</p>
              </div>
            </div>

            <Switch id="privacy-toggle" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-md h-9 flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSaving}
            className="rounded-md bg-primary/90 hover:bg-primary h-9 flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
