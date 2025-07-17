'use client'

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@zondax/ui-common/client'
import { Bookmark, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { CHAT_BOOKMARKS, getAllChatsWithDetails } from '@/app/(app)/demo/store/prio-mock-data'
import BookmarksTab from './tab-bookmarks'
import ChatsTab from './tab-chats'

export default function AllChatsPage() {
  const router = useRouter()

  // Get all chats with details
  const allChats = useMemo(() => getAllChatsWithDetails(), [])

  // Get all bookmarks for count
  const allBookmarks = useMemo(() => Object.values(CHAT_BOOKMARKS), [])

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chats" className="h-full flex flex-col">
        {/* Tabs */}
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 pt-2">
            <TabsList>
              <TabsTrigger value="chats">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats ({allChats.length})
              </TabsTrigger>
              <TabsTrigger value="bookmarks">
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarks ({allBookmarks.length})
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="border-b border-border" />
        </div>

        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">All Chats</h1>
                <p className="text-muted-foreground">Manage and search through all your conversations</p>
              </div>
              <Button onClick={() => router.push('/prio/chat')}>
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="chats" className="flex-1 overflow-hidden">
          <div className="p-6">
            <ChatsTab allChats={allChats} />
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="flex-1 overflow-hidden">
          <div className="p-6">
            <BookmarksTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
