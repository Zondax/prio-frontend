# ADR-001: Chat Components Architecture Refactor

**Status**: In Progress  
**Date**: 2025-07-04  
**Authors**: @development-team  
**Reviewers**: @frontend-team, @architecture-team  

## Executive Summary

### Current Problem
The existing chat components in `libs/ui-web/src/components/chat/` suffer from several architectural issues that limit their flexibility, maintainability, and reusability:

1. **Monolithic Design**: Components like `ChatContainer` (380 lines), `ChatMessage` (300 lines), and `ChatMessageList` (400 lines) try to handle too many responsibilities
2. **Hardcoded Assumptions**: Role types (`'user' | 'assistant' | 'system'`) and content types (`string`) are baked into the component interfaces
3. **Feature Bloat**: Built-in features like bookmarks, reactions, and threading are mandatory even when not needed
4. **Styling Inconsistency**: CVA-based styling scattered across components instead of unified CSS approach
5. **Poor Composability**: Difficult to customize or extend without modifying core components

### Proposed Solution
Refactor the chat component system to be:
- **Generic**: Use `TRole` and `TContent` type parameters for flexibility
- **Composable**: Break monoliths into smaller, single-responsibility components
- **Extensible**: Make advanced features optional through provider patterns
- **Consistent**: Unified Tailwind v4 CSS styling approach
- **Maintainable**: Clear separation of concerns and organized file structure

### Benefits
- **Developer Experience**: Easier to customize and extend for different use cases
- **Performance**: Smaller bundles through tree-shaking of unused features, VirtualList rendering for large datasets
- **Maintainability**: Clearer code organization and single-responsibility components
- **Flexibility**: Support for custom roles, content types, and feature sets
- **Consistency**: Unified styling approach across all chat components

## Current Architecture Analysis

### Complete Feature Inventory of Existing Components

Based on audit of existing chat components (`action-menu.tsx`, `chat-bookmark-panel.tsx`, `chat-container.tsx`, `chat-input.tsx`, `chat-markdown.tsx`, `chat-message-list.tsx`, `chat-message.tsx`, `chat-text-selection.tsx`, `message-actions.tsx`, `message-reactions.tsx`, `types.ts`), the current system includes these features:

#### Text Selection & Highlighting System (`chat-text-selection.tsx`)
- **Text Selection**: Mouse/keyboard text selection with selection bounds tracking
- **Selection Toolbar**: Floating toolbar that appears on text selection with actions:
  - Bookmark selected text
  - Highlight selected text
  - Quote selected text  
  - Start thread from selection
  - Share selected text
  - Copy selected text
- **Highlight Management**: Persistent highlights with different colors and notes
- **Selection Context**: Tracks selection position, surrounding context, and metadata
- **Keyboard Navigation**: Arrow keys, shortcuts for selection actions

#### Advanced Markdown Support (`chat-markdown.tsx`)
- **BlockNote Editor Integration**: Rich text editing with collaborative features
- **Code Block Features**:
  - Syntax highlighting for multiple languages
  - Copy code button with success feedback
  - Download code as file
  - Language detection and display
  - Theme variants (default, dark, light, enterprise)
- **Interactive Elements**: 
  - Clickable links with external link indicators
  - Code execution buttons (for supported languages)
  - Collapsible sections
- **Markdown Variants**: compact, relaxed, enterprise, blocknote
- **Content Processing**: Custom markdown parsing and rendering

#### Sophisticated Action Menu System (`action-menu.tsx`)
- **Contextual Actions**: Different actions based on message type and user permissions
- **Action Types**:
  - Primary actions (bookmark, copy, edit, highlight, thread, quote, share)
  - Secondary actions (report, moderate, tag)
  - Conditional actions based on user role and message state
- **Menu Variants**: floating, solid, ghost appearances
- **Size Variants**: compact, default, spacious
- **Custom Actions**: Support for app-specific actions with icons and callbacks
- **Keyboard Shortcuts**: Configurable shortcuts for quick actions

#### Comprehensive Reaction System (`message-reactions.tsx`)
- **Emoji Picker**: 
  - Grid layout with customizable columns (4, 5, 6, 8)
  - Category-based organization
  - Search functionality
  - Recent and frequently used tracking
  - Custom emoji support
- **Reaction Display**:
  - User reaction indicators
  - Reaction counts with user lists
  - Hover states and tooltips
  - Size variants (sm, default, lg)
- **Quick Reaction Bar**: Common emojis for fast reactions
- **Reaction Summary**: Aggregate view with user details
- **Interactive Features**: Add/remove reactions, reaction picker popup

#### Advanced Message Actions (`message-actions.tsx`)
- **Action Appearances**: floating, inline, subtle
- **Spacing Control**: compact, default, spacious
- **Button Variants**: ghost, subtle, outlined
- **Feature Integration**: Conditional rendering based on enabled features
- **Dropdown Actions**: Comprehensive dropdown with all available actions
- **Permission-Based Actions**: Different actions for different user roles

#### Rich Bookmark System (`chat-bookmark-panel.tsx`)
- **Bookmark Types**: paragraph, selection, message, thread
- **Bookmark Organization**:
  - Search functionality
  - Filter by type, color, date
  - Group by date/type
  - Sort options
- **Bookmark Colors**: 9 color variants for categorization
- **Bookmark Management**:
  - Edit bookmark titles and notes
  - Add tags for organization
  - Navigate to bookmark location
  - Export bookmarks
- **Panel Variants**: compact, default, wide
- **Position Options**: sidebar, floating, drawer

#### Comprehensive Type System (`types.ts`)
Current system already includes many advanced features:
- **Advanced Message Metadata**: model info, processing time, token count, confidence scores
- **Reasoning Steps**: Step-by-step AI reasoning display
- **Message Sources**: Source attribution with confidence scores
- **Advanced Threading**: Participant management, unread counts, thread ownership
- **Rich Attachments**: Multiple attachment types with metadata
- **Suggestion System**: Content suggestions with categories and icons
- **Keyboard Shortcuts**: Configurable shortcuts with modifiers
- **Stream Management**: Progress tracking, status management, cancellation
- **Accessibility Options**: Reduced motion, high contrast, screen reader support
- **Configuration System**: Feature toggles, UI preferences, performance settings

### Problems with Existing Components

#### ChatContainer (380 lines)
```typescript
// Current: Monolithic layout + theme + responsive + sidebar management
interface ChatContainerProps {
  layout?: 'standard' | 'threaded' | 'focused' | 'presentation'  // ❌ Hardcoded layouts
  sidebar?: 'bookmarks' | 'threads' | 'users' | 'none'          // ❌ Hardcoded sidebars
  theme?: 'auto' | 'light' | 'dark' | 'high-contrast'           // ❌ Limited themes
  // ... 15+ other props mixing layout, theme, and behavior concerns
}
```

**Issues:**
- Mixes layout, theme, responsive, and sidebar concerns in one component
- Hardcoded layout and sidebar types prevent customization
- Complex prop interface with too many responsibilities
- **CRITICAL**: Missing feature parity analysis - many advanced features not accounted for in new design

#### ChatMessage (300 lines)
```typescript
// Current: Hardcoded roles and content types
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'  // ❌ Inflexible roles
  content: string                        // ❌ Only text content
  bookmarks?: ChatBookmark[]             // ❌ Built-in feature assumption
  threads?: ChatThread[]                 // ❌ Built-in feature assumption
  reactions?: MessageReaction[]          // ❌ Built-in feature assumption
}
```

**Issues:**
- Cannot support custom roles like `'moderator'`, `'bot'`, `'guest'`
- Cannot support structured content like cards, forms, media
- Forces all messages to carry optional feature data even when unused

#### ChatInput (Current Design)
```typescript
// Current: Form-focused with attachment complexity
interface ChatInputProps {
  onSubmit: (content: string, attachments?: File[]) => void  // ❌ Mixes concerns
  enableAttachments?: boolean                                // ❌ Feature assumption
  enableVoice?: boolean                                      // ❌ Feature assumption
  // ... 20+ props for various features
}
```

**Issues:**
- Mixes text submission with file attachment logic
- Too many optional features create complex API surface
- Difficult to use for simple text-only chat scenarios

### AI Chatbot Analysis

Based on analysis of the `ai-chatbot/` directory, we identified several modern patterns that should inform our refactor:

#### Message Parts System (`message.tsx`)
- **Flexible Content**: Messages use a `parts` array system allowing mixed content types (text, tool-invocation, reasoning)
- **Tool Integration**: Built-in support for tool calls and results with specific UI components
- **Reasoning Display**: Dedicated component for AI reasoning/thinking processes
- **Edit Mode**: In-place message editing with mode switching (`view` | `edit`)

#### Smart Memoization Patterns (`message-actions.tsx`, `multimodal-input.tsx`)
- **Performance**: Uses `fast-deep-equal` for intelligent re-render prevention across components
- **Granular Control**: Individual memo wrappers for different update scenarios (vote changes, loading states)
- **Memory Efficiency**: Prevents unnecessary re-renders while maintaining responsiveness
- **Custom Comparators**: Tailored comparison functions for complex prop structures

#### Modern UX Patterns (`multimodal-input.tsx`, `messages.tsx`)
- **Animations**: Framer Motion for smooth enter/exit animations and loading states
- **Progressive Enhancement**: Features like scroll-to-bottom with smooth animations and viewport detection
- **Upload Queue**: Real-time file upload progress with visual feedback and queue management
- **Auto-resize**: Intelligent textarea height adjustment based on content with proper min/max heights
- **Local Storage**: Persistent input state across sessions with hydration handling
- **Responsive Controls**: Touch-friendly interactions with proper mobile keyboard handling

#### Component Architecture Insights
- **Pure Components**: Separates pure components from memoized exports for better testing and clarity
- **Hooks Integration**: Custom hooks for scroll behavior (`use-scroll-to-bottom`), window size, local storage, and message management
- **Error Boundaries**: Toast notifications for user feedback and error handling with promise-based loading states
- **Attachment System**: Comprehensive file upload, preview, and management with progress tracking
- **Accessibility**: Proper ARIA attributes, keyboard navigation, and focus management

## Proposed Architecture

### 1. Generic Type System

#### Base Types with Generics
- Generic `BaseMessage<TRole, TContent>` interface for flexible role and content types
- App-specific implementations: `ChatRole`, `SupportRole`, custom business roles
- Content flexibility: string, structured objects, rich media
- Metadata support for AI model info, processing time, confidence scores

