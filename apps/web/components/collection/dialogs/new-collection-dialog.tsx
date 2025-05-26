'use client'

import { type CollectionFormData, useNewCollection } from '@prio-state'
import { FolderPlus, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface NewCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId?: string
  handleCreateCollection: (data: CollectionFormData) => Promise<void>
}

export function NewCollectionDialog({ open, onOpenChange, eventId, handleCreateCollection }: NewCollectionDialogProps) {
  const { name, setName, description, setDescription, isPrivate, setIsPrivate, handleSubmit, isSubmitting, handleClose } = useNewCollection(
    {
      onOpenChange,
      onCreate: handleCreateCollection,
      eventId,
    }
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl max-w-sm p-6">
        <DialogHeader className="space-y-2">
          <div className="mx-auto bg-green-500/10 p-2 rounded-full w-fit">
            <FolderPlus className="h-5 w-5 text-green-500" />
          </div>
          <DialogTitle className="text-lg font-semibold text-center mt-2">Create Collection</DialogTitle>
          <DialogDescription className="text-center text-sm">Create a collection to organize your assets</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="collection-name" className="text-xs font-medium">
              Collection Name *
            </Label>
            <Input
              id="collection-name"
              placeholder="Enter collection name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 h-9 rounded-md bg-muted/50 placeholder:text-muted-foreground/50"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="collection-description" className="text-xs font-medium">
              Description
            </Label>
            <Textarea
              id="collection-description"
              placeholder="Enter collection description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1.5 min-h-[80px] rounded-md bg-muted/50 placeholder:text-muted-foreground/50 resize-none"
              autoComplete="off"
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
          <Button variant="outline" disabled={isSubmitting} onClick={handleClose} className="rounded-md h-9 flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="rounded-md bg-primary/90 hover:bg-primary h-9 flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create Collection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
