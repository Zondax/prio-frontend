'use client'

import { FolderIcon, PlusIcon } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'

interface EmptyCollectionProps {
  style?: React.CSSProperties
  onCreateClick: () => void
}

export function EmptyCollection({ style, onCreateClick }: EmptyCollectionProps) {
  return (
    <div style={style} className={'h-full pt-4'}>
      <EmptyState
        icon={FolderIcon}
        title="No collections found"
        subtitle={<>You don&apos;t have any collections yet. Would you like to create one?</>}
        button={{
          onClick: onCreateClick,
          icon: PlusIcon,
          label: 'Create collection',
        }}
        className={'h-full'}
      />
    </div>
  )
}