#### Extension System with Mixins
- Feature mixins: `WithBookmarks`, `WithThreads`, `WithReactions`, `WithTextSelection`, `WithMarkdown`, `WithMetadata`
- Composable message types through TypeScript intersection types
- Simple to complex: `SimpleMessage` → `BookmarkableMessage` → `FullFeaturedMessage`
- App-specific combinations for different use cases

#### **CRITICAL**: Feature Parity Requirements

The new architecture MUST support all existing advanced features to avoid regression:

**Text Selection & Highlighting Features**:
- Text selection with bounds tracking and context preservation
- Floating selection toolbar with bookmark, highlight, quote, thread, share, copy actions
- Persistent highlights with colors, notes, and navigation
- Keyboard-based selection and action shortcuts
- Selection context tracking for quote attribution

**Advanced Markdown & Content Features**:
- BlockNote editor integration for rich text editing
- Code blocks with syntax highlighting, copy, download, and execution
- Language detection and display
- Multiple markdown variants (compact, relaxed, enterprise, blocknote)
- Interactive elements (links, collapsible sections, code execution)
- Theme-aware rendering (default, dark, light, enterprise)

**Sophisticated Action System**:
- Contextual actions based on message type and user permissions
- Primary, secondary, and conditional actions
- Multiple appearance variants (floating, inline, subtle)
- Size and spacing variants (compact, default, spacious)
- Custom action support with icons and callbacks
- Comprehensive keyboard shortcuts

**Advanced Reaction System**:
- Multi-column emoji picker with search and categories
- Recent and frequently used emoji tracking
- Custom emoji support
- Reaction aggregation with user details
- Quick reaction bar for common emojis
- Size variants and hover states

**Rich Bookmark Management**:
- Multiple bookmark types (paragraph, selection, message, thread)
- Advanced organization (search, filter, group, sort)
- 9 color variants for categorization
- Bookmark editing with titles, notes, and tags
- Export functionality
- Multiple panel variants and positions

**Advanced Message Features**:
- Message metadata (model, processing time, tokens, confidence)
- Step-by-step reasoning display
- Source attribution with confidence scores
- Rich attachments with metadata
- Content suggestions with categories
- Advanced threading with participant management

**Essential System Features**:
- Comprehensive accessibility options
- Stream management with progress tracking
- Configuration system for features and UI preferences
- Keyboard shortcuts with modifiers
- Multiple theme variants
- Permission-based feature access

**Responsive Design Requirements**:
- Mobile-first approach with touch-friendly interactions
- Adaptive layouts for mobile (≤768px), tablet (768px-1024px), desktop (≥1024px)
- Collapsible sidebars and panels on smaller screens
- Touch gestures for mobile interactions (swipe, tap, long press)
- Responsive typography and spacing
- Optimized message input for mobile keyboards
- Adaptive interaction patterns (floating vs inline based on screen size)

### 2. Composable Component Architecture

#### Core Layout Components
- `ChatLayout` - Main container with flexible grid/flex layout
- `ChatHeader` - Status, model selector, clear button
- `ChatContent` - Scrollable message area with VirtualList virtualization
- `ChatFooter` - Input area with attachments and actions
- `ChatSidebar` - Bookmarks, threads, participants panel

#### Message Rendering System
- `MessageCore` component with custom renderer props for role, content, timestamp
- Extensible through `MessageExtensions` for actions, reactions, bookmarks
- Support for message parts (text, reasoning, tools, artifacts)

#### Feature Provider System
- Optional features through React context providers
- Feature hooks return `undefined` if provider not present
- Graceful degradation when features disabled
- Clean separation between core and extended functionality

### 3. Component Hierarchy

#### New File Structure (ui-web)
```text
chat/
├── core/
│   ├── types.ts              # Generic base types and interfaces
│   ├── ChatContainer.tsx     # Main layout container
│   ├── ChatMessage.tsx       # Generic message component  
│   ├── ChatInput.tsx         # Generic input component
│   ├── ChatMessageList.tsx   # Virtualized message list (uses VirtualList from vlist)
│   ├── variants.ts           # CVA semantic variants
│   └── utils.ts              # Helper functions
├── content/                  # Content rendering & processing
│   ├── ChatMarkdown.tsx      # Markdown rendering with BlockNote
│   ├── ChatTextSelection.tsx # Text selection & highlighting
│   ├── CodeBlock.tsx         # Code syntax highlighting
│   ├── MessageContent.tsx    # Generic content renderer
│   └── ContentProcessor.tsx  # Content parsing & processing
├── interactions/            # Unified interaction system
│   ├── MessageInteractions.tsx  # Main interaction component with variants
│   ├── InteractionButton.tsx    # Individual interaction button
│   ├── InteractionMenu.tsx      # Dropdown/popover menu variant
│   ├── InteractionToolbar.tsx   # Toolbar variant (floating/inline)
│   └── ReactionPicker.tsx       # Emoji/reaction picker
├── streaming/                # Core extension (shipped with ui-web)
│   ├── ChatStreamingMessage.tsx  # Message with streaming support
│   ├── StreamingProvider.tsx     # Streaming state management
│   ├── StreamingIndicator.tsx    # Visual streaming indicator
│   └── useStreaming.ts           # Streaming hooks
├── bookmarks/               # Core extension (shipped with ui-web)
│   ├── ChatBookmarkPanel.tsx    # Bookmark management panel
│   ├── ChatBookmarkButton.tsx   # Add bookmark button
│   ├── BookmarkFilter.tsx       # Bookmark filtering
│   ├── BookmarkCard.tsx         # Individual bookmark display
│   ├── BookmarkProvider.tsx     # Bookmark state management
│   └── useBookmarks.ts          # Bookmark hooks
├── threads/                 # Core extension (shipped with ui-web)
│   ├── ChatThreadView.tsx       # Thread display panel
│   ├── ChatThreadButton.tsx     # Create thread button
│   ├── ThreadMessage.tsx        # Thread-specific message display
│   ├── ThreadProvider.tsx       # Thread state management
│   └── useThreads.ts           # Thread hooks
├── reactions/              # Core extension (shipped with ui-web)
│   ├── ChatReactionPicker.tsx   # Emoji picker with categories
│   ├── ChatReactionDisplay.tsx  # Reaction display/interaction
│   ├── QuickReactionBar.tsx     # Common emoji reactions
│   ├── ReactionSummary.tsx      # Aggregate reaction view
│   ├── EmojiPicker.tsx          # Advanced emoji selection
│   ├── ReactionProvider.tsx     # Reaction state management
│   └── useReactions.ts         # Reaction hooks
├── metadata/               # Message metadata & enrichment
│   ├── MessageMetadata.tsx     # Model info, timing, tokens
│   ├── ReasoningSteps.tsx      # AI reasoning display
│   ├── SourceAttribution.tsx   # Source links & confidence
│   ├── MessageSources.tsx      # Source management
│   └── MetadataProvider.tsx    # Metadata state management
├── attachments/            # File & media handling
│   ├── AttachmentManager.tsx   # Upload & management
│   ├── AttachmentCard.tsx      # Individual attachment display
│   ├── UploadProgress.tsx      # Upload progress indicator
│   ├── AttachmentPreview.tsx   # Media preview component
│   └── AttachmentProvider.tsx  # Attachment state management
├── suggestions/            # Content suggestions & autocomplete
│   ├── SuggestionCard.tsx      # Individual suggestion
│   ├── SuggestionList.tsx      # Suggestion display
│   ├── SuggestionProvider.tsx  # Suggestion management
│   └── useSuggestions.ts      # Suggestion hooks
├── accessibility/          # Accessibility features
│   ├── AccessibilityProvider.tsx  # A11y preferences
│   ├── KeyboardNavigation.tsx     # Keyboard shortcuts
│   ├── ScreenReaderUtils.tsx      # Screen reader support
│   └── useAccessibility.ts       # A11y hooks
├── providers/
│   ├── ChatProvider.tsx         # Main provider with all core extensions
│   ├── FeatureProvider.tsx      # Feature flag management
│   └── index.ts                 # Provider exports
├── styles/
│   └── chat.css                 # All chat styles using Tailwind v4
└── index.ts                     # Clean exports - all components available
```

**Key Insight**: All streaming, bookmark, thread, and reaction components are **part of ui-web**, not app-specific code. Apps import them ready-to-use.

#### **CRITICAL**: Unified Interaction System

The current system has redundant interaction components that should be consolidated:

**Current Redundancy**:
- `action-menu.tsx` - Contextual floating toolbar
- `message-actions.tsx` - Copy, upvote, downvote buttons  
- `message-reactions.tsx` - Emoji reactions with picker

**Proposed Unified System**:
- **`MessageInteractions`** - Main component with multiple variants
- **Variants**: `toolbar`, `menu`, `inline`, `floating`, `reactions`
- **Interaction Types**: `copy`, `bookmark`, `thread`, `reaction`, `share`, `edit`, `vote`, `report`
- **Layouts**: Horizontal toolbar, dropdown menu, floating overlay, inline buttons

**Benefits of Consolidation**:
- Single interaction API instead of three separate systems
- Consistent behavior and styling across all interaction types
- Reduced bundle size and maintenance overhead
- Flexible variants for different UI contexts
- Unified keyboard shortcuts and accessibility

**Interaction System Architecture**:
```text
MessageInteractions (main component)
├── variant="toolbar" → InteractionToolbar (floating/inline buttons)
├── variant="menu" → InteractionMenu (dropdown with all actions)
├── variant="reactions" → ReactionPicker (emoji selection)
└── variant="inline" → Individual InteractionButton components
```

### 4. Unified Styling Strategy

#### Hybrid CVA + Semantic CSS Approach

**Philosophy**: CVA handles semantic variants and component states, while CSS handles all visual styling (colors, spacing, borders, etc.).

**Key Principles**:
- CVA generates semantic class names (meaning, not appearance)
- CSS defines visual styling with Tailwind v4 patterns
- Themeable through CSS custom properties
- Designer can change colors without touching TypeScript
- Component logic separated from visual design

**Benefits**:
- Themeable: Colors defined in CSS, not component code
- Semantic: Class names express meaning, not appearance  
- Maintainable: Visual changes don't require code changes
- Flexible: CVA handles component logic, CSS handles styling

#### UI Component Integration

**Strategy**: Use ui-web components directly, no wrappers needed.

**Benefits**:
- Direct design system usage - Button, Card, etc. have perfect styling already
- No maintenance overhead - ui-web updates flow through automatically  
- Clean API surface - No duplicated prop interfaces
- Consistent styling - Same Button behavior everywhere
- Avoid unnecessary wrapper components

#### Tailwind v4 CSS File Implementation

