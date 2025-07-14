'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Button, Input, VirtualizedTable } from '@zondax/ui-common/client'
import { Eye, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { CHAT_BOOKMARKS, CHAT_CHANNELS, MISSIONS } from '@/app/(app)/prio/store/prio-mock-data'

type BookmarksTabProps = Record<string, never>

export default function BookmarksTab(_props: BookmarksTabProps) {
  const router = useRouter()
  const [bookmarkSearchQuery, setBookmarkSearchQuery] = useState('')

  // Get all bookmarks with enriched data
  const allBookmarks = useMemo(() => {
    return Object.values(CHAT_BOOKMARKS)
      .map((bookmark) => {
        const chatChannel = CHAT_CHANNELS[bookmark.chatChannelId]
        const mission = chatChannel ? MISSIONS[chatChannel.missionId] : null
        return {
          ...bookmark,
          chatChannelName: chatChannel?.name || 'Unknown Chat',
          missionName: mission?.name || 'Unknown Mission',
        }
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [])

  // Filter bookmarks based on search
  const filteredBookmarks = useMemo(() => {
    let filtered = allBookmarks

    // Search filter
    if (bookmarkSearchQuery) {
      const query = bookmarkSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.content.toLowerCase().includes(query) ||
          bookmark.chatChannelName.toLowerCase().includes(query) ||
          bookmark.missionName.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [bookmarkSearchQuery, allBookmarks])

  const formatLastActivity = useCallback((date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ago`
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`
    }
    if (diffMinutes > 0) {
      return `${diffMinutes}m ago`
    }
    return 'Just now'
  }, [])

  const handleBookmarkNavigate = useCallback(
    (bookmarkId: string) => {
      const bookmark = CHAT_BOOKMARKS[bookmarkId]
      if (bookmark) {
        router.push(`/prio/chats/${bookmark.chatChannelId}`)
      }
    },
    [router]
  )

  // Define columns for the bookmarks table
  const bookmarkColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'title',
        header: 'Bookmark',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium truncate">{row.original.title}</div>
            <div className="text-xs text-muted-foreground truncate">{row.original.content}</div>
          </div>
        ),
        size: 250,
        minSize: 200,
        maxSize: 300,
      },
      {
        id: 'chatChannel',
        header: 'Chat',
        accessorKey: 'chatChannelName',
        cell: ({ row }) => <div className="text-sm">{row.original.chatChannelName}</div>,
        size: 180,
        minSize: 150,
        maxSize: 220,
      },
      {
        id: 'mission',
        header: 'Goal',
        accessorKey: 'missionName',
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.original.missionName}</div>,
        size: 150,
        minSize: 120,
        maxSize: 180,
      },
      {
        id: 'timestamp',
        header: 'Created',
        accessorKey: 'timestamp',
        cell: ({ row }) => <div className="text-xs text-muted-foreground">{formatLastActivity(row.original.timestamp)}</div>,
        size: 80,
        minSize: 70,
        maxSize: 100,
      },
      {
        id: 'actions',
        header: '',
        accessorKey: 'id',
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleBookmarkNavigate(row.original.id)
              }}
              className="h-6 w-6 p-0"
            >
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        ),
        size: 60,
        minSize: 60,
        maxSize: 60,
      },
    ],
    [formatLastActivity, handleBookmarkNavigate]
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search bookmarks, chats, or missions..."
            value={bookmarkSearchQuery}
            onChange={(e) => setBookmarkSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{filteredBookmarks.length} bookmarks</span>
        <span>•</span>
        <span>{new Set(filteredBookmarks.map((b) => b.missionName)).size} missions</span>
        <span>•</span>
        <span>{new Set(filteredBookmarks.map((b) => b.chatChannelName)).size} chats</span>
      </div>

      {/* Bookmarks List */}
      <div className="h-[600px] border rounded-lg flex flex-col">
        <VirtualizedTable
          data={filteredBookmarks}
          columns={bookmarkColumns as ColumnDef<any>[]}
          onRowClick={(row) => {
            if (row?.original?.id) {
              handleBookmarkNavigate(row.original.id)
            }
          }}
          enableSorting
          enableColumnResizing
          emptyContent="No bookmarks found. Try adjusting your search."
        />
      </div>
    </div>
  )
}
