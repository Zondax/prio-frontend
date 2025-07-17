'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge, Button, Input, VirtualizedTable } from '@zondax/ui-common/client'
import { Eye, Key, MessageSquare, Search, Share2, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type { ChatChannelDetail } from '@/app/(app)/demo/store/prio-mock-data'

interface ChatsTabProps {
  allChats: ChatChannelDetail[]
}

export default function ChatsTab({ allChats }: ChatsTabProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'team'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'archived'>('active')
  const [selectedChat, setSelectedChat] = useState<ChatChannelDetail | null>(null)

  // Filter and search chats
  const filteredChats = useMemo(() => {
    let filtered = allChats

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((chat) => chat.type === selectedType)
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((chat) => chat.status === selectedStatus)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (chat) =>
          chat.name.toLowerCase().includes(query) ||
          chat.description.toLowerCase().includes(query) ||
          chat.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          chat.participants.some((participant) => participant.name.toLowerCase().includes(query))
      )
    }

    // Sort by last activity (most recent first)
    return filtered.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }, [searchQuery, selectedType, selectedStatus, allChats])

  const handleChatClick = useCallback(
    (chat: ChatChannelDetail) => {
      if (chat?.id) {
        router.push(`/prio/chats/${chat.id}`)
      }
    },
    [router]
  )

  const handleChatPreview = useCallback((chat: ChatChannelDetail, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedChat(chat)
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getTypeIcon = useCallback((type: string, isShared: boolean) => {
    if (type === 'team' || isShared) {
      return <Share2 className="w-4 h-4 text-blue-500" />
    }
    return <Key className="w-4 h-4 text-green-500" />
  }, [])

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

  // Define columns for the chats table
  const chatColumns = useMemo<ColumnDef<ChatChannelDetail>[]>(
    () => [
      {
        id: 'type',
        header: '',
        accessorKey: 'type',
        cell: ({ row }) => getTypeIcon(row.original.type, row.original.isShared),
        size: 32,
        minSize: 32,
        maxSize: 32,
      },
      {
        id: 'name',
        header: 'Chat',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium truncate">{row.original.name}</div>
            <div className="text-xs text-muted-foreground truncate">{row.original.description}</div>
          </div>
        ),
        size: 220,
        minSize: 180,
        maxSize: 280,
      },
      {
        id: 'chatType',
        header: 'Type',
        accessorKey: 'type',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.original.type}
          </Badge>
        ),
        size: 70,
        minSize: 60,
        maxSize: 80,
      },
      {
        id: 'participants',
        header: 'Users',
        accessorKey: 'participants',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs">{row.original.participants.length}</span>
          </div>
        ),
        size: 60,
        minSize: 50,
        maxSize: 70,
      },
      {
        id: 'messages',
        header: 'Msgs',
        accessorKey: 'messageCount',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs">{row.original.messageCount}</span>
          </div>
        ),
        size: 60,
        minSize: 50,
        maxSize: 70,
      },
      {
        id: 'lastActivity',
        header: 'Activity',
        accessorKey: 'lastActivity',
        cell: ({ row }) => <div className="text-xs text-muted-foreground">{formatLastActivity(row.original.lastActivity)}</div>,
        size: 80,
        minSize: 70,
        maxSize: 100,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
        size: 80,
        minSize: 70,
        maxSize: 90,
      },
      {
        id: 'actions',
        header: '',
        accessorKey: 'id',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handleChatPreview(row.original, e)
            }}
            className="h-6 w-6 p-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
        ),
        size: 40,
        minSize: 40,
        maxSize: 40,
      },
    ],
    [getStatusColor, formatLastActivity, getTypeIcon, handleChatPreview]
  )

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search chats, participants, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{filteredChats.length} chats</span>
        <span>•</span>
        <span>{filteredChats.filter((c) => c.status === 'active').length} active</span>
        <span>•</span>
        <span>{filteredChats.filter((c) => c.type === 'team').length} team chats</span>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Chat List */}
        <div className="flex-1">
          <div className="h-[600px] border rounded-lg flex flex-col">
            <VirtualizedTable
              data={filteredChats}
              columns={chatColumns as ColumnDef<any>[]}
              onRowClick={(row) => {
                if (row?.original) {
                  handleChatClick(row.original)
                }
              }}
              enableSorting
              enableColumnResizing
              emptyContent="No chats found. Try adjusting your search or filters."
            />
          </div>
        </div>

        {/* Chat Preview Sidebar */}
        {selectedChat && (
          <div className="w-96 border rounded-lg bg-background p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedChat.type, selectedChat.isShared)}
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{selectedChat.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)} className="h-8 w-8 p-0">
                ×
              </Button>
            </div>

            {/* Chat Info */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(selectedChat.status)}>{selectedChat.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{selectedChat.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages:</span>
                <span>{selectedChat.messageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Activity:</span>
                <span>{formatLastActivity(selectedChat.lastActivity)}</span>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Participants</h4>
              <div className="space-y-1">
                {selectedChat.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{participant.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span>{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {selectedChat.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Last Message Preview */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Latest Message</h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{selectedChat.lastMessage}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedChat.lastActivity.toLocaleString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" onClick={() => handleChatClick(selectedChat)}>
                Open Chat
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