Single `chat.css` file containing:
- Layout components (header, content, footer, sidebar)
- Message component styling with role-based variants
- State management (loading, error, success, priority)
- Theme support with CSS custom properties
- **Responsive behavior patterns**:
  - Mobile-first media queries
  - Collapsible sidebar on small screens
  - Touch-friendly button sizes (min 44px)
  - Adaptive spacing and typography
  - Mobile keyboard optimizations
- Extension styles (bookmarks, reactions, threads)
- Animation classes for smooth transitions

#### Benefits of Hybrid Approach
- **Semantic Clarity**: CVA expresses component logic, CSS expresses visual design
- **Themeable**: Colors and styling can be changed without touching component code
- **Consistent**: All visual styles in one place with consistent naming conventions
- **Performance**: Minimal CVA runtime overhead, optimized CSS
- **Maintainable**: Visual changes happen in CSS, component changes in TypeScript
- **Customizable**: Easy to override styles or create new themes
- **Tree-shakable**: Unused styles can be purged by Tailwind

### 5. Feature Classification & Architecture

#### Terminology Definition

**Core Components** (Basic chat functionality):
- `ChatMessage<TRole, TContent>` - Generic message display
- `ChatInput<TContent>` - Generic message input  
- `ChatContainer` - Layout and responsive behavior
- `ChatMessageList<TRole, TContent>` - Message virtualization and scrolling (leverages VirtualList from vlist for performance)

**Core Extensions** (Shipped with ui-web, always available):
- **Streaming** - Real-time message updates (`ChatStreamingMessage`, streaming state management)
- **Bookmarks** - Save and navigate (`ChatBookmarkPanel`, `ChatBookmarkButton`, bookmark context)
- **Threads** - Branching conversations (`ChatThreadView`, `ChatThreadButton`, thread management)
- **Reactions** - Message feedback (`ChatReactionPicker`, `ChatReactionDisplay`, reaction state)

**Optional Extensions** (App-specific, not in ui-web):
- Custom role types beyond user/assistant/system
- Custom content types beyond text/structured
- App-specific integrations (voice, file upload strategies)
- Custom themes beyond light/dark

#### Architecture Strategy: Feature Flags + Payment Tiers

**ui-web ships with ALL core extensions, but they're feature-flag controlled**:
- All code is bundled but features are runtime-disabled based on configuration
- Perfect for SaaS payment tiers - disable expensive features for lower-tier users
- Tree-shaking eliminates unused code paths in production builds
- Single codebase, multiple feature sets

```typescript
// Feature flag configuration (apps define their own tiers)
interface ChatFeatureConfig {
  streaming: boolean      
  bookmarks: boolean        
  threads: boolean        
  reactions: boolean      
  multiuser: boolean      // Enable multiple human participants
  multibot: boolean       // Enable multiple AI assistants
  advanced: {
    export: boolean       
    analytics: boolean    
    customBranding: boolean 
    moderation: boolean   // Content moderation tools
    permissions: boolean  // User role/permission system
  }
}

// Extended role types for multibot/multiuser scenarios
type ChatParticipantRole = 
  | 'user'                    // Human user
  | 'assistant'               // Primary AI assistant
  | 'moderator'               // Human moderator
  | 'bot_specialist'          // Specialized AI (e.g., coding assistant)
  | 'bot_researcher'          // Research-focused AI
  | 'bot_creative'            // Creative writing AI
  | 'system'                  // System messages
  | string                    // Custom roles for app-specific needs

// Participant information for multiuser/multibot
interface ChatParticipant<TRole = ChatParticipantRole> {
  id: string
  name: string
  role: TRole
  avatar?: string
  isOnline?: boolean
  lastSeen?: Date
  permissions?: string[]      // For permission-based features
  metadata?: Record<string, unknown>
}

// Enhanced message type for multiparticipant scenarios
interface MultiparticipantMessage<TRole = ChatParticipantRole, TContent = unknown> 
  extends BaseMessage<TRole, TContent> {
  participantId: string       // Who sent this message
  mentions?: string[]         // @mentioned participant IDs
  replyToMessageId?: string   // Threading/reply support
  isEdited?: boolean         
  editHistory?: { timestamp: Date, content: TContent }[]
  visibility?: 'public' | 'private' | 'moderator_only'
}

// Type Ergonomics & Helper Types
type ChatMessage<TRole = ChatParticipantRole, TContent = string> = MultiparticipantMessage<TRole, TContent>

// Common preset types for easy usage
type BasicChatMessage = ChatMessage<'user' | 'assistant', string>
type TeamChatMessage = ChatMessage<'user' | 'moderator' | 'assistant', string>
type MultibotMessage = ChatMessage<ChatParticipantRole, string>
type StructuredMessage = ChatMessage<ChatParticipantRole, { text: string; attachments?: any[] }>

// Type builder pattern for complex scenarios
interface ChatTypeBuilder<TRole = ChatParticipantRole, TContent = string> {
  withRole<R>(): ChatTypeBuilder<R, TContent>
  withContent<C>(): ChatTypeBuilder<TRole, C>
  withFeatures<F extends string>(): ChatTypeBuilder<TRole, TContent> & Record<F, boolean>
  build(): ChatMessage<TRole, TContent>
}

// Helper function for type inference
export function createChatMessage<TRole = ChatParticipantRole, TContent = string>(
  message: Omit<ChatMessage<TRole, TContent>, 'id' | 'timestamp'>
): ChatMessage<TRole, TContent> {
  return {
    id: nanoid(),
    timestamp: new Date(),
    ...message
  }
}

// Usage examples with improved ergonomics:
// ✅ Simple - uses defaults
const simpleMessage: ChatMessage = createChatMessage({
  role: 'user',
  content: 'Hello',
  participantId: 'user1'
})

// ✅ Preset types
const teamMessage: TeamChatMessage = createChatMessage({
  role: 'moderator', 
  content: 'Welcome to the team!',
  participantId: 'mod1'
})

// ✅ AI-assisted complex types (AI can infer the full signature)
const complexMessage = createChatMessage<'bot_specialist', { code: string; explanation: string }>({
  role: 'bot_specialist',
  content: { code: 'const x = 1', explanation: 'Variable declaration' },
  participantId: 'codebot',
  mentions: ['user1']
})
```

#### Implementation with Feature Flags

```typescript
// Feature-aware provider with multiparticipant support
export function ChatProvider<TRole = ChatParticipantRole, TContent = unknown>({ 
  children,
  features, // ← Feature configuration (app-defined)
  participants = [], // ← All chat participants (users + bots)
  currentParticipantId, // ← Current user/bot ID
  onUpgradeRequired, // ← Callback when user tries disabled feature
  onParticipantAction, // ← Handle @mentions, DMs, etc.
}: {
  children: ReactNode
  features: ChatFeatureConfig
  participants?: ChatParticipant<TRole>[]
  currentParticipantId: string
  onUpgradeRequired?: (feature: keyof ChatFeatureConfig) => void
  onParticipantAction?: (action: 'mention' | 'dm' | 'invite', participantId: string) => void
}) {
  return (
    <ChatFeatureContext.Provider value={{ 
      features, 
      onUpgradeRequired,
      participants,
      currentParticipantId,
      onParticipantAction
    }}>
      <ChatCoreProvider>
        {features.bookmarks && <BookmarkProvider>{children}</BookmarkProvider>}
        {features.threads && <ThreadProvider>{children}</ThreadProvider>}
        {features.reactions && <ReactionProvider>{children}</ReactionProvider>}
        {features.streaming && <StreamingProvider>{children}</StreamingProvider>}
        {features.multiuser && <MultiuserProvider>{children}</MultiuserProvider>}
        {features.multibot && <MultibotProvider>{children}</MultibotProvider>}
        {children}
      </ChatCoreProvider>
    </ChatFeatureContext.Provider>
  )
}

// Feature-aware multiparticipant message component
export function ChatMessage<TRole = ChatParticipantRole, TContent = unknown>({ 
  message 
}: { 
  message: MultiparticipantMessage<TRole, TContent> 
}) {
  const { features, participants, currentParticipantId, onUpgradeRequired, onParticipantAction } = useChatFeatures()
  
  const participant = participants.find(p => p.id === message.participantId)
  const isCurrentUser = message.participantId === currentParticipantId
  const isBot = participant?.role.toString().startsWith('bot_') || participant?.role === 'assistant'
  
  return (
    <Card className={cn(
      "chat-message",
      messageVariants({ 
        role: participant?.role || 'user',
        state: features.streaming && message.isStreaming ? 'loading' : 'default'
      })
    )}>
      <div className="flex items-start gap-3">
        {/* Participant avatar with online status */}
        <div className="relative">
          <Avatar className="size-8">
            <AvatarImage src={participant?.avatar} />
            <AvatarFallback>
              {participant?.name?.[0] || getRoleIcon(participant?.role)}
            </AvatarFallback>
          </Avatar>
          {features.multiuser && participant?.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>
        
        <div className="flex-1">
          {/* Participant name and role (for multiparticipant) */}
          {(features.multiuser || features.multibot) && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{participant?.name}</span>
              {isBot && (
                <Badge variant="secondary" className="text-xs">
                  {participant?.role.replace('bot_', '').replace('_', ' ')}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString()}
              </span>
              {message.isEdited && (
                <Badge variant="outline" className="text-xs">edited</Badge>
              )}
            </div>
          )}
          
          {/* Reply indicator */}
          {message.replyToMessageId && (
            <div className="text-xs text-muted-foreground mb-2 pl-2 border-l-2 border-muted">
              Replying to message...
            </div>
          )}
          
          {/* Message content with conditional streaming */}
          <div className="chat-message__bubble">
            {features.streaming && message.isStreaming ? (
              <StreamingText text={message.content} />
            ) : (
              <MessageContent 
                content={message.content}
                mentions={message.mentions}
                participants={participants}
                onMentionClick={(participantId) => onParticipantAction?.('mention', participantId)}
              />
            )}
          </div>
          
          {/* Conditional reaction display */}
          {features.reactions && <ChatReactionDisplay messageId={message.id} />}
          
          {/* Conditional bookmark indicators */}
          {features.bookmarks && <ChatBookmarkIndicator messageId={message.id} />}
        </div>
        
        {/* Feature-gated action buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Copy className="size-4 mr-2" />
              Copy
            </DropdownMenuItem>
            
            {features.bookmarks ? (
              <DropdownMenuItem onClick={() => {}}>
                <Bookmark className="size-4 mr-2" />
                Bookmark
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onUpgradeRequired?.('bookmarks')}>
                <Bookmark className="size-4 mr-2 opacity-50" />
                Bookmark (Upgrade)
              </DropdownMenuItem>
            )}
            
            {features.threads ? (
              <DropdownMenuItem>
                <MessageSquare className="size-4 mr-2" />
                Start Thread
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onUpgradeRequired?.('threads')}>
                <MessageSquare className="size-4 mr-2 opacity-50" />
                Thread (Upgrade)
              </DropdownMenuItem>
            )}
            
            {/* Multiuser/multibot specific actions */}
            {features.multiuser && !isCurrentUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onParticipantAction?.('mention', participant?.id || '')}>
                  <AtSign className="size-4 mr-2" />
                  Mention {participant?.name}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onParticipantAction?.('dm', participant?.id || '')}>
                  <MessageCircle className="size-4 mr-2" />
                  Direct Message
                </DropdownMenuItem>
              </>
            )}
            
            {/* Moderation actions */}
            {features.advanced.moderation && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Flag className="size-4 mr-2" />
                  Report Message
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

// Multiparticipant usage examples
function MultiuserCustomerSupport() {
  const participants: ChatParticipant[] = [
    { id: 'user1', name: 'John Doe', role: 'user', isOnline: true },
    { id: 'agent1', name: 'Sarah (Support)', role: 'moderator', isOnline: true },
    { id: 'bot1', name: 'AI Assistant', role: 'assistant', isOnline: true }
  ]

  return (
    <ChatProvider 
      features={{
        streaming: true,
        bookmarks: true,
        threads: false,
        reactions: true,
        multiuser: true,
        multibot: false,
        advanced: { moderation: true, permissions: false, export: false, analytics: false, customBranding: false }
      }}
      participants={participants}
      currentParticipantId="user1"
      onParticipantAction={(action, participantId) => {
        if (action === 'mention') {
          // Handle @mention functionality
        } else if (action === 'dm') {
          // Open direct message thread
        }
      }}
    >
      <ChatContainer>
        <div className="flex">
          <div className="flex-1">
            <ChatMessageList messages={messages} />
            <ChatInput 
              onSubmit={handleSubmit}
              enableMentions={true}
              participants={participants}
            />
          </div>
          <div className="w-80">
            <ChatParticipantList participants={participants} />
            <ChatBookmarkPanel />
          </div>
        </div>
      </ChatContainer>
    </ChatProvider>
  )
}

function MultibotResearchAssistant() {
  const participants: ChatParticipant[] = [
    { id: 'user1', name: 'Researcher', role: 'user', isOnline: true },
    { id: 'bot_general', name: 'General AI', role: 'assistant', isOnline: true },
    { id: 'bot_code', name: 'Code Specialist', role: 'bot_specialist', isOnline: true },
    { id: 'bot_research', name: 'Research AI', role: 'bot_researcher', isOnline: true },
    { id: 'bot_creative', name: 'Creative Writer', role: 'bot_creative', isOnline: true }
  ]

  return (
    <ChatProvider 
      features={{
        streaming: true,
        bookmarks: true,
        threads: true,
        reactions: true,
        multiuser: false,
        multibot: true,
        advanced: { export: true, analytics: true, moderation: false, permissions: false, customBranding: true }
      }}
      participants={participants}
      currentParticipantId="user1"
      onParticipantAction={(action, participantId) => {
        if (action === 'mention') {
          // Switch to specific bot for specialized help
          switchToBot(participantId)
        }
      }}
    >
      <ChatContainer>
        <div className="flex">
          <div className="flex-1">
            <ChatMessageList messages={messages} />
            <ChatInput 
              onSubmit={handleSubmit}
              enableMentions={true}
              participants={participants}
            />
          </div>
          <div className="w-80">
            <ChatBotSelector bots={participants.filter(p => p.role.startsWith('bot_'))} />
            <ChatThreadView />
            <ChatBookmarkPanel />
          </div>
        </div>
      </ChatContainer>
    </ChatProvider>
  )
}
```

