'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ChangeEvent, KeyboardEvent } from 'react'

export interface ShareInviteInputProps {
  inputValue: string
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  onShare: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function ShareInviteInput({ inputValue, onInputChange, onShare, onKeyDown, inputRef }: ShareInviteInputProps) {
  return (
    <>
      <Label htmlFor="add-username-content" className="mb-2 block text-sm font-medium">
        Invite
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id="add-username-content"
          ref={inputRef}
          placeholder="Add username"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          className="flex-1"
          autoComplete="off"
        />
        <Button onClick={onShare} disabled={!inputValue.trim()} className="transition-all">
          Share
        </Button>
      </div>
    </>
  )
}
