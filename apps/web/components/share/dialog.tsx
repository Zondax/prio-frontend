'use client'

import { LucideUser, LucideUserPlus } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ShareDialogContent } from './content-all'
import { ShareDialogFooter } from './dialog-footer'
import type { DialogSharedPerson } from './types'

export type { DialogSharedPerson }

export interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  people?: DialogSharedPerson[]
  isLinkCopied?: boolean
  onShare?: (emails: string) => void
  onCopyLink?: () => void
  onAccessChange?: (accessType: string) => void
  onRoleChange?: (personId: string, role: string) => void | Promise<void>
  restrictedByDefault?: boolean
  triggerElement?: React.ReactNode
  showFooter?: boolean
  onRemove?: (personId: string) => void | Promise<void>
  /**
   * Configurable list of roles for the role select. Each item: { value, label, description }
   * Example: [{ value: 'editor', label: 'Editor', description: 'Can edit content' }]
   */
  roles?: { value: string; label: string; description?: string }[]
  /**
   * Configurable list of access types for the access select. Each item: { value, label, description?, icon? }
   * Example: [{ value: 'restricted', label: 'Restricted', description: 'Only people you invite can access' }]
   */
  accessTypes?: { value: string; label: string; description?: string; icon?: React.ReactNode }[]
  /**
   * The currently selected access type value
   */
  selectedAccessType?: string
  /**
   * If true, shows a skeleton loading state instead of the actual content
   */
  isLoading?: boolean
  /**
   * If false, only show the copy link functionality (no people, roles, or access controls)
   */
  canManagePermissions?: boolean
}

export function ShareDialog({
  open,
  onOpenChange,
  title,
  people = [],
  isLinkCopied,
  onShare,
  onCopyLink,
  onAccessChange,
  onRoleChange,
  restrictedByDefault = true,
  triggerElement,
  showFooter = true,
  onRemove,
  canManagePermissions = false,
  roles = [
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ],
  accessTypes = [
    { value: '1', label: 'Restricted', icon: <LucideUser className="h-4 w-4" /> },
    { value: '2', label: 'Public', icon: <LucideUserPlus className="h-4 w-4" /> },
  ],
  selectedAccessType,
  isLoading = false,
}: ShareDialogProps) {
  // Calculate the effective access type - use selectedAccessType with a fallback
  const effectiveAccessType = selectedAccessType || (restrictedByDefault ? '1' : '2')

  // Function to close the dialog
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerElement && <DialogTrigger asChild>{triggerElement}</DialogTrigger>}

      <DialogContent className="sm:max-w-md md:max-w-lg bg-background border-border">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl">Share {title}</DialogTitle>
        </DialogHeader>

        <ShareDialogContent
          title={title} // For skeleton
          people={people}
          isLinkCopied={isLinkCopied}
          onShare={onShare}
          onCopyLink={onCopyLink}
          onAccessChange={onAccessChange}
          onRoleChange={onRoleChange}
          onRemove={onRemove}
          canManagePermissions={canManagePermissions}
          roles={roles}
          accessTypes={accessTypes}
          selectedAccessType={effectiveAccessType} // Pass the calculated effective access type
          isLoading={isLoading}
          handleClose={handleClose} // Pass handleClose for the simplified view's Done button
        />

        {/* Footer is now always rendered via ShareDialogFooter if showFooter is true */}
        {showFooter && (
          <ShareDialogFooter
            isLinkCopied={isLinkCopied}
            onCopyLink={onCopyLink}
            onDone={handleClose}
            canManagePermissions={canManagePermissions} // Pass canManagePermissions
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