#### Benefits of Feature Flag Architecture

**✅ Perfect for SaaS Business Model**:
- Granular feature control based on payment tiers
- Easy upselling - disabled buttons with upgrade prompts
- Single codebase serves all customer segments
- A/B testing capabilities for feature rollouts

**✅ Bundle Optimization**:
- Tree-shaking eliminates unused code paths in production
- Conditional provider loading reduces runtime overhead
- Code splitting by feature flags possible

**✅ Developer Experience**:
- All features available during development
- Easy to test different tier configurations
- Clear feature boundaries and dependencies

**✅ Runtime Flexibility**:
- Features can be toggled without deployments
- Emergency feature disabling for performance
- Gradual feature rollouts by user percentage

**✅ Upgrade Flow Integration**:
```typescript
// Seamless upgrade prompts
function onUpgradeRequired(feature: string) {
  switch(feature) {
    case 'bookmarks':
      analytics.track('upgrade_prompt_bookmarks')
      showUpgradeModal('Basic plan unlocks bookmarks')
      break
    case 'threads': 
      analytics.track('upgrade_prompt_threads')
      showUpgradeModal('Enterprise plan unlocks threads')
      break
  }
}
```

**🎯 Business Value**:
- Clear feature differentiation between tiers
- Conversion tracking for feature-based upgrades  
- Lower-tier users see value of premium features (grayed out buttons)
- Reduce churn by showing what they're missing

**📚 Storybook Integration**:
Payment tier examples (`FEATURE_TIERS`) should be defined in Storybook stories, not hardcoded in the library:

```typescript
// storybook/stories/ChatFeatureTiers.stories.tsx
export const FreeTier = {
  args: {
    features: {
      streaming: false, bookmarks: false, threads: false, reactions: false,
      multiuser: false, multibot: false,
      advanced: { export: false, analytics: false, customBranding: false, moderation: false, permissions: false }
    }
  }
}

export const EnterpriseTier = {
  args: {
    features: {
      streaming: true, bookmarks: true, threads: true, reactions: true,
      multiuser: true, multibot: true,
      advanced: { export: true, analytics: true, customBranding: true, moderation: true, permissions: true }
    }
  }
}
```

This allows apps to define their own payment tier configurations while providing examples for implementation guidance.

## Testing Strategy

### 1. Testing Challenges

**🚨 Complex Test Matrix**:
- 2^6 = 64 possible feature flag combinations (streaming, bookmarks, threads, reactions, multiuser, multibot)
- Multiple participant roles and combinations
- Provider interaction complexity
- Runtime feature toggling scenarios

**🚨 State Management Complexity**:
- Multiple context providers with interdependencies
- Feature flag changes affecting component behavior
- Multiparticipant state synchronization
- Streaming state management

### 2. Testing Architecture

#### Test Utilities & Helpers

```typescript
// test-utils/chat-test-provider.tsx
export function createTestChatProvider(
  features: Partial<ChatFeatureConfig> = {},
  participants: ChatParticipant[] = []
) {
  const defaultFeatures: ChatFeatureConfig = {
    streaming: false,
    bookmarks: false,
    threads: false,
    reactions: false,
    multiuser: false,
    multibot: false,
    advanced: {
      export: false,
      analytics: false,
      customBranding: false,
      moderation: false,
      permissions: false
    }
  }

  const mockParticipants = participants.length > 0 ? participants : [
    { id: 'user1', name: 'Test User', role: 'user', isOnline: true },
    { id: 'bot1', name: 'Test Assistant', role: 'assistant', isOnline: true }
  ]

  return function TestChatProvider({ children }: { children: ReactNode }) {
    return (
      <ChatProvider
        features={{ ...defaultFeatures, ...features }}
        participants={mockParticipants}
        currentParticipantId="user1"
        onUpgradeRequired={vi.fn()}
        onParticipantAction={vi.fn()}
      >
        {children}
      </ChatProvider>
    )
  }
}

// Feature flag test combinations
export const FEATURE_COMBINATIONS = {
  minimal: { streaming: false, bookmarks: false, threads: false, reactions: false },
  basic: { streaming: false, bookmarks: true, threads: false, reactions: false },
  advanced: { streaming: true, bookmarks: true, threads: true, reactions: true },
  multiuser: { multiuser: true, advanced: { moderation: true } },
  multibot: { multibot: true, streaming: true }
} as const

// Participant test scenarios
export const PARTICIPANT_SCENARIOS = {
  singleUser: [
    { id: 'user1', name: 'Solo User', role: 'user' as const, isOnline: true }
  ],
  userAndBot: [
    { id: 'user1', name: 'Human', role: 'user' as const, isOnline: true },
    { id: 'bot1', name: 'AI Assistant', role: 'assistant' as const, isOnline: true }
  ],
  customerSupport: [
    { id: 'user1', name: 'Customer', role: 'user' as const, isOnline: true },
    { id: 'agent1', name: 'Support Agent', role: 'moderator' as const, isOnline: true },
    { id: 'bot1', name: 'AI Helper', role: 'assistant' as const, isOnline: true }
  ],
  multiBots: [
    { id: 'user1', name: 'Researcher', role: 'user' as const, isOnline: true },
    { id: 'bot1', name: 'General AI', role: 'assistant' as const, isOnline: true },
    { id: 'bot2', name: 'Code Expert', role: 'bot_specialist' as const, isOnline: true },
    { id: 'bot3', name: 'Research AI', role: 'bot_researcher' as const, isOnline: true }
  ]
} as const
```

#### Unit Testing Strategy

```typescript
// Component unit tests with feature variations
describe('ChatMessage', () => {
  it.each(Object.entries(FEATURE_COMBINATIONS))(
    'renders correctly with %s features',
    (featureName, features) => {
      const TestProvider = createTestChatProvider(features)
      const message = createTestMessage()
      
      render(
        <TestProvider>
          <ChatMessage message={message} />
        </TestProvider>
      )
      
      // Conditional assertions based on features
      if (features.bookmarks) {
        expect(screen.getByRole('button', { name: /bookmark/i })).toBeTruthy()
      } else {
        expect(screen.queryByRole('button', { name: /bookmark/i })).toBeFalsy()
      }
      
      if (features.reactions) {
        expect(screen.getByRole('button', { name: /reaction/i })).toBeTruthy()
      } else {
        expect(screen.queryByRole('button', { name: /reaction/i })).toBeFalsy()
      }
    }
  )

  it.each(Object.entries(PARTICIPANT_SCENARIOS))(
    'handles %s participant scenario',
    (scenarioName, participants) => {
      const TestProvider = createTestChatProvider({ multiuser: true }, participants)
      const message = createTestMessage({ participantId: participants[0].id })
      
      render(
        <TestProvider>
          <ChatMessage message={message} />
        </TestProvider>
      )
      
      // Test participant-specific rendering
      expect(screen.getByText(participants[0].name)).toBeTruthy()
      
      if (participants.length > 1) {
        // Test @mention functionality
        expect(screen.getByRole('button', { name: /mention/i })).toBeTruthy()
      }
    }
  )
})

// Provider integration tests
describe('ChatProvider', () => {
  it('conditionally renders feature providers', () => {
    const features = { bookmarks: true, threads: false, reactions: true }
    
    render(
      <ChatProvider features={features} currentParticipantId="user1">
        <TestComponent />
      </ChatProvider>
    )
    
    // Verify only enabled features are available
    expect(mockBookmarkProvider).toHaveBeenCalled()
    expect(mockReactionProvider).toHaveBeenCalled()
    expect(mockThreadProvider).not.toHaveBeenCalled()
  })
})
```

