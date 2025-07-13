'use client'

import {
  type ChatBookmark,
  ChatBookmarkPanel,
  ChatInput,
  type ChatThread,
  GenericChatMessage,
  MessageList,
  registerSampleTools,
  SidebarVariant,
  type StandardChatMessage,
  type TextSelection,
  ToolRegistryProvider,
  useAppShell,
  useRightSidebarItem,
  useToolRegistry,
} from '@zondax/ui-common/client'
import { Bot, Code, Database, FileText, Palette, Users, Zap } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

// Chat configuration mapping - icons are created in getIcon() to avoid JSX at module level
const CHAT_CONFIGS = {
  '00000000-0000-0000-0000-000000000000': {
    name: 'Code Review Assistant',
    type: 'individual' as const,
    iconName: 'Code' as const,
    description: 'AI assistant for code review and analysis',
    theme: 'code' as const,
    tools: ['code-analysis', 'git-integration', 'linting'],
    mockMessages: [
      {
        role: 'assistant' as const,
        content:
          "Hello! I'm your Code Review Assistant. I can help you review code, identify issues, and suggest improvements. Would you like to start by sharing some code for review?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        role: 'user' as const,
        content: 'Can you help me review this React component?',
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        role: 'assistant' as const,
        content:
          "Absolutely! Please share the React component code and I'll provide a thorough review covering:\n\n• Code structure and organization\n• Performance considerations\n• Best practices\n• Potential bugs or issues\n• Accessibility improvements\n\nGo ahead and paste the code!",
        timestamp: new Date(Date.now() - 3400000),
      },
    ],
  },
  '00000000-0000-0000-0000-000000000001': {
    name: 'Data Analysis Helper',
    type: 'individual' as const,
    iconName: 'Database' as const,
    description: 'AI assistant for data analysis and visualization',
    theme: 'data' as const,
    tools: ['data-analysis', 'visualization', 'statistics'],
    mockMessages: [
      {
        role: 'assistant' as const,
        content:
          "Hi there! I'm your Data Analysis Helper. I can assist with data processing, statistical analysis, and creating visualizations. What kind of data are you working with today?",
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        role: 'user' as const,
        content: 'I have sales data for the last quarter and need to identify trends',
        timestamp: new Date(Date.now() - 7100000),
      },
      {
        role: 'assistant' as const,
        content:
          "Perfect! I can help you analyze your quarterly sales data. Here's what I can do:\n\n📊 **Trend Analysis**: Identify patterns and seasonal variations\n📈 **Performance Metrics**: Calculate key indicators like growth rates\n🎯 **Visualization**: Create charts and graphs to visualize trends\n📋 **Insights**: Provide actionable recommendations\n\nCould you share the data format you're working with? (CSV, JSON, Excel, etc.)",
        timestamp: new Date(Date.now() - 7000000),
      },
    ],
  },
  '00000000-0000-0000-0000-000000000002': {
    name: 'Alpha Team + AI',
    type: 'team' as const,
    iconName: 'Users' as const,
    description: 'Team collaboration chat with AI assistance',
    theme: 'team' as const,
    tools: ['collaboration', 'project-management', 'team-chat'],
    participants: ['John', 'Sarah', 'Mike', 'AI Assistant'],
    mockMessages: [
      {
        role: 'user' as const,
        content: 'Hey team! The frontend components are ready for testing. @AI can you help us create a testing checklist?',
        timestamp: new Date(Date.now() - 1800000),
        metadata: { author: 'John' },
      },
      {
        role: 'assistant' as const,
        content:
          "Great work John! Here's a comprehensive testing checklist for the frontend components:\n\n✅ **Functionality Tests**\n• Component renders correctly\n• Props are handled properly\n• Event handlers work as expected\n\n✅ **Visual Tests**\n• Responsive design across devices\n• Accessibility compliance\n• Cross-browser compatibility\n\n✅ **Performance Tests**\n• Load time optimization\n• Memory usage\n• Re-render efficiency\n\nWould you like me to create specific test cases for any particular component?",
        timestamp: new Date(Date.now() - 1700000),
      },
      {
        role: 'user' as const,
        content: "This is perfect! I'll start with the button component tests. Sarah, can you handle the form components?",
        timestamp: new Date(Date.now() - 1600000),
        metadata: { author: 'John' },
      },
      {
        role: 'user' as const,
        content: "Absolutely! I'll focus on form validation and input handling. Mike, are you available to help with the responsive tests?",
        timestamp: new Date(Date.now() - 1500000),
        metadata: { author: 'Sarah' },
      },
    ],
  },
  '00000000-0000-0000-0000-000000000003': {
    name: 'Project Planning AI',
    type: 'individual' as const,
    iconName: 'FileText' as const,
    description: 'AI assistant for project planning and management',
    theme: 'planning' as const,
    tools: ['project-planning', 'task-management', 'timeline'],
    mockMessages: [
      {
        role: 'assistant' as const,
        content:
          "Hello! I'm your Project Planning AI. I can help you create project plans, break down tasks, estimate timelines, and track progress. What project are you working on?",
        timestamp: new Date(Date.now() - 5400000),
      },
      {
        role: 'user' as const,
        content: 'I need to plan a new feature rollout for our web application',
        timestamp: new Date(Date.now() - 5300000),
      },
      {
        role: 'assistant' as const,
        content:
          "Excellent! Let's create a structured plan for your feature rollout. I'll help you with:\n\n🎯 **Feature Scope**: Define requirements and acceptance criteria\n📋 **Task Breakdown**: Split into manageable development tasks\n⏱️ **Timeline**: Realistic estimates and milestones\n👥 **Resource Planning**: Team assignments and dependencies\n🚀 **Rollout Strategy**: Deployment and release planning\n\nCould you tell me more about the feature you're planning to rollout?",
        timestamp: new Date(Date.now() - 5200000),
      },
    ],
  },
  '00000000-0000-0000-0000-000000000004': {
    name: 'Beta Design Studio',
    type: 'team' as const,
    iconName: 'Palette' as const,
    description: 'Design collaboration chat with creative AI',
    theme: 'design' as const,
    tools: ['design-feedback', 'color-theory', 'ui-patterns'],
    participants: ['Emma', 'David', 'Lisa', 'Design AI'],
    mockMessages: [
      {
        role: 'user' as const,
        content: "Team, I've uploaded the new landing page mockups. What do you think about the color scheme?",
        timestamp: new Date(Date.now() - 2700000),
        metadata: { author: 'Emma' },
      },
      {
        role: 'assistant' as const,
        content:
          "Looking at the mockups, I love the direction! Here's my analysis of the color scheme:\n\n🎨 **Strengths**:\n• Great contrast for accessibility\n• Cohesive brand alignment\n• Modern and clean aesthetic\n\n💡 **Suggestions**:\n• Consider adding a subtle accent color for CTAs\n• The blue could be slightly warmer for better engagement\n• Test with different backgrounds for versatility\n\nWould you like me to generate some color variations?",
        timestamp: new Date(Date.now() - 2600000),
      },
      {
        role: 'user' as const,
        content: 'The typography looks great too! I especially like the heading hierarchy.',
        timestamp: new Date(Date.now() - 2500000),
        metadata: { author: 'David' },
      },
    ],
  },
  '00000000-0000-0000-0000-000000000005': {
    name: 'Documentation Writer',
    type: 'individual' as const,
    iconName: 'FileText' as const,
    description: 'AI assistant for writing and organizing documentation',
    theme: 'docs' as const,
    tools: ['documentation', 'writing', 'organization'],
    mockMessages: [
      {
        role: 'assistant' as const,
        content:
          "Hello! I'm your Documentation Writer. I can help you create clear, comprehensive documentation for your projects. Whether it's API docs, user guides, or technical specifications, I'm here to help. What would you like to document?",
        timestamp: new Date(Date.now() - 4500000),
      },
      {
        role: 'user' as const,
        content: 'I need help writing API documentation for our new REST endpoints',
        timestamp: new Date(Date.now() - 4400000),
      },
      {
        role: 'assistant' as const,
        content:
          "Perfect! I'll help you create comprehensive API documentation. Let's structure it properly:\n\n📚 **Documentation Structure**:\n• Overview and authentication\n• Endpoint descriptions with HTTP methods\n• Request/response examples\n• Error handling and status codes\n• Rate limiting and best practices\n\n🛠️ **For each endpoint, I'll include**:\n• Purpose and functionality\n• Parameters and data types\n• Sample requests and responses\n• Common use cases\n\nCould you share the first endpoint you'd like to document?",
        timestamp: new Date(Date.now() - 4300000),
      },
    ],
  },
  '00000000-0000-0000-0000-000000000006': {
    name: 'Gamma Planning Bot',
    type: 'team' as const,
    iconName: 'Zap' as const,
    description: 'Strategic planning AI for project gamma',
    theme: 'strategy' as const,
    tools: ['strategic-planning', 'analysis', 'forecasting'],
    participants: ['Alex', 'Jordan', 'Taylor', 'Planning AI'],
    mockMessages: [
      {
        role: 'user' as const,
        content: 'Team, we need to finalize our Q2 strategy for Project Gamma. What are the key priorities?',
        timestamp: new Date(Date.now() - 3600000),
        metadata: { author: 'Alex' },
      },
      {
        role: 'assistant' as const,
        content:
          'Based on our previous discussions and market analysis, here are the key Q2 priorities for Project Gamma:\n\n🎯 **Strategic Priorities**:\n1. **Market Expansion** - Target 3 new geographic regions\n2. **Product Enhancement** - Implement user-requested features\n3. **Partnership Development** - Establish 2-3 strategic partnerships\n4. **Performance Optimization** - Improve system efficiency by 30%\n\n📊 **Success Metrics**:\n• User acquisition targets\n• Revenue growth projections\n• Customer satisfaction scores\n\nShould we dive deeper into any of these areas?',
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        role: 'user' as const,
        content: 'The partnership development sounds promising. What kind of partnerships should we prioritize?',
        timestamp: new Date(Date.now() - 3400000),
        metadata: { author: 'Jordan' },
      },
    ],
  },
} as const

