'use client'

import { FolderIcon, SearchIcon } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'

interface EmptyCollectionProps {
  style?: React.CSSProperties
}

export function EmptyCollection({ style }: EmptyCollectionProps) {
  return (
    <div style={style} className={'h-full pt-4'}>
      <EmptyState
        icon={FolderIcon}
        title="No events in this collection"
        subtitle="This collection is empty. Add events from the explore page or other collections."
        button={{
          href: '/explore',
          icon: SearchIcon,
          label: 'Search events',
        }}
        className={'h-full'}
      />
    </div>
  )
}
