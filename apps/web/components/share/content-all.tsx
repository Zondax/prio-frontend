'use client'

import { useRef, useState } from 'react'

import { ShareDialogSkeletonContent } from '@/components/share/dialog-skeleton'
import { ShareGeneralAccess } from './content-general-access'
import { ShareInviteInput } from './content-invite-input'
import { SharePeopleList } from './content-people-list'
import type { DialogSharedPerson } from './types'

export interface ShareDialogContentProps {
  title: string // For skeleton
  people: DialogSharedPerson[]
  isLinkCopied?: boolean
  onShare?: (emails: string) => void
  onCopyLink?: () => void
  onAccessChange?: (accessType: string) => void
  onRoleChange?: (personId: string, role: string) => void | Promise<void>
  onRemove?: (personId: string) => void | Promise<void>
  canManagePermissions: boolean
  roles: { value: string; label: string; description?: string }[]
  accessTypes: { value: string; label: string; description?: string; icon?: React.ReactNode }[]
  selectedAccessType: string // This will be effectiveAccessType from parent
  isLoading?: boolean
  handleClose: () => void // For the Done button in simplified view
}

export function ShareDialogContent({
  title,
  people = [],
  isLinkCopied,
  onShare,
  onCopyLink,
  onAccessChange,
  onRoleChange,
  onRemove,
  canManagePermissions,
  roles,
  accessTypes,
  selectedAccessType,
  isLoading = false,
  handleClose,
}: ShareDialogContentProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleShareInternal = () => {
    if (inputValue.trim() && onShare) {
      onShare(inputValue)
      setInputValue('')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleShareInternal()
    }
  }

  const getRoleDisplayName = (roleValue: string) => {
    const role = roles.find((r) => r.value === roleValue)
    return role?.label || roleValue
  }

  if (isLoading) {
    return <ShareDialogSkeletonContent title={title} />
  }

  // Main content for when canManagePermissions is true
  return (
    <>
      <div className="space-y-6">
        <div>
          <ShareInviteInput
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            onShare={handleShareInternal}
            onKeyDown={handleKeyDownInternal}
            inputRef={inputRef}
          />
        </div>

        {people.length > 0 && (
          <SharePeopleList
            people={people}
            roles={roles}
            getRoleDisplayName={getRoleDisplayName}
            onRemovePerson={onRemove}
            onRoleChange={onRoleChange}
          />
        )}

        <div>
          <ShareGeneralAccess selectedAccessType={selectedAccessType} onAccessChange={onAccessChange} accessTypes={accessTypes} />
        </div>
      </div>
    </>
  )
}
