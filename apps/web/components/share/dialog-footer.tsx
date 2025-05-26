'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Check, LucideLink } from 'lucide-react'

export interface ShareDialogFooterProps {
  isLinkCopied?: boolean
  onCopyLink?: () => void
  onDone: () => void
  canManagePermissions?: boolean
}

export function ShareDialogFooter({ isLinkCopied, onCopyLink, onDone, canManagePermissions }: ShareDialogFooterProps) {
  return (
    <DialogFooter className="mt-6 gap-2 sm:gap-0">
      {canManagePermissions && (
        <Button variant="outline" onClick={onCopyLink} className="w-full sm:w-auto transition-all">
          {isLinkCopied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <LucideLink className="h-4 w-4 mr-2" />
              <span>Copy link</span>
            </>
          )}
        </Button>
      )}
      <Button className="w-full sm:w-auto transition-all" onClick={onDone}>
        Done
      </Button>
    </DialogFooter>
  )
}
