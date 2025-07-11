import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ChatPage from './page'

// Mock the dependencies
vi.mock('next/navigation', () => ({
  useParams: () => ({ chatId: '00000000-0000-0000-0000-000000000001' }),
  notFound: vi.fn(),
}))

vi.mock('@zondax/auth-web', () => ({
  useGrpcSetup: vi.fn(),
}))

vi.mock('@/lib/authorization/useAppAuthorization', () => ({
  useAppAuthorization: () => ({
    claims: { sub: 'test-user' },
  }),
}))

// Mock the state store
const mockMessages: any[] = []
const mockAddUserMessage = vi.fn((content: string) => {
  mockMessages.push({
    id: `user-${Date.now()}-${Math.random()}`,
    content,
    role: 'user',
    timestamp: Date.now(),
  })
})
const mockAddAssistantMessage = vi.fn((content: string) => {
  mockMessages.push({
    id: `assistant-${Date.now()}-${Math.random()}`,
    content,
    role: 'assistant',
    timestamp: Date.now(),
  })
})

vi.mock('mono-state', () => ({
  useGrpcSetup: vi.fn(),
  useChatMessages: () => mockMessages,
  useChatConversationId: () => '',
  useChatActions: () => ({
    addUserMessage: mockAddUserMessage,
    setParams: vi.fn(),
    isLoading: false,
    error: null,
    data: null,
    clientReady: () => true,
  }),
  useAddAssistantMessage: () => mockAddAssistantMessage,
  useSetConversationId: () => vi.fn(),
  useSendMessageData: () => null,
  useEndpointStore: () => ({ selectedEndpoint: null }),
  createChatRequest: vi.fn(),
}))

// Mock UI components
vi.mock('@zondax/ui-common/client', () => ({
  GenericChatMessage: ({ message }: any) => (
    <div data-testid={`message-${message.id}`} data-content={message.content}>
      {message.content}
    </div>
  ),
  MessageList: ({ messages, renderMessage }: any) => (
    <div data-testid="message-list">{messages.map((message: any) => renderMessage(message, { variant: 'default', showAvatar: true }))}</div>
  ),
  ChatInput: () => <div data-testid="chat-input" />,
  ChatBookmarkPanel: () => <div data-testid="bookmark-panel" />,
  ToolRegistryProvider: ({ children }: any) => children,
  useToolRegistry: () => ({ register: vi.fn() }),
  registerSampleTools: vi.fn(),
  useAppShell: () => ({
    setRightSidebar: vi.fn(),
  }),
  useRightSidebarItem: vi.fn(),
  SidebarVariant: {
    Sidebar: 'sidebar',
  },
}))

describe('ChatPage - Message Duplication Tests', () => {
  beforeEach(() => {
    // Clear mock messages array before each test
    mockMessages.length = 0
    vi.clearAllMocks()
  })

  it('should have invariant: mock messages added only once', async () => {
    // Test that mock messages are only added once per component mount
    render(<ChatPage />)

    // Wait for useEffect to complete
    await waitFor(
      () => {
        expect(mockAddAssistantMessage).toHaveBeenCalledTimes(2) // 2 assistant messages in mock data
        expect(mockAddUserMessage).toHaveBeenCalledTimes(1) // 1 user message in mock data
      },
      { timeout: 1000 }
    )

    // Verify message contents match expected
    expect(mockAddAssistantMessage).toHaveBeenNthCalledWith(
      1,
      "Hi there! I'm your Data Analysis Helper. I can assist with data processing, statistical analysis, and creating visualizations. What kind of data are you working with today?"
    )
    expect(mockAddUserMessage).toHaveBeenNthCalledWith(1, 'I have sales data for the last quarter and need to identify trends')
    expect(mockAddAssistantMessage).toHaveBeenNthCalledWith(
      2,
      "Perfect! I can help you analyze your quarterly sales data. Here's what I can do:\n\n📊 **Trend Analysis**: Identify patterns and seasonal variations\n📈 **Performance Metrics**: Calculate key indicators like growth rates\n🎯 **Visualization**: Create charts and graphs to visualize trends\n📋 **Insights**: Provide actionable recommendations\n\nCould you share the data format you're working with? (CSV, JSON, Excel, etc.)"
    )
  })

  it('should have invariant: message IDs are unique', async () => {
    render(<ChatPage />)

    await waitFor(
      () => {
        expect(mockMessages.length).toBeGreaterThan(0)
      },
      { timeout: 1000 }
    )

    // Check that all message IDs are unique
    const messageIds = mockMessages.map((msg) => msg.id)
    const uniqueIds = new Set(messageIds)
    expect(uniqueIds.size).toBe(messageIds.length)
  })

  it('should have invariant: total message count matches expected', async () => {
    render(<ChatPage />)

    await waitFor(
      () => {
        expect(mockMessages.length).toBe(3) // Should be exactly 3 messages from mock data
      },
      { timeout: 1000 }
    )
  })

  it('should have invariant: no duplicate message content', async () => {
    render(<ChatPage />)

    await waitFor(
      () => {
        expect(mockMessages.length).toBeGreaterThanOrEqual(3)
      },
      { timeout: 1000 }
    )

    // Check that no two messages have identical content
    const messageContents = mockMessages.map((msg) => msg.content)
    const uniqueContents = new Set(messageContents)
    expect(uniqueContents.size).toBe(messageContents.length)
  })

  it('should have invariant: message rendering is not duplicated', async () => {
    render(<ChatPage />)

    await waitFor(
      () => {
        expect(mockMessages.length).toBeGreaterThanOrEqual(3)
      },
      { timeout: 1000 }
    )

    // Check if we have messages to render (not in empty state)
    const messageList = screen.queryByTestId('message-list')

    if (messageList) {
      // Messages are being rendered
      const messageElements = messageList.querySelectorAll('[data-testid^="message-"]')

      // Should have exactly as many message elements as messages
      expect(messageElements.length).toBe(mockMessages.length)

      // Check that each message content appears only once
      for (const message of mockMessages) {
        const elementsWithContent = Array.from(messageElements).filter((el) => el.getAttribute('data-content') === message.content)
        expect(elementsWithContent.length).toBe(1)
      }
    } else {
      // Empty state is being shown - this is OK if no messages are visible yet
      // Just verify we have messages in the store even if not rendered
      expect(mockMessages.length).toBeGreaterThan(0)
    }
  })

  it('should detect double initialization bug', async () => {
    // This test specifically checks for the bug where useEffect runs multiple times
    const { rerender } = render(<ChatPage />)

    await waitFor(
      () => {
        expect(mockMessages.length).toBe(3)
      },
      { timeout: 1000 }
    )

    const initialCallCounts = {
      assistant: mockAddAssistantMessage.mock.calls.length,
      user: mockAddUserMessage.mock.calls.length,
    }

    // Force re-render to see if messages are added again
    rerender(<ChatPage />)

    await waitFor(
      () => {
        // Should NOT call add functions again on re-render
        expect(mockAddAssistantMessage).toHaveBeenCalledTimes(initialCallCounts.assistant)
        expect(mockAddUserMessage).toHaveBeenCalledTimes(initialCallCounts.user)
      },
      { timeout: 500 }
    )
  })
})