#### Integration Testing

```typescript
// test/integration/feature-interactions.test.tsx
describe('Feature Interactions', () => {
  it('bookmark + thread interaction works correctly', async () => {
    const TestProvider = createTestChatProvider({ 
      bookmarks: true, 
      threads: true 
    })
    
    render(
      <TestProvider>
        <ChatContainer>
          <ChatMessageList messages={testMessages} />
          <ChatBookmarkPanel />
          <ChatThreadView />
        </ChatContainer>
      </TestProvider>
    )
    
    // Bookmark a message
    await user.click(screen.getByRole('button', { name: /bookmark/i }))
    
    // Create thread from same message
    await user.click(screen.getByRole('button', { name: /thread/i }))
    
    // Verify both features work together
    expect(screen.getByText(/bookmarked/i)).toBeTruthy()
    expect(screen.getByText(/thread created/i)).toBeTruthy()
  })

  it('handles upgrade prompts correctly', async () => {
    const onUpgradeRequired = vi.fn()
    const TestProvider = createTestChatProvider({ bookmarks: false })
    
    render(
      <TestProvider>
        <ChatMessage message={testMessage} />
      </TestProvider>
    )
    
    // Click disabled bookmark button
    await user.click(screen.getByRole('button', { name: /bookmark.*upgrade/i }))
    
    expect(onUpgradeRequired).toHaveBeenCalledWith('bookmarks')
  })
})
```

### 3. Visual Testing with Storybook

```typescript
// stories/ChatFeatureMatrix.stories.tsx
export default {
  title: 'Chat/Feature Matrix',
  component: ChatContainer,
  parameters: {
    layout: 'fullscreen',
  },
}

// Generate stories for all feature combinations
export const FeatureMatrix = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(FEATURE_COMBINATIONS).map(([name, features]) => (
        <div key={name} className="border rounded p-4">
          <h3 className="font-bold mb-2">{name}</h3>
          <ChatProvider features={features} currentParticipantId="user1">
            <ChatContainer>
              <ChatMessageList messages={mockMessages} />
            </ChatContainer>
          </ChatProvider>
        </div>
      ))}
    </div>
  )
}

export const ParticipantScenarios = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(PARTICIPANT_SCENARIOS).map(([name, participants]) => (
        <div key={name} className="border rounded p-4">
          <h3 className="font-bold mb-2">{name}</h3>
          <ChatProvider 
            features={{ multiuser: true, multibot: true }}
            participants={participants}
            currentParticipantId={participants[0].id}
          >
            <ChatContainer>
              <ChatMessageList messages={createMessagesForParticipants(participants)} />
            </ChatContainer>
          </ChatProvider>
        </div>
      ))}
    </div>
  )
}

// Chromatic visual regression tests
export const AllFeatureStates = {
  render: () => <FeatureMatrix />,
  parameters: {
    chromatic: { 
      modes: {
        light: { theme: 'light' },
        dark: { theme: 'dark' },
      },
      viewports: [320, 1200]
    }
  }
}
```

### 4. E2E Testing Strategy

```typescript
// e2e/chat-features.spec.ts
test.describe('Chat Feature Flags', () => {
  test('feature upgrade flow', async ({ page }) => {
    // Start with minimal features
    await page.goto('/chat?features=minimal')
    
    // Try to use disabled bookmark feature
    await page.click('[data-testid="bookmark-button"]')
    
    // Should show upgrade modal
    await expect(page.locator('[data-testid="upgrade-modal"]')).toBeVisible()
    await expect(page.locator('text=Bookmarks require')).toBeVisible()
    
    // Simulate upgrade
    await page.click('[data-testid="upgrade-button"]')
    await page.waitForURL('**/upgrade**')
  })

  test('multibot conversation flow', async ({ page }) => {
    await page.goto('/chat?features=multibot&participants=research-team')
    
    // Send message mentioning specific bot
    await page.fill('[data-testid="chat-input"]', '@CodeExpert Help me debug this function')
    await page.press('[data-testid="chat-input"]', 'Enter')
    
    // Verify message shows mention
    await expect(page.locator('[data-testid="mention-CodeExpert"]')).toBeVisible()
    
    // Verify bot response appears
    await expect(page.locator('[data-participant="bot_specialist"]')).toBeVisible()
  })
})
```

### 5. Performance Testing

```typescript
// test/performance/feature-scaling.test.ts
describe('Performance with Feature Combinations', () => {
  it('renders large message list efficiently with all features', async () => {
    const largeMessageList = Array.from({ length: 1000 }, createTestMessage)
    const TestProvider = createTestChatProvider({
      streaming: true,
      bookmarks: true,
      threads: true,
      reactions: true,
      multiuser: true,
      multibot: true
    })
    
    const start = performance.now()
    
    render(
      <TestProvider>
        <ChatMessageList messages={largeMessageList} />
      </TestProvider>
    )
    
    const end = performance.now()
    
    // Should render within reasonable time even with all features
    expect(end - start).toBeLessThan(100) // 100ms threshold
  })
})
```

### 6. Test Automation & CI Requirements

**Matrix Testing Strategy**:
- Run unit tests across feature-set combinations: `[minimal, basic, advanced, multiuser, multibot]`
- Execute E2E tests for scenarios: `[single-user, multiuser, multibot, upgrade-flow]`
- Parallel execution for performance

**Visual Regression Testing Requirements**:
- Build and deploy Storybook for visual testing
- Screenshot comparison across feature combinations
- Multi-theme testing (light/dark)
- Responsive viewport testing

**Performance Monitoring**:
- Bundle size tracking across feature combinations
- Render performance benchmarks
- Memory usage monitoring for large message lists

### 7. Free Alternatives to Chromatic

**Option 1: Percy (Free Tier)**
- 5,000 screenshots/month free
- GitHub integration
- Multi-browser testing
- Responsive testing

**Option 2: Playwright Visual Testing (Completely Free)**
```typescript
// Built-in visual testing with Playwright
test('visual regression test', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=chat-featurematrix--feature-matrix')
  await expect(page).toHaveScreenshot('feature-matrix.png')
})

// Can be integrated into existing test suite
test.describe('Chat Visual Tests', () => {
  for (const [name, features] of Object.entries(FEATURE_COMBINATIONS)) {
    test(`${name} feature combination`, async ({ page }) => {
      await page.goto(`/storybook/iframe.html?id=chat--${name}`)
      await expect(page).toHaveScreenshot(`chat-${name}.png`)
    })
  }
})
```

**Option 3: Storybook + GitHub Actions (DIY)**
```typescript
// Custom visual testing workflow
// 1. Build Storybook static files
// 2. Use Playwright/Puppeteer to screenshot stories
// 3. Compare with git-stored baseline images
// 4. Fail CI if differences detected
// 5. Store new screenshots as artifacts for review
```

**Option 4: Argos (Free for Open Source)**
- Unlimited screenshots for public repos
- GitHub integration
- Multi-browser support
- Good alternative to Chromatic

**Recommendation**: Start with Playwright visual testing as it's completely free, integrates with existing test infrastructure, and provides sufficient visual regression coverage for our feature matrix testing needs.
  onStreamingUpdate,
  onBookmarkChange,
  onThreadCreate,
  onReactionChange
}: {
  children: ReactNode
  onStreamingUpdate?: (messageId: string, text: string) => void
  onBookmarkChange?: (bookmarks: ChatBookmark[]) => void  
  onThreadCreate?: (thread: ChatThread) => void
  onReactionChange?: (messageId: string, reactions: MessageReaction[]) => void
}) {
  // All features implemented and always available
  const [bookmarks, setBookmarks] = useState<ChatBookmark[]>([])
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [reactions, setReactions] = useState<Record<string, MessageReaction[]>>({})
  const [streamingState, setStreamingState] = useState<Record<string, { isStreaming: boolean, text: string }>>({})
  
  const coreFeatures: ChatCoreFeatures<TRole, TContent> = {
    streaming: {
      isStreaming: Object.values(streamingState).some(s => s.isStreaming),
      onStreamingUpdate: (messageId: string, text: string) => {
        setStreamingState(prev => ({
          ...prev,
          [messageId]: { isStreaming: true, text }
        }))
        onStreamingUpdate?.(messageId, text)
      },
      onStreamingComplete: (messageId: string) => {
        setStreamingState(prev => ({
          ...prev,
          [messageId]: { isStreaming: false, text: '' }
        }))
      }
    },
    bookmarks: {
      bookmarks,
      addBookmark: (bookmark) => {
        const newBookmark = { ...bookmark, id: nanoid(), timestamp: new Date() }
        setBookmarks(prev => [...prev, newBookmark])
        onBookmarkChange?.([...bookmarks, newBookmark])
      },
      removeBookmark: (id) => {
        const updated = bookmarks.filter(b => b.id !== id)
        setBookmarks(updated)
        onBookmarkChange?.(updated)
      },
      getBookmarksForMessage: (messageId) => bookmarks.filter(b => b.messageId === messageId),
      navigateToBookmark: (bookmarkId) => {
        // Implementation for scrolling to bookmark
      }
    },
    threads: {
      threads,
      createThread: (parentMessageId) => {
        const threadId = nanoid()
        const newThread = {
          id: threadId,
          parentMessageId,
          messages: [],
          lastActivity: new Date()
        }
        setThreads(prev => [...prev, newThread])
        onThreadCreate?.(newThread)
        return threadId
      },
      addMessageToThread: (threadId, message) => {
        setThreads(prev => prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, messages: [...thread.messages, message], lastActivity: new Date() }
            : thread
        ))
      },
      getThreadMessages: (threadId) => {
        return threads.find(t => t.id === threadId)?.messages || []
      }
    },
    reactions: {
      addReaction: (messageId, emoji) => {
        setReactions(prev => {
          const messageReactions = prev[messageId] || []
          const existingReaction = messageReactions.find(r => r.emoji === emoji)
          
          if (existingReaction) {
            // Increment count
            const updated = messageReactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r
            )
            const newState = { ...prev, [messageId]: updated }
            onReactionChange?.(messageId, updated)
            return newState
          } else {
            // Add new reaction
            const newReaction = { id: nanoid(), emoji, count: 1, userReacted: true }
            const updated = [...messageReactions, newReaction]
            const newState = { ...prev, [messageId]: updated }
            onReactionChange?.(messageId, updated)
            return newState
          }
        })
      },
      removeReaction: (messageId, emoji) => {
        setReactions(prev => {
          const messageReactions = prev[messageId] || []
          const updated = messageReactions.map(r => 
            r.emoji === emoji ? { ...r, count: Math.max(0, r.count - 1), userReacted: false } : r
          ).filter(r => r.count > 0)
          
          const newState = { ...prev, [messageId]: updated }
          onReactionChange?.(messageId, updated)
          return newState
        })
      },
      getMessageReactions: (messageId) => reactions[messageId] || []
    }
  }
  
  return (
    <ChatContext.Provider value={coreFeatures}>
      {children}
    </ChatContext.Provider>
  )
}

