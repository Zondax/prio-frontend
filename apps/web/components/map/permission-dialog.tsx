'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface MapPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequestPermission: () => void
}

export function MapPermissionDialog({ open, onOpenChange, onRequestPermission }: MapPermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Location access required</DialogTitle>
          <DialogDescription>
            You&apos;ve denied access to your location. To use location features, please enable location access in your browser settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Dismiss
          </Button>
          <Button variant="default" onClick={onRequestPermission}>
            Request location access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