type ChatId = keyof typeof CHAT_CONFIGS
type IconName = 'Code' | 'Database' | 'Users' | 'FileText' | 'Palette' | 'Zap' | 'Bot'
type ChatConfig = {
  name: string
  type: 'individual' | 'team'
  iconName: IconName
  description: string
  theme: string
  tools: string[]
  participants?: string[]
  mockMessages: Array<{
    role: 'assistant' | 'user'
    content: string
    timestamp: Date
    metadata?: { author?: string }
  }>
}

// Helper function to get icon component from name
function getIcon(iconName: IconName): React.ReactNode {
  const icons = {
    Code: <Code className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    FileText: <FileText className="w-5 h-5" />,
    Palette: <Palette className="w-5 h-5" />,
    Zap: <Zap className="w-5 h-5" />,
    Bot: <Bot className="w-5 h-5" />,
  }
  return icons[iconName]
}

function ChatPageContentWithConfig({ config }: { config: ChatConfig }) {
  const appShell = useAppShell()

  // Simple local state for demo purposes
  const [messages, setMessages] = useState<StandardChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const userId = 'demo-user'

  // Local UI state
  const [inputValue, setInputValue] = useState('')
  const [bookmarks, setBookmarks] = useState<ChatBookmark[]>([])
  const [selectedBookmark, setSelectedBookmark] = useState<string>()
  const [initialized, setInitialized] = useState(false)
  const [_activeThreads, setActiveThreads] = useState<ChatThread[]>([])
  const [_activeRightTab, _setActiveRightTab] = useState<'bookmarks' | 'threads'>('bookmarks')

  // Memoize mock messages to avoid useEffect dependency issues
  const mockMessagesContent = useMemo(() => {
    return config.mockMessages.map((msg) => ({ role: msg.role, content: msg.content }))
  }, [config.mockMessages.map]) // Only depend on length and first message

  // Initialize with mock messages on first load (only for predefined chats)
  useEffect(() => {
    if (!initialized && mockMessagesContent.length > 0) {
      // Transform mock messages to StandardChatMessage format
      const transformedMockMessages: StandardChatMessage[] = config.mockMessages.map((msg, index) => ({
        id: `msg-${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        bookmarks: [],
        threads: [],
        reactions: [],
        textSelection: { highlights: [] },
        attachments: [],
        metadata: {
          processingTime: msg.role === 'assistant' ? Math.floor(Math.random() * 1000 + 200) : undefined,
          author: msg.metadata?.author,
        },
      }))
      
      setMessages(transformedMockMessages)
      setInitialized(true)
    }
  }, [initialized, mockMessagesContent.length, config.mockMessages])

  // Display messages with streaming support
  const displayMessages = useMemo(() => {
    if (isLoading && messages.length > 0) {
      const streamingMessage: StandardChatMessage = {
        id: 'loading',
        role: 'assistant',
        content: 'AI is thinking...',
        timestamp: new Date(),
        bookmarks: [],
        threads: [],
        reactions: [],
        textSelection: { highlights: [] },
        attachments: [],
        metadata: {
          isStreaming: true,
        },
      }
      return [...messages, streamingMessage]
    }
    return messages
  }, [messages, isLoading])

  // Handle sending messages (simplified demo version)
  const handleSendMessage = useCallback(
    (messageContent: string) => {
      if (!messageContent.trim() || isLoading) return

      // Add user message
      const userMessage: StandardChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
        bookmarks: [],
        threads: [],
        reactions: [],
        textSelection: { highlights: [] },
        attachments: [],
        metadata: {},
      }

      setMessages(prev => [...prev, userMessage])
      setInputValue('')
      setIsLoading(true)

      // Simulate assistant response after a delay
      setTimeout(() => {
        const assistantMessage: StandardChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: `Thank you for your message: "${messageContent}". This is a demo response from the ${config.name}.`,
          timestamp: new Date(),
          bookmarks: [],
          threads: [],
          reactions: [],
          textSelection: { highlights: [] },
          attachments: [],
          metadata: {
            processingTime: Math.floor(Math.random() * 1000 + 500),
          },
        }
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1500)
    },
    [isLoading, config.name]
  )

  // Text selection and bookmark handlers
  const handleTextSelection = useCallback((selection: TextSelection) => {
    console.log('Text selected:', selection)
  }, [])

  const handleBookmark = useCallback((type: string, selection?: TextSelection) => {
    if (!selection) return

    const newBookmark: ChatBookmark = {
      id: `bookmark-${Date.now()}`,
      messageId: '',
      type: type as any,
      content: selection.text,
      title: `${type} bookmark`,
      timestamp: new Date(),
      color: 'blue',
      position: {
        start: selection.start,
        end: selection.end,
        text: selection.text,
      },
    }

    setBookmarks((prev) => [...prev, newBookmark])
  }, [])

  const handleHighlight = useCallback((selection: TextSelection, messageId?: string) => {
    console.log('Text highlighted:', selection, 'in message:', messageId)
  }, [])

  const handleQuote = useCallback((selection: TextSelection) => {
    setInputValue((prev) => `${prev}\n> ${selection.text}\n\n`)
  }, [])

  const handleShare = useCallback((selection: TextSelection) => {
    navigator.clipboard.writeText(selection.text)
    console.log('Text shared:', selection)
  }, [])

  // Thread handlers
  const _handleStartThread = useCallback(
    (messageId: string, content?: string) => {
      console.log('Starting thread on message:', messageId, 'with content:', content)
      // In a real implementation, this would create a new thread
      const newThread: ChatThread = {
        id: `thread-${Date.now()}`,
        parentMessageId: messageId,
        messages: [],
        isExpanded: false,
        unreadCount: 0,
        lastActivity: new Date(),
        participants: [
          {
            id: userId,
            name: 'You',
            avatar: undefined,
            role: 'participant' as const,
          },
        ],
      }
      setActiveThreads((prev) => [...prev, newThread])
    },
    [userId]
  )

  const _handleViewThread = useCallback((threadId: string) => {
    console.log('Viewing thread:', threadId)
    // In a real implementation, this would open the thread view
  }, [])

  // Bookmark panel handlers
  const handleBookmarkSelect = useCallback((bookmarkId: string) => {
    setSelectedBookmark(bookmarkId)
  }, [])

  const handleBookmarkNavigate = useCallback((bookmarkId: string) => {
    console.log('Navigate to bookmark:', bookmarkId)
  }, [])

  const handleBookmarkDelete = useCallback((bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId))
  }, [])

  const handleClearAllBookmarks = useCallback(() => {
    setBookmarks([])
    setSelectedBookmark(undefined)
  }, [])

  // Create bookmark panel component
  const bookmarkPanelComponent = useMemo(() => {
    if (bookmarks.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-muted-foreground">No bookmarks yet. Select text in messages to create bookmarks.</div>
      )
    }

    return (
      <ChatBookmarkPanel
        bookmarks={bookmarks}
        selectedBookmark={selectedBookmark}
        onBookmarkSelect={handleBookmarkSelect}
        onBookmarkNavigate={handleBookmarkNavigate}
        onBookmarkDelete={handleBookmarkDelete}
        onClearAll={handleClearAllBookmarks}
        className="h-full"
      />
    )
  }, [bookmarks, selectedBookmark, handleBookmarkSelect, handleBookmarkNavigate, handleBookmarkDelete, handleClearAllBookmarks])

  // Add bookmark panel to right sidebar
  useRightSidebarItem('chat-bookmarks', bookmarkPanelComponent, 'start', 10)

  // Setup AppShell to show right sidebar when there are bookmarks or we want to show the empty state
  useEffect(() => {
    appShell.setRightSidebar({
      enabled: true,
      component: null, // Use embedded components instead
      variant: SidebarVariant.Sidebar,
      collapsible: true,
      defaultOpen: true,
      width: '300px',
      header: 'Bookmarks',
    })

    // Cleanup on unmount
    return () => {
      appShell.setRightSidebar(null)
    }
  }, [appShell.setRightSidebar])

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 p-4">
          {getIcon(config.iconName)}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-lg truncate">{config.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{config.description}</p>
            {bookmarks.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {bookmarks.length} bookmark{bookmarks.length === 1 ? '' : 's'}
              </p>
            )}
          </div>
          {config.type === 'team' && config.participants && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{config.participants.length} participants</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {displayMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl">{getIcon(config.iconName)}</div>
              <p className="text-lg font-medium">{config.name}</p>
              <p className="text-sm text-muted-foreground max-w-md">{config.description}</p>
              <p className="text-xs text-muted-foreground">
                {config.type === 'team' ? 'Team collaboration space' : 'Personal AI assistant'}
              </p>
            </div>
          </div>
        ) : (
          <MessageList
            messages={displayMessages}
            className="h-full p-2"
            bookmarks={bookmarks}
            activeBookmark={selectedBookmark}
            showAvatars
            onMessageAction={(_messageId, action, data) => {
              // Handle message actions
              if (action === 'bookmark' && data?.type && data?.selection) {
                handleBookmark(data.type, data.selection)
              } else if (action === 'copy' && data?.text) {
                // Handle copy action
              }
            }}
            renderMessage={(message, options) => (
              <GenericChatMessage
                message={message}
                variant={options.variant}
                showAvatar={options.showAvatar}
                isStreaming={message.metadata?.isStreaming}
                streamingText={message.metadata?.isStreaming ? (message.content as string) : undefined}
                enableTextSelection
                enableHighlighting
                enableQuoting
                enableSharing
                onSelectionChange={handleTextSelection}
                onBookmark={handleBookmark}
                onHighlight={handleHighlight}
                onQuote={handleQuote}
                onShare={handleShare}
              />
            )}
          />
        )}
      </div>

      {/* Input Area */}
      <div className="bg-background p-4 border-t">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          placeholder={`Message ${config.name}...`}
          isLoading={isLoading}
          disabled={isLoading}
          enableVoice={false}
          enableCommands={false}
          enableAttachments={false}
          size="compact"
        />
      </div>
    </div>
  )
}

// Tool Registry Initializer
function ToolRegistryInitializer() {
  const { register } = useToolRegistry()

  useEffect(() => {
    registerSampleTools({ register })
  }, [register])

  return null
}

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Default config for new/unknown chats
const DEFAULT_NEW_CHAT_CONFIG: ChatConfig = {
  name: 'New Chat',
  type: 'individual',
  iconName: 'Bot' as IconName,
  description: 'Start a new conversation',
  theme: 'default' as const,
  tools: [],
  mockMessages: [], // No mock messages for new chats
}

export default function ChatPage() {
  const { chatId } = useParams()
  const chatIdString = chatId as string

  // Check if chatId is a valid UUID format
  if (!isValidUUID(chatIdString)) {
    notFound()
  }

  // Get config from predefined chats or use default for new chats
  const config: ChatConfig = useMemo(() => {
    const predefinedConfig = CHAT_CONFIGS[chatIdString as ChatId]
    return predefinedConfig
      ? {
          ...predefinedConfig,
          tools: [...predefinedConfig.tools],
          participants:
            'participants' in predefinedConfig && predefinedConfig.participants ? [...predefinedConfig.participants] : undefined,
          mockMessages: [...predefinedConfig.mockMessages],
        }
      : {
          ...DEFAULT_NEW_CHAT_CONFIG,
          name: `Chat ${chatIdString.substring(0, 8)}`, // Use first 8 characters as identifier
          description: `New chat session - ${chatIdString.substring(0, 8)}`,
        }
  }, [chatIdString])

  return (
    <ToolRegistryProvider>
      <ToolRegistryInitializer />
      <ChatPageContentWithConfig config={config} />
    </ToolRegistryProvider>
  )
}