// Single hook for ALL core features
export function useChatFeatures<TRole, TContent>(): ChatCoreFeatures<TRole, TContent> {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatFeatures must be used within ChatProvider')
  }
  return context
}
```

#### Component Usage with Core Features

```typescript
// All components have access to ALL core features
function MessageActions<TRole, TContent>({ messageId }: { messageId: string }) {
  const chatFeatures = useChatFeatures<TRole, TContent>()
  
  return (
    <div className="flex gap-1">
      {/* Copy is always available */}
      <Button variant="ghost" size="sm" onClick={() => copyMessageText(messageId)}>
        <Copy className="size-4" />
      </Button>
      
      {/* Bookmarks are always available */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => chatFeatures.bookmarks.addBookmark({
          type: 'message',
          messageId,
          content: getMessageContent(messageId)
        })}
      >
        <Bookmark className="size-4" />
      </Button>
      
      {/* Threads are always available */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => chatFeatures.threads.createThread(messageId)}
      >
        <MessageSquare className="size-4" />
      </Button>
      
      {/* Reactions are always available */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Smile className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {['👍', '❤️', '😂', '😮', '😢', '😠'].map(emoji => (
            <DropdownMenuItem 
              key={emoji}
              onClick={() => chatFeatures.reactions.addReaction(messageId, emoji)}
            >
              {emoji}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Message component with streaming support
function ChatMessage<TRole, TContent>({ 
  message, 
  isStreaming = false 
}: { 
  message: BaseMessage<TRole, TContent>
  isStreaming?: boolean 
}) {
  const chatFeatures = useChatFeatures<TRole, TContent>()
  const messageReactions = chatFeatures.reactions.getMessageReactions(message.id)
  const messageBookmarks = chatFeatures.bookmarks.getBookmarksForMessage(message.id)
  
  return (
    <Card className={cn(
      messageVariants({ 
        role: message.role, 
        state: isStreaming ? 'loading' : 'default' 
      }), 
      "chat-message"
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="size-8" />
        
        <div className="flex-1">
          {/* Message content with streaming support */}
          <div className="chat-message__bubble">
            {isStreaming ? (
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  {message.content}
                  <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
                </div>
              </div>
            ) : (
              <div>{message.content}</div>
            )}
          </div>
          
          {/* Reactions display */}
          {messageReactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {messageReactions.map(reaction => (
                <Button
                  key={reaction.id}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => chatFeatures.reactions.removeReaction(message.id, reaction.emoji)}
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            </div>
          )}
          
          {/* Bookmark indicators */}
          {messageBookmarks.length > 0 && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                <Bookmark className="size-3 mr-1" />
                {messageBookmarks.length} bookmark{messageBookmarks.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Actions - always available */}
        <MessageActions messageId={message.id} />
      </div>
    </Card>
  )
}
```

#### Benefits of "Core Features Always Available" Approach

**✅ Fully Functional Out of the Box**:
- No optional context providers - everything works immediately
- No conditional rendering based on feature availability
- Streaming, bookmarks, threads, reactions work in every component

**✅ Composable but Complete**:
- Components can be used independently but access all features
- `ChatMessage` works alone but can also be part of `ChatContainer`
- Features compose together naturally (bookmark a message in a thread)

**✅ Simplified API**:
- Single `useChatFeatures()` hook instead of multiple feature hooks
- No "is feature enabled?" checks scattered throughout code
- Consistent behavior across all chat components

**✅ Future-Proof**:
- Adding new core features doesn't break existing components
- Extension points for truly optional features (custom reactions, plugins)
- Generic type system supports any role/content types

**Example Usage**:
```typescript
// This works immediately - no setup required
function App() {
  return (
    <ChatProvider>
      <ChatContainer>
        <ChatMessageList messages={messages} />
        <ChatInput onSubmit={handleSubmit} />
        <ChatBookmarkPanel /> {/* Shows bookmarks from any message */}
      </ChatContainer>
    </ChatProvider>
  )
}

// All features are immediately available in any component
function CustomMessageComponent({ message }) {
  const { bookmarks, threads, reactions, streaming } = useChatFeatures()
  
  // Can bookmark, thread, react to any message without setup
  return (
    <div>
      <button onClick={() => bookmarks.addBookmark({...})}>Bookmark</button>
      <button onClick={() => threads.createThread(message.id)}>Thread</button>
      <button onClick={() => reactions.addReaction(message.id, '👍')}>👍</button>
    </div>
  )
}
      )}
      
      {reactions && (
        <ReactionButton 
          messageId={messageId}
          onReact={reactions.addReaction}
        />
      )}
      
      {threads && (
        <ThreadButton 
          messageId={messageId}
          onThread={threads.createThread}
        />
      )}
    </div>
  )
}
```

## API Design Examples

### Basic Usage
```typescript
// Simple text-only chat
type SimpleMessage = BaseMessage<string, string>

function SimpleChatApp() {
  const [messages, setMessages] = useState<SimpleMessage[]>([])
  const [input, setInput] = useState('')
  
  return (
    <ChatLayout>
      <ChatContent>
        <MessageList messages={messages}>
          {(message) => (
            <MessageCore
              message={message}
              roleRenderer={(role) => <Avatar role={role} />}
              contentRenderer={(content) => <p>{content}</p>}
            />
          )}
        </MessageList>
      </ChatContent>
      
      <ChatFooter>
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={(content) => {
            const newMessage: SimpleMessage = {
              id: nanoid(),
              role: 'user',
              content,
              timestamp: new Date()
            }
            setMessages(prev => [...prev, newMessage])
            setInput('')
          }}
        />
      </ChatFooter>
    </ChatLayout>
  )
}
```

### Advanced Usage with Extensions
```typescript
// Full-featured chat with all extensions
type AdvancedMessage = BaseMessage<ChatRole, ChatContent> & WithBookmarks & WithReactions

function AdvancedChatApp() {
  const [messages, setMessages] = useState<AdvancedMessage[]>([])
  
  return (
    <ChatBookmarkProvider>
      <ChatReactionProvider>
        <ChatThreadProvider>
          <ChatLayout>
            <ChatHeader>
              <h1>Support Chat</h1>
              <ClearChatButton />
            </ChatHeader>
            
            <ChatContent>
              <MessageList messages={messages}>
                {(message) => (
                  <MessageCore
                    message={message}
                    roleRenderer={(role) => <RoleAvatar role={role} />}
                    contentRenderer={(content) => <RichContent content={content} />}
                  >
                    <MessageExtensions>
                      <MessageActions messageId={message.id} />
                      <MessageReactions messageId={message.id} />
                    </MessageExtensions>
                  </MessageCore>
                )}
              </MessageList>
            </ChatContent>
            
            <ChatSidebar>
              <BookmarkPanel />
            </ChatSidebar>
            
            <ChatFooter>
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                enableAttachments
              />
            </ChatFooter>
          </ChatLayout>
        </ChatThreadProvider>
      </ChatReactionProvider>
    </ChatBookmarkProvider>
  )
}
```

### Custom Role and Content Types
```typescript
// Customer support chat with custom types
type SupportRole = 'customer' | 'agent' | 'supervisor' | 'bot'
type SupportContent = {
  text: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  attachments?: File[]
}
type SupportMessage = BaseMessage<SupportRole, SupportContent>

function SupportChatApp() {
  return (
    <ChatLayout>
      <MessageList messages={supportMessages}>
        {(message) => (
          <MessageCore
            message={message}
            roleRenderer={(role) => <SupportAvatar role={role} />}
            contentRenderer={(content) => (
              <SupportMessageContent 
                content={content}
                priority={content.priority}
                category={content.category}
              />
            )}
          />
        )}
      </MessageList>
    </ChatLayout>
  )
}
```

## Migration Strategy

### Phase 1: Type System Foundation
1. **Create generic base types** in `core/types.ts`
2. **Implement core layout components** (`ChatLayout`, `ChatHeader`, etc.)
3. **Build basic message rendering** with generic `MessageCore`
4. **Write comprehensive unit tests** for all new components
5. **Create initial Storybook stories** for new components

### Phase 2: Message System Refactor
1. **Replace ChatMessage** with composable `MessageCore` + extensions
2. **Implement role and content renderers**
3. **Create MessageList** with VirtualList from vlist
4. **Add date grouping and separators**
5. **Update all tests** for new message components
6. **Create Storybook stories** for message system variations

### Phase 3: Styling Consolidation
1. **Create unified `chat.css`** with Tailwind v4 patterns
2. **Refactor CVA to semantic classes** (remove colors, keep variants)
3. **Implement theme system** with CSS custom properties
4. **Test responsive behavior**
5. **Update Storybook** with theme variations
6. **Visual regression testing** for all themes

### Phase 4: Extension System
1. **Convert bookmarks to provider pattern**
2. **Convert reactions to provider pattern**
3. **Convert threads to provider pattern**
4. **Write integration tests** for provider patterns
5. **Create extension documentation**
6. **Storybook stories** for all extension patterns

### Phase 5: File Upload System
1. **Create AttachmentManager** component with upload strategies
2. **Implement upload progress and error handling**
3. **Write comprehensive tests** for upload scenarios
4. **Create Storybook stories** for different upload strategies
5. **Integration tests** for file handling

### Phase 6: Final Integration
1. **Update app chat page** to use new components
2. **Complete Storybook migration** with all usage patterns
3. **Performance testing** and optimization
4. **E2E testing** for complete chat flows
5. **Documentation and migration guides**

## Breaking Changes Inventory

### Component API Changes
- **ChatContainer** → Multiple layout components (`ChatLayout`, `ChatHeader`, etc.)
- **ChatMessage** → `MessageCore` with renderer props
- **ChatMessageList** → `MessageList` with children render prop
- **All prop interfaces** will change to support generics

### Import Path Changes
```typescript
// Old imports (will break)
import { ChatContainer, ChatMessage, ChatMessageList } from '@zondax/ui-web/client'

// New imports
import { ChatLayout, ChatHeader, ChatContent } from '@zondax/ui-web/client'
import { MessageCore, MessageList } from '@zondax/ui-web/client'
import { ChatBookmarkProvider, useChatBookmarks } from '@zondax/ui-web/client'
```

### Type System Changes
```typescript
// Old types (will break)
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// New types
type AppChatMessage = BaseMessage<'user' | 'assistant' | 'system', string>
```

### Styling Changes
- CVA will be refactored to semantic classes only (no colors/spacing in variants)
- All visual styling moved to `chat.css` 
- Components will use combination of CVA semantic classes + CSS styling
- Theme props will change to CSS custom properties

## Implementation Roadmap

### Phase 1: Foundation with Message Parts (4-5 days)
- [ ] Create `core/types.ts` with generic base types and **message parts system**
- [ ] Implement message parts architecture for extensible content
- [ ] Implement `ChatLayout` and layout components  
- [ ] Create basic `MessageCore` with renderer props and parts support
- [ ] Set up `chat.css` file structure
- [ ] **Write unit tests** for all core components and message parts
- [ ] **Create Storybook stories** for layout and message parts examples
- [ ] Create simple usage example with different message part types

### Phase 2: Message System + Unified Interactions (4-5 days)
- [ ] Replace `ChatMessage` with `MessageCore`
- [ ] Implement role and content renderers
- [ ] **Consolidate action-menu, message-actions, reactions into unified MessageInteractions**
- [ ] Build interaction variants (toolbar, menu, inline, floating, reactions)
- [ ] Build `MessageList` with VirtualList from vlist
- [ ] Add date grouping and separators
- [ ] **Update all message-related tests including interaction consolidation**
- [ ] **Create comprehensive Storybook stories** for message and interaction variations
- [ ] Test with different message types and edge cases

### Phase 3: Styling Migration (2-3 days)
- [ ] Complete `chat.css` with all component styles
- [ ] Refactor CVA to semantic classes only
- [ ] Implement theme system with CSS custom properties
- [ ] **Update Storybook** with theme switching controls
- [ ] **Visual regression testing** for all themes
- [ ] Test responsive behavior across breakpoints

### Phase 4: Extensions + Tool Framework (4-5 days)
- [ ] Convert bookmarks to provider pattern
- [ ] Convert reactions to provider pattern  
- [ ] Convert threads to provider pattern
- [ ] **Implement tool/artifact integration framework**
- [ ] Create tool registry system for extensible capabilities
- [ ] Build core tools (document, code execution, artifacts)
- [ ] **Write integration tests** for provider patterns and tools
- [ ] **Create Storybook stories** showing extension and tool combinations
- [ ] Document extension API and tool integration patterns

### Phase 5: File Upload System (2-3 days)
- [ ] Create `AttachmentManager` component
- [ ] Implement upload strategies (Direct, Base64, S3)
- [ ] Add upload progress and error handling
- [ ] **Write comprehensive upload tests** (unit + integration)
- [ ] **Create Storybook stories** for upload scenarios
- [ ] Test file validation and error cases

### Phase 6: Modern UX + Final Integration (3-4 days)
- [ ] **Implement Framer Motion animations** for message appear/disappear
- [ ] **Add smart auto-scroll with manual override** capability
- [ ] **Implement upload progress with queue management**
- [ ] **Add comprehensive keyboard shortcuts**
- [ ] Update app chat page to use new components
- [ ] **Complete Storybook migration** - replace all old stories
- [ ] **Write E2E tests** for complete chat flows including tools/artifacts
- [ ] Performance testing and optimization
- [ ] **Accessibility testing** for all components
- [ ] Documentation and migration guides
- [ ] **Test coverage reporting** and validation

**Total Estimated Time: 18-25 days** (increased to account for tool framework, modern UX, and comprehensive testing)

## Success Criteria

### Technical Goals
- [ ] Generic types work with custom roles and content
- [ ] Components are composable and reusable
- [ ] All styles consolidated in `chat.css`
- [ ] Built-in features are optional extensions
- [ ] Bundle size maintained or reduced
- [ ] Performance maintained or improved
- [ ] **90%+ test coverage** for all new components
- [ ] **Zero TypeScript errors** in strict mode

### Developer Experience Goals
- [ ] Simpler API for basic use cases
- [ ] Flexible API for advanced use cases
- [ ] Clear documentation and examples
- [ ] Good TypeScript inference and error messages
- [ ] **Comprehensive Storybook stories** covering all usage patterns
- [ ] **Interactive documentation** with live examples

### Quality Assurance Goals
- [ ] **All existing tests updated** and passing
- [ ] **New comprehensive test suite** covering edge cases
- [ ] **Visual regression testing** for UI consistency
- [ ] **E2E tests** for complete user flows
- [ ] **Accessibility compliance** (WCAG 2.1 AA)
- [ ] **Performance benchmarks** meet or exceed current metrics

### Application Goals
- [ ] Current chat page functionality preserved
- [ ] **Storybook completely migrated** with new component demos
- [ ] No regression in user experience
- [ ] Ready for future feature extensions
- [ ] **Clean codebase** with no legacy component references

## File Upload Architecture

### Current Problems with File Handling

The existing implementation mixes file handling concerns in problematic ways:

```typescript
// ❌ Current problematic approach
interface ChatInputProps {
  onSubmit: (content: string, attachments?: File[]) => void  // Mixes text + files
  attachments?: File[]                                       // Parent manages files
  onAttach?: (files: File[]) => void                        // Parent handles uploads
  onRemoveAttachment?: (index: number) => void             // Parent manages removal
}
```

**Issues:**
- File state scattered between parent and ChatInput
- Text submission mixed with file submission
- No upload progress or error handling
- No validation or preprocessing
- Difficult to implement different upload strategies

### Proposed File Upload Architecture

#### Separate File Concerns from Text Input

```typescript
// ✅ Clean separation: ChatInput only handles text
interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (content: string) => void  // Only text, no files
  // ... other text input props
}

// ✅ Separate component for file attachments
interface AttachmentManagerProps<TAttachment = FileAttachment> {
  attachments: TAttachment[]
  onAdd: (files: File[]) => Promise<void>
  onRemove: (id: string) => void
  maxSize?: number
  allowedTypes?: string[]
  maxFiles?: number
}
```

#### Flexible Attachment System with Generics

```typescript
// Base attachment interface
interface BaseAttachment {
  id: string
  status: 'uploading' | 'uploaded' | 'error'
  progress?: number
  error?: string
}

// File attachment implementation
interface FileAttachment extends BaseAttachment {
  type: 'file'
  file: File
  url?: string
  uploadId?: string
}

// URL attachment implementation  
interface UrlAttachment extends BaseAttachment {
  type: 'url'
  url: string
  title?: string
  description?: string
}

// Custom attachment types
type ChatAttachment = FileAttachment | UrlAttachment
```

#### Upload Strategy Pattern

```typescript
// Upload strategy interface
interface UploadStrategy {
  upload(file: File): Promise<UploadResult>
  cancel(uploadId: string): void
  getProgress(uploadId: string): number
}

// Different upload implementations
class DirectUploadStrategy implements UploadStrategy {
  async upload(file: File): Promise<UploadResult> {
    // Direct file upload to server
  }
}

class Base64UploadStrategy implements UploadStrategy {
  async upload(file: File): Promise<UploadResult> {
    // Convert to base64 and include in message
  }
}

class S3UploadStrategy implements UploadStrategy {
  async upload(file: File): Promise<UploadResult> {
    // Upload to S3 with presigned URLs
  }
}
```

#### Component Architecture

```typescript
// Layout with separate attachment management
<ChatLayout>
  <ChatContent>
    <MessageList messages={messages} />
  </ChatContent>
  
  <ChatFooter>
    {/* File attachments managed separately */}
    <AttachmentManager
      attachments={attachments}
      onAdd={handleFileAdd}
      onRemove={handleFileRemove}
      uploadStrategy={uploadStrategy}
    />
    
    {/* Text input focused on text only */}
    <ChatInput
      value={textInput}
      onChange={setTextInput}
      onSubmit={handleTextSubmit}
    />
  </ChatFooter>
</ChatLayout>
```

#### Message Content with Attachments

```typescript
// Message content can contain references to attachments
type MessageContent = {
  text: string
  attachmentIds?: string[]  // References to uploaded attachments
}

// Or rich content with embedded attachments
type RichMessageContent = {
  type: 'rich'
  blocks: Array<
    | { type: 'text'; content: string }
    | { type: 'attachment'; attachmentId: string }
    | { type: 'image'; url: string; alt?: string }
  >
}
```

### Implementation Examples

#### Basic File Upload
```typescript
function SimpleChatWithFiles() {
  const [textInput, setTextInput] = useState('')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const uploadStrategy = useMemo(() => new DirectUploadStrategy(), [])
  
  const handleFileAdd = async (files: File[]) => {
    for (const file of files) {
      const attachment: FileAttachment = {
        id: nanoid(),
        type: 'file',
        file,
        status: 'uploading',
        progress: 0
      }
      setAttachments(prev => [...prev, attachment])
      
      try {
        const result = await uploadStrategy.upload(file)
        setAttachments(prev => prev.map(a => 
          a.id === attachment.id 
            ? { ...a, status: 'uploaded', url: result.url }
            : a
        ))
      } catch (error) {
        setAttachments(prev => prev.map(a => 
          a.id === attachment.id 
            ? { ...a, status: 'error', error: error.message }
            : a
        ))
      }
    }
  }
  
  const handleSubmit = (text: string) => {
    const uploadedAttachments = attachments.filter(a => a.status === 'uploaded')
    const message: MessageContent = {
      text,
      attachmentIds: uploadedAttachments.map(a => a.id)
    }
    
    // Send message with attachment references
    sendMessage(message)
    
    // Clear input and attachments
    setTextInput('')
    setAttachments([])
  }
  
  return (
    <ChatLayout>
      <AttachmentManager
        attachments={attachments}
        onAdd={handleFileAdd}
        onRemove={(id) => setAttachments(prev => prev.filter(a => a.id !== id))}
      />
      <ChatInput
        value={textInput}
        onChange={setTextInput}
        onSubmit={handleSubmit}
        disabled={attachments.some(a => a.status === 'uploading')}
      />
    </ChatLayout>
  )
}
```

#### Advanced Upload with Progress
```typescript
function AdvancedFileUpload() {
  const uploadContext = useUploadContext()
  
  return (
    <AttachmentManager
      attachments={uploadContext.attachments}
      onAdd={uploadContext.addFiles}
      onRemove={uploadContext.removeFile}
      renderAttachment={(attachment) => (
        <AttachmentCard
          attachment={attachment}
          showProgress={attachment.status === 'uploading'}
          showError={attachment.status === 'error'}
          onRetry={() => uploadContext.retryUpload(attachment.id)}
        />
      )}
    />
  )
}
```

### Benefits of This Approach

1. **Separation of Concerns**: Text input vs file management
2. **Flexible Upload Strategies**: Support different upload methods
3. **Progress Tracking**: Built-in upload progress and error handling
4. **Type Safety**: Generic attachment types for different use cases
5. **Composable**: Mix and match upload components as needed
6. **Testable**: Easy to mock upload strategies for testing

### Testing Strategy for File Uploads

```typescript
// Unit tests for upload strategies
describe('DirectUploadStrategy', () => {
  it('uploads file with progress tracking', async () => {
    const strategy = new DirectUploadStrategy(mockUploadEndpoint)
    const file = new File(['content'], 'test.txt')
    
    const result = await strategy.upload(file)
    expect(result.url).toBeDefined()
    expect(result.uploadId).toBeDefined()
  })
  
  it('handles upload errors gracefully', async () => {
    // Test error scenarios
  })
  
  it('supports upload cancellation', () => {
    // Test cancellation
  })
})

// Integration tests for AttachmentManager
describe('AttachmentManager', () => {
  it('manages multiple file uploads', async () => {
    // Test multiple file handling
  })
  
  it('shows progress for ongoing uploads', () => {
    // Test progress UI
  })
  
  it('handles file validation', () => {
    // Test file type/size validation
  })
})
```

### Storybook Stories for File Uploads

```typescript
// stories/AttachmentManager.stories.tsx
export default {
  title: 'Chat/AttachmentManager',
  component: AttachmentManager,
  parameters: {
    docs: {
      description: {
        component: 'Manages file uploads with different strategies'
      }
    }
  }
}

export const BasicFileUpload = {
  args: {
    uploadStrategy: new MockUploadStrategy(),
    maxFiles: 5,
    allowedTypes: ['image/*', '.pdf', '.doc']
  }
}

export const WithProgress = {
  render: () => <AttachmentManagerWithProgress />
}

export const ErrorHandling = {
  args: {
    uploadStrategy: new MockFailingUploadStrategy()
  }
}

export const DifferentStrategies = {
  render: () => (
    <div>
      <h3>Direct Upload</h3>
      <AttachmentManager uploadStrategy={new DirectUploadStrategy()} />
      
      <h3>Base64 Upload</h3>
      <AttachmentManager uploadStrategy={new Base64UploadStrategy()} />
      
      <h3>S3 Upload</h3>
      <AttachmentManager uploadStrategy={new S3UploadStrategy()} />
    </div>
  )
}
```

### Migration Path

1. **Phase 1**: Create separate `AttachmentManager` component with tests
2. **Phase 2**: Refactor `ChatInput` to remove file handling + update tests
3. **Phase 3**: Implement upload strategies with comprehensive test coverage
4. **Phase 4**: Update message content types + integration tests
5. **Phase 5**: Create Storybook stories for all upload scenarios
6. **Phase 6**: Update existing chat page implementation

## Inspiration from ai-chatbot/ Implementation

### Key Architectural Patterns

After analyzing the `ai-chatbot/` directory, several excellent patterns emerge that align with our refactor goals:

#### 1. **AI SDK Integration**
```typescript
// ai-chatbot uses @ai-sdk/react with useChat hook
const {
  messages, setMessages, handleSubmit, input, setInput, 
  append, status, stop, reload, experimental_resume, data
} = useChat({
  id, initialMessages,
  experimental_throttle: 100,
  sendExtraMessageFields: true,
  generateId: generateUUID,
  fetch: fetchWithErrorHandlers,
  onFinish, onError
})
```
**Lesson**: Integrate with modern AI SDK patterns for streaming, message management, and error handling.

#### 2. **Clean Component Composition**
```typescript
// Clean separation of concerns
<div className="flex flex-col min-w-0 h-dvh bg-background">
  <ChatHeader chatId={id} selectedModelId={initialChatModel} />
  <Messages chatId={id} status={status} votes={votes} messages={messages} />
  <form className="flex mx-auto px-4 bg-background pb-4">
    <MultimodalInput {...inputProps} />
  </form>
</div>
```
**Lesson**: Use simple composition over complex nested providers.

#### 3. **Smart Memoization Strategy**
```typescript
// Performance-optimized with custom memo comparisons
export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  return true;
});
```
**Lesson**: Use memo with custom equality checks for complex chat data.

#### 4. **Attachment Management Pattern**
```typescript
// Separate attachment state from text input
const [attachments, setAttachments] = useState<Array<Attachment>>([]);

// Upload queue for progress tracking
const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

// Clean file upload with progress
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/files/upload', { method: 'POST', body: formData });
  return await response.json();
};
```
**Lesson**: Separate attachment management with upload queues and progress tracking.

#### 5. **Message Parts Architecture**
```typescript
// Flexible message content with typed parts
message.parts?.map((part, index) => {
  if (part.type === 'reasoning') return <MessageReasoning />;
  if (part.type === 'text') return <Markdown>{part.text}</Markdown>;
  if (part.type === 'tool-invocation') return <ToolResult />;
});
```
**Lesson**: Use typed message parts for extensible content rendering.

#### 6. **Modern UX Patterns**
- **Framer Motion**: Smooth animations for message appear/disappear
- **Auto-scroll Management**: Smart scroll-to-bottom with user override
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Loading States**: Thinking indicators, streaming cursors
- **Error Handling**: Toast notifications with specific error messages

### Updated Architecture Recommendations

Based on ai-chatbot patterns, our chat refactor should include:

#### 1. **Chat State Management Layer (Without AI SDK)**

Custom hook inspired by AI SDK patterns but framework-agnostic:
- Message state management with generic types
- Streaming support with status tracking
- Submit, append, stop, reload functionality
- Error handling and completion callbacks
- Framework-independent implementation

#### 2. **Message Parts System**
Extensible message content through typed parts:
- Support for text, reasoning, tool-invocation, artifact, attachment parts
- Replace single content field with flexible parts array
- Enable rich, structured message content
- Foundation for tool and artifact integration

#### 3. **Smart Performance Optimization**
Intelligent memoization for chat components:
- Custom memo comparisons using `fast-deep-equal`
- Status, message length, and content change detection
- Prevent unnecessary re-renders in large message lists
- Performance-critical for real-time streaming

#### 4. **Modern UX Features**
- Framer Motion animations for smooth interactions
- Smart auto-scroll with manual override capability
- Upload progress with queue management
- Thinking/reasoning indicators for AI responses
- Comprehensive keyboard shortcuts

#### 5. **Tool/Artifact Integration Framework**
Essential extensibility system inspired by ai-chatbot patterns:

**Core Concepts**:
- Tool registry system for extensible capabilities
- Separate components for tool calls vs results
- Support for call, result, and error states
- Readonly mode for viewing-only scenarios

**Key Tool Integration Patterns**:
- **Document Tools**: Create, edit, and preview documents within chat
- **Code Execution**: Run code snippets with live results and output
- **Artifact Creation**: Generate interactive components (charts, forms, demos)
- **Reasoning Visualization**: Show AI thinking process step-by-step
- **Data Widgets**: Display structured data (weather, APIs, databases)

**Implementation Requirements**:
- Tool registry system for extensible capabilities
- Separate components for tool calls vs results
- Readonly mode support for viewing-only scenarios
- Error handling for failed tool executions
- Progress indication for long-running tools

### Implementation Priority Updates

**High Priority (MUST HAVE)**:
1. **Message parts system for extensible content** - Essential for tool/artifact support
2. **Unified interaction system** - Consolidate action-menu, message-actions, reactions into variants
3. **Smart memoization for performance** - Critical for large message lists
4. **Modern UX patterns (Framer Motion animations, auto-scroll)** - User requested essential UX
5. **Upload queue management with progress tracking** - Important file handling improvement
6. **Tool/artifact integration framework** - Core extensibility requirement

**Medium Priority**:
1. **Custom chat state management layer** - Framework-agnostic alternative to AI SDK
2. **Reasoning step visualization** - Important for AI transparency
3. **Advanced error handling with toast notifications** - Enhanced user experience

**Low Priority**:
1. **Specific tool implementations** (document editing, code execution, weather widgets)
2. **Advanced tool orchestration** - Complex tool chaining and workflows
3. **Plugin system** - Third-party tool integration

## Open Questions

1. **Should we maintain any backward compatibility?**
   - **Decision: No legacy APIs needed** - this is new development
   - **However: Must update all tests, Storybook, and documentation**

2. **How granular should the component split be?**
   - **Updated**: Follow ai-chatbot pattern - clean composition over complex nesting
   - Use simple component composition with smart memoization

3. **Should styling be completely in CSS or allow some programmatic control?**
   - **Updated**: CSS-first approach but include Framer Motion for complex animations
   - CSS for static styles, JavaScript for interactive animations

4. **How should we handle animation and transitions?**
   - **Updated**: Use Framer Motion following ai-chatbot patterns
   - Smooth message appear/disappear, scroll animations, loading states

5. **Should we support multiple chat instances on one page?**
   - **Updated**: Yes, but simplified through clean composition rather than complex providers
   - Each chat instance manages its own state

6. **What upload strategies should we implement by default?**
   - **Updated**: Follow ai-chatbot pattern with upload queue and progress tracking
   - Direct upload with FormData, upload queue state management

## Next Steps

1. **Review this document** for completeness and accuracy
2. **Get stakeholder approval** for the architectural direction
3. **Create detailed implementation tasks** for each phase
4. **Set up development environment** for the refactor
5. **Begin Phase 1 implementation**

---

*This document is a living specification that will be updated as the implementation progresses.*