import type { TopBarItem } from '@/components/topbar/types'

export const topBarItems: ReadonlyArray<TopBarItem> = [
  { key: 'explore', name: 'Explore', href: '/devui' },
  { key: 'collections', name: 'Collections', href: '/devui' },
  { key: 'empty', name: 'Empty', href: '/devui' },
  { key: 'empty2', name: 'Empty2', href: '/devui' },
  { key: 'empty3', name: 'Empty3', href: '/devui' },
]

export const backgroundStyles = [
  { name: 'Default Background', bg: 'bg-background text-foreground', position: '' },
  { name: 'Muted Background', bg: 'bg-muted text-muted-foreground', position: '' },
  { name: 'Card Background', bg: 'bg-card text-card-foreground', position: '' },
  { name: 'Accent Background', bg: 'bg-accent text-accent-foreground', position: '' },
]

// Define EventCard scenarios
export const eventCardScenarios = [
  // Default
  {
    title: 'EventCard - ColSpan 1',
    props: { colSpan: 1 },
    maxWidthClass: 'max-w-sm',
  },
  {
    title: 'EventCard - ColSpan 2',
    props: { colSpan: 2 },
    maxWidthClass: 'max-w-md',
  },
  {
    title: 'EventCard - ColSpan 3',
    props: { colSpan: 3 },
    maxWidthClass: 'max-w-lg',
  },
  // Compact
  {
    title: 'EventCard - Compact ColSpan 1',
    props: { isCompact: true, colSpan: 1 },
    maxWidthClass: 'max-w-xs',
  },
  {
    title: 'EventCard - Compact ColSpan 2',
    props: { isCompact: true, colSpan: 2 },
    maxWidthClass: 'max-w-sm',
  },
  {
    title: 'EventCard - Compact ColSpan 3',
    props: { isCompact: true, colSpan: 3 },
    maxWidthClass: 'max-w-md',
  },
]

export const eventSkeletonScenarios = [
  // Default
  {
    title: 'EventSkeleton - ColSpan 1',
    props: { colSpan: 1, index: 0 },
    maxWidthClass: 'max-w-sm',
  },
  {
    title: 'EventSkeleton - ColSpan 2',
    props: { colSpan: 2, index: 1 },
    maxWidthClass: 'max-w-md',
  },
  {
    title: 'EventSkeleton - ColSpan 3',
    props: { colSpan: 3, index: 2 },
    maxWidthClass: 'max-w-lg',
  },
  // Compact
  {
    title: 'EventSkeleton - Compact ColSpan 1',
    props: { isCompact: true, colSpan: 1, index: 3 },
    maxWidthClass: 'max-w-xs',
  },
  {
    title: 'EventSkeleton - Compact ColSpan 2',
    props: { isCompact: true, colSpan: 2, index: 4 },
    maxWidthClass: 'max-w-sm',
  },
  {
    title: 'EventSkeleton - Compact ColSpan 3',
    props: { isCompact: true, colSpan: 3, index: 5 },
    maxWidthClass: 'max-w-md',
  },
]
