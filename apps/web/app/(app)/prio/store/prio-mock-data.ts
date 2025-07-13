/**
 * Centralized mock data for the Priority (Prio) section
 * This file consolidates all mock data for goals, objectives, chats, and activities
 *
 * Data is normalized with separate collections and relationships via IDs
 * Computed data and UI views are derived from base collections
 */

import type { ListItem, TreeNode } from '@zondax/ui-common'

// ============================================================================
// Core Type Definitions
// ============================================================================

export interface Goal {
  id: string
  name: string
  description: string
  status: 'active' | 'planning' | 'completed'
  type: 'individual' | 'team'
  priority: 'high' | 'medium' | 'low'
  progress: number
  participantIds: string[]
  startDate: Date
  targetDate: Date | null
  tags: string[]
}

export interface Objective {
  id: string
  title: string
  description: string
  status: 'active' | 'in-progress' | 'completed' | 'pending'
  priority: 'high' | 'medium' | 'low'
  progress: number
  assigneeId: string
  goalId: string
  dueDate: Date | null
  startDate: Date
  estimatedHours: number | null
  actualHours: number
  tags: string[]
}

export interface ChatChannel {
  id: string
  name: string
  description: string
  goalId: string
  lastActivity: Date
  participantIds: string[]
  type: 'ai' | 'team' | 'mixed'
  status: 'active' | 'archived'
  tags: string[]
  isShared: boolean
}

export interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface Activity {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  description: string
  timestamp: Date
  userId?: string
  entityType?: 'goal' | 'objective' | 'chat' | 'document'
  entityId?: string
}

// ============================================================================
// Base Data Collections (Normalized)
// ============================================================================

export const PARTICIPANTS: Record<string, Participant> = {
  'user-you': {
    id: 'user-you',
    name: 'You',
    email: 'user@example.com',
    role: 'Individual Contributor',
  },
  'user-john': {
    id: 'user-john',
    name: 'John',
    email: 'john@example.com',
    role: 'Frontend Developer',
  },
  'user-sarah': {
    id: 'user-sarah',
    name: 'Sarah',
    email: 'sarah@example.com',
    role: 'Senior Frontend Developer',
  },
  'user-mike': {
    id: 'user-mike',
    name: 'Mike',
    email: 'mike@example.com',
    role: 'Backend Developer',
  },
  'user-emma': {
    id: 'user-emma',
    name: 'Emma',
    email: 'emma@example.com',
    role: 'Full Stack Developer',
  },
  'user-alex': {
    id: 'user-alex',
    name: 'Alex',
    email: 'alex@example.com',
    role: 'Project Manager',
  },
}

export const GOALS: Record<string, Goal> = {
  '00000000-0000-0000-0000-000000000100': {
    id: '00000000-0000-0000-0000-000000000100',
    name: 'Personal Workspace',
    description: 'Individual tasks and personal AI assistance',
    status: 'active',
    type: 'individual',
    priority: 'medium',
    progress: 45,
    participantIds: ['user-you'],
    startDate: new Date('2024-01-01'),
    targetDate: null,
    tags: ['personal', 'learning', 'productivity'],
  },
  '00000000-0000-0000-0000-000000000101': {
    id: '00000000-0000-0000-0000-000000000101',
    name: 'Project Alpha',
    description: 'Frontend development initiative focused on user experience improvements',
    status: 'active',
    type: 'team',
    priority: 'high',
    progress: 62,
    participantIds: ['user-john', 'user-sarah', 'user-mike', 'user-emma'],
    startDate: new Date('2024-01-15'),
    targetDate: new Date('2024-03-15'),
    tags: ['frontend', 'ui/ux', 'development'],
  },
  '00000000-0000-0000-0000-000000000102': {
    id: '00000000-0000-0000-0000-000000000102',
    name: 'Project Beta',
    description: 'Research and development for next-generation features',
    status: 'planning',
    type: 'team',
    priority: 'medium',
    progress: 25,
    participantIds: ['user-emma', 'user-sarah'],
    startDate: new Date('2024-02-01'),
    targetDate: new Date('2024-05-01'),
    tags: ['research', 'design', 'innovation'],
  },
  '00000000-0000-0000-0000-000000000103': {
    id: '00000000-0000-0000-0000-000000000103',
    name: 'Project Gamma',
    description: 'Strategic planning and deployment optimization',
    status: 'active',
    type: 'team',
    priority: 'high',
    progress: 80,
    participantIds: ['user-alex', 'user-mike'],
    startDate: new Date('2023-12-01'),
    targetDate: new Date('2024-02-29'),
    tags: ['strategy', 'planning', 'optimization'],
  },
}

export const OBJECTIVES: Record<string, Objective> = {
  '00000000-0000-0000-0000-000000000200': {
    id: '00000000-0000-0000-0000-000000000200',
    title: 'AI Assistant Integration',
    description: 'Integrate AI assistance into daily workflow',
    status: 'active',
    priority: 'medium',
    progress: 70,
    assigneeId: 'user-you',
    goalId: '00000000-0000-0000-0000-000000000100',
    dueDate: new Date('2024-02-15'),
    startDate: new Date('2024-01-01'),
    estimatedHours: 20,
    actualHours: 14,
    tags: ['ai', 'productivity', 'automation'],
  },
  '00000000-0000-0000-0000-000000000201': {
    id: '00000000-0000-0000-0000-000000000201',
    title: 'Knowledge Management System',
    description: 'Organize and categorize all bookmarks and references',
    status: 'in-progress',
    priority: 'medium',
    progress: 50,
    assigneeId: 'user-you',
    goalId: '00000000-0000-0000-0000-000000000100',
    dueDate: new Date('2024-02-28'),
    startDate: new Date('2024-01-05'),
    estimatedHours: 15,
    actualHours: 8,
    tags: ['organization', 'knowledge', 'bookmarks'],
  },
  '00000000-0000-0000-0000-000000000210': {
    id: '00000000-0000-0000-0000-000000000210',
    title: 'Frontend Component Library',
    description: 'Build comprehensive UI component system',
    status: 'active',
    priority: 'high',
    progress: 80,
    assigneeId: 'user-sarah',
    goalId: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date('2024-02-20'),
    startDate: new Date('2024-01-15'),
    estimatedHours: 40,
    actualHours: 32,
    tags: ['frontend', 'components', 'design-system'],
  },
  '00000000-0000-0000-0000-000000000211': {
    id: '00000000-0000-0000-0000-000000000211',
    title: 'Backend API Development',
    description: 'Create robust backend services and APIs',
    status: 'completed',
    priority: 'high',
    progress: 100,
    assigneeId: 'user-mike',
    goalId: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date('2024-02-10'),
    startDate: new Date('2024-01-15'),
    estimatedHours: 50,
    actualHours: 48,
    tags: ['backend', 'api', 'development'],
  },
}

export const CHAT_CHANNELS: Record<string, ChatChannel> = {
  '00000000-0000-0000-0000-000000000000': {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Code Review Assistant',
    description: 'AI assistant for code reviews and best practices',
    goalId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(),
    participantIds: ['user-you'],
    type: 'ai',
    status: 'active',
    tags: ['technical', 'development'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000001': {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Data Analysis Helper',
    description: 'AI assistant for data analysis and insights',
    goalId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
    participantIds: ['user-you'],
    type: 'ai',
    status: 'active',
    tags: ['analytics', 'data'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000002': {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Alpha Team + AI',
    description: 'Team collaboration with AI assistance',
    goalId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 15),
    participantIds: ['user-john', 'user-sarah', 'user-mike', 'user-emma'],
    type: 'mixed',
    status: 'active',
    tags: ['team', 'ai-assisted'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000003': {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Project Planning AI',
    description: 'AI assistant for project planning and management',
    goalId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    participantIds: ['user-alex'],
    type: 'ai',
    status: 'active',
    tags: ['planning', 'project-management'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000004': {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Beta Design Studio',
    description: 'Design team collaboration space',
    goalId: '00000000-0000-0000-0000-000000000102',
    lastActivity: new Date(Date.now() - 1000 * 60 * 45),
    participantIds: ['user-emma', 'user-sarah'],
    type: 'team',
    status: 'active',
    tags: ['design', 'creative'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000005': {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Documentation Writer',
    description: 'AI assistant for technical documentation',
    goalId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 4),
    participantIds: ['user-you'],
    type: 'ai',
    status: 'active',
    tags: ['documentation', 'writing'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000006': {
    id: '00000000-0000-0000-0000-000000000006',
    name: 'Gamma Strategy Team',
    description: 'Strategic planning and decision making',
    goalId: '00000000-0000-0000-0000-000000000103',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 6),
    participantIds: ['user-alex', 'user-mike'],
    type: 'team',
    status: 'active',
    tags: ['strategy', 'planning'],
    isShared: true,
  },
}

export const ACTIVITIES: Record<string, Activity> = {
  'activity-001': {
    id: 'activity-001',
    type: 'success',
    title: 'Task Completed',
    description: 'Frontend implementation finished',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    userId: 'user-sarah',
    entityType: 'objective',
    entityId: '00000000-0000-0000-0000-000000000210',
  },
  'activity-002': {
    id: 'activity-002',
    type: 'info',
    title: 'New Comment',
    description: 'John commented on API design',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    userId: 'user-john',
    entityType: 'objective',
    entityId: '00000000-0000-0000-0000-000000000211',
  },
  'activity-003': {
    id: 'activity-003',
    type: 'warning',
    title: 'Deadline Approaching',
    description: 'Beta release in 2 days',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    entityType: 'goal',
    entityId: '00000000-0000-0000-0000-000000000102',
  },
  'activity-004': {
    id: 'activity-004',
    type: 'info',
    title: 'Member Joined',
    description: 'Sarah joined Project Alpha',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    userId: 'user-sarah',
    entityType: 'goal',
    entityId: '00000000-0000-0000-0000-000000000101',
  },
  'activity-005': {
    id: 'activity-005',
    type: 'success',
    title: 'Backend API Completed',
    description: 'All API endpoints are now live',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    userId: 'user-mike',
    entityType: 'objective',
    entityId: '00000000-0000-0000-0000-000000000211',
  },
}

// ============================================================================
// Computed/Derived Data
// ============================================================================

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

// Get recent activities sorted by timestamp
export function getRecentActivities(limit = 10): Activity[] {
  return Object.values(ACTIVITIES)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

// Get objectives for a specific goal
export function getObjectivesByGoal(goalId: string): Objective[] {
  return Object.values(OBJECTIVES).filter((obj) => obj.goalId === goalId)
}

// Get chat channels for a specific goal
export function getChatChannelsByGoal(goalId: string): ChatChannel[] {
  return Object.values(CHAT_CHANNELS).filter((chat) => chat.goalId === goalId)
}

// Get active goals only
export function getActiveGoals(): Goal[] {
  return Object.values(GOALS).filter((goal) => goal.status === 'active')
}

// Get objective details with goal information
export function getObjectiveDetail(id: string): ObjectiveDetail | null {
  const objective = OBJECTIVES[id]
  if (!objective) return null

  const goal = GOALS[objective.goalId]
  const assignee = PARTICIPANTS[objective.assigneeId]

  // Generate mock subtasks based on objective
  const mockSubtasks = [
    {
      id: `${id}-1`,
      text: 'Define requirements and scope',
      title: 'Requirements Definition',
      completed: true,
      assigneeId: objective.assigneeId,
    },
    { id: `${id}-2`, text: 'Research and analysis phase', title: 'Research Phase', completed: true, assigneeId: objective.assigneeId },
    { id: `${id}-3`, text: 'Design and planning', title: 'Design Planning', completed: false, assigneeId: objective.assigneeId },
    { id: `${id}-4`, text: 'Implementation and testing', title: 'Implementation', completed: false, assigneeId: objective.assigneeId },
    { id: `${id}-5`, text: 'Review and documentation', title: 'Documentation', completed: false, assigneeId: objective.assigneeId },
  ]

  // Generate mock documents
  const mockDocuments = [
    {
      id: `${id}-doc-1`,
      name: 'requirements.pdf',
      title: 'Requirements Document',
      description: 'Detailed requirements and specifications for the objective',
      type: 'PDF',
      url: '/documents/requirements.pdf',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: `${id}-doc-2`,
      name: 'design-specs.docx',
      title: 'Design Specifications',
      description: 'Technical design documents and architecture plans',
      type: 'DOCX',
      url: '/documents/design-specs.docx',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: `${id}-doc-3`,
      name: 'test-results.xlsx',
      title: 'Test Results',
      description: 'Comprehensive testing results and metrics',
      type: 'XLSX',
      url: '/documents/test-results.xlsx',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
  ]

  // Generate mock comments
  const mockComments = [
    {
      id: `${id}-comment-1`,
      author: 'Team Lead',
      content: 'Great progress on this objective! The implementation is looking solid.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
    {
      id: `${id}-comment-2`,
      author: 'Project Manager',
      content: 'Please update the timeline estimates in the next standup.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
    {
      id: `${id}-comment-3`,
      author: assignee?.name || 'Team Member',
      content: 'Working on the final testing phase. Should be complete by end of week.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
  ]

  return {
    ...objective,
    goalId: objective.goalId,
    goalName: goal?.name || 'Unknown Goal',
    assigneeName: assignee?.name || 'Unknown',
    subtasks: mockSubtasks,
    documents: mockDocuments,
    comments: mockComments,
  }
}

// Get chat info with goal information
export function getChatInfo(id: string) {
  const chat = CHAT_CHANNELS[id]
  if (!chat) return null

  const goal = GOALS[chat.goalId]

  return {
    ...chat,
    goalName: goal?.name || 'Unknown Goal',
  }
}

// ============================================================================
// UI-Ready Data Structures
// ============================================================================

// Navigation structure for sidebar components
export const NAVIGATION_NODES: TreeNode[] = [
  {
    id: 'chats',
    label: 'Chats',
    href: '/prio/chats',
    children: Object.values(CHAT_CHANNELS).map((chat) => ({
      id: `chat-${chat.id}`,
      label: chat.name,
      href: `/prio/chats/${chat.id}`,
      badge: chat.type === 'team' ? '●' : undefined,
    })),
  },
  {
    id: 'goals',
    label: 'Goals',
    href: '/prio/goals',
    children: getActiveGoals().map((goal) => ({
      id: `goal-${goal.id}`,
      label: goal.name,
      href: `/prio/goals/${goal.id}`,
      badge: goal.status === 'active' ? '●' : undefined,
    })),
  },
  {
    id: 'objectives',
    label: 'Objectives',
    href: '/prio/objectives',
  },
]

// Activity feed for UI components (with computed relative times)
export const ACTIVITY_FEED = getRecentActivities(10).map((activity) => ({
  id: activity.id,
  type: activity.type,
  title: activity.title,
  description: activity.description,
  time: formatRelativeTime(activity.timestamp),
}))

// Recent activity items formatted for SidebarList component
export const RECENT_ACTIVITY_ITEMS: ListItem[] = ACTIVITY_FEED.slice(0, 4).map((activity) => ({
  id: activity.id,
  iconColor:
    activity.type === 'success'
      ? 'text-green-600'
      : activity.type === 'warning'
        ? 'text-yellow-600'
        : activity.type === 'error'
          ? 'text-red-600'
          : 'text-blue-600',
  title: activity.title,
  description: activity.description,
  time: activity.time,
}))

// ============================================================================
// Chat Templates
// ============================================================================

export const CHAT_TEMPLATES = [
  {
    id: 'brainstorm',
    name: 'Brainstorming Partner',
    description: 'Creative ideation and exploration of new concepts',
    prompt: 'Help me brainstorm and explore creative ideas. Ask probing questions and suggest innovative approaches.',
    type: 'individual' as const,
    tags: ['creative', 'ideation'],
  },
  {
    id: 'code-review',
    name: 'Code Review Assistant',
    description: 'Technical code review and best practices guidance',
    prompt: 'Review code for quality, performance, and best practices. Suggest improvements and identify potential issues.',
    type: 'individual' as const,
    tags: ['technical', 'development'],
  },
  {
    id: 'team-standup',
    name: 'Team Standup',
    description: 'Daily team synchronization and progress tracking',
    prompt: 'Facilitate team standup meetings. Track progress, identify blockers, and coordinate team efforts.',
    type: 'team' as const,
    tags: ['team', 'coordination'],
  },
  {
    id: 'strategy',
    name: 'Strategy Advisor',
    description: 'Strategic planning and decision-making support',
    prompt: 'Provide strategic insights and help evaluate different approaches. Consider long-term implications and trade-offs.',
    type: 'individual' as const,
    tags: ['strategy', 'planning'],
    isShared: true,
  },
  {
    id: 'launch-prep',
    name: 'Launch Preparation',
    description: 'Product launch coordination and checklist management',
    prompt: 'Help coordinate product launches. Track deliverables, identify risks, and ensure all aspects are covered.',
    type: 'team' as const,
    tags: ['launch', 'coordination'],
  },
  {
    id: 'custom',
    name: 'Custom Chat',
    description: 'Create your own specialized AI assistant',
    prompt: '',
    type: 'individual' as const,
    tags: ['custom'],
  },
]

// ============================================================================
// Legacy Support & Exports
// ============================================================================

// Export individual collections for direct access
export const ALL_GOALS = Object.values(GOALS)
export const ALL_OBJECTIVES = Object.values(OBJECTIVES)
export const ALL_CHAT_CHANNELS = Object.values(CHAT_CHANNELS)
export const ALL_PARTICIPANTS = Object.values(PARTICIPANTS)
export const ALL_ACTIVITIES = Object.values(ACTIVITIES)

// ============================================================================
// Additional Types and Functions for UI Components
// ============================================================================

// Extended types for UI views
export interface GoalDetail extends Goal {
  goalName: string
  participants: { id: string; name: string; role?: string }[]
  objectives: Objective[]
  chats: ChatChannel[]
  chatChannels: ChatChannel[] // Alias for compatibility
  completedObjectives: number
  objectiveCount: number
}

export interface ObjectiveDetail extends Objective {
  assigneeName: string
  goalName: string
  subtasks: { id: string; text: string; title: string; completed: boolean; assigneeId: string }[]
  documents: {
    id: string
    name: string
    title: string
    description: string
    type: string
    url: string
    uploadedAt: Date
    lastModified: Date
  }[]
  comments: { id: string; author: string; content: string; timestamp: Date }[]
}

export interface ChatChannelDetail extends ChatChannel {
  goalName: string
  lastMessageTime: string
  unreadCount: number
  participants: { id: string; name: string }[]
  messageCount: number
  lastMessage: string
}

// Template exports
export const MISSION_TEMPLATES = [
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Plan and execute a successful product launch',
    type: 'team' as const,
    priority: 'high' as const,
    estimatedDuration: '3-6 months',
    suggestedObjectives: ['Market research', 'Development', 'Marketing campaign', 'Launch event'],
    objectives: ['Market research', 'Development', 'Marketing campaign', 'Launch event'], // Legacy support
  },
  {
    id: 'team-growth',
    name: 'Team Growth',
    description: 'Build and scale your team effectively',
    type: 'team' as const,
    priority: 'medium' as const,
    estimatedDuration: '2-4 months',
    suggestedObjectives: ['Hiring plan', 'Onboarding process', 'Team culture', 'Performance reviews'],
    objectives: ['Hiring plan', 'Onboarding process', 'Team culture', 'Performance reviews'], // Legacy support
  },
  {
    id: 'technical-debt',
    name: 'Technical Debt',
    description: 'Address and reduce technical debt systematically',
    type: 'individual' as const,
    priority: 'medium' as const,
    estimatedDuration: '1-3 months',
    suggestedObjectives: ['Code audit', 'Refactoring plan', 'Testing coverage', 'Documentation'],
    objectives: ['Code audit', 'Refactoring plan', 'Testing coverage', 'Documentation'], // Legacy support
  },
]

export const OBJECTIVE_TEMPLATES = [
  {
    id: 'research',
    name: 'Research & Analysis',
    description: 'Conduct thorough research and analysis',
    estimatedHours: 40,
    priority: 'medium' as const,
    tags: ['analysis', 'research'],
    suggestedSubtasks: ['Define research scope', 'Gather data sources', 'Analyze findings', 'Document insights'],
  },
  {
    id: 'implementation',
    name: 'Implementation',
    description: 'Build and implement the solution',
    estimatedHours: 80,
    priority: 'high' as const,
    tags: ['development', 'coding'],
    suggestedSubtasks: ['Design architecture', 'Develop features', 'Integration testing', 'Deployment preparation'],
  },
  {
    id: 'testing',
    name: 'Testing & QA',
    description: 'Comprehensive testing and quality assurance',
    estimatedHours: 20,
    priority: 'high' as const,
    tags: ['testing', 'quality'],
    suggestedSubtasks: ['Unit testing', 'Integration testing', 'User acceptance testing', 'Bug fixes'],
  },
]

export const AVAILABLE_GOALS = ALL_GOALS.map((goal) => ({
  id: goal.id,
  name: goal.name,
  type: goal.type,
}))

// Helper functions for getting detailed views
export function getGoalsWithDetails(): GoalDetail[] {
  return ALL_GOALS.map((goal) => {
    const chats = ALL_CHAT_CHANNELS.filter((chat) => chat.goalId === goal.id)
    const objectives = ALL_OBJECTIVES.filter((obj) => obj.goalId === goal.id)
    const completedObjectives = objectives.filter((obj) => obj.status === 'completed').length
    return {
      ...goal,
      goalName: goal.name,
      participants: goal.participantIds.map((id) => ({
        id,
        name: PARTICIPANTS[id]?.name || 'Unknown',
        role: PARTICIPANTS[id]?.role,
      })),
      objectives,
      chats,
      chatChannels: chats, // Alias for compatibility
      completedObjectives,
      objectiveCount: objectives.length,
    }
  })
}

export function getGoalDetail(goalId: string): GoalDetail | null {
  const goal = GOALS[goalId]
  if (!goal) return null

  const chats = ALL_CHAT_CHANNELS.filter((chat) => chat.goalId === goalId)
  const objectives = ALL_OBJECTIVES.filter((obj) => obj.goalId === goalId)
  const completedObjectives = objectives.filter((obj) => obj.status === 'completed').length
  return {
    ...goal,
    goalName: goal.name,
    participants: goal.participantIds.map((id) => ({
      id,
      name: PARTICIPANTS[id]?.name || 'Unknown',
      role: PARTICIPANTS[id]?.role,
    })),
    objectives,
    chats,
    chatChannels: chats, // Alias for compatibility
    completedObjectives,
    objectiveCount: objectives.length,
  }
}

export function getAllChatsWithDetails(): ChatChannelDetail[] {
  const mockMessages = [
    'Let me help you with that code review.',
    'The data analysis is complete. Here are the insights...',
    'Team standup scheduled for 10 AM tomorrow.',
    'I found a potential optimization in the codebase.',
    'Documentation has been updated successfully.',
    'Strategy document draft is ready for review.',
  ]

  return ALL_CHAT_CHANNELS.map((chat, index) => ({
    ...chat,
    goalName: GOALS[chat.goalId]?.name || 'Unknown Goal',
    lastMessageTime: formatRelativeTime(chat.lastActivity),
    unreadCount: Math.floor(Math.random() * 5), // Mock unread count
    participants: chat.participantIds.map((id) => ({
      id,
      name: PARTICIPANTS[id]?.name || 'Unknown',
    })),
    messageCount: Math.floor(Math.random() * 100) + 10, // Mock message count
    lastMessage: mockMessages[index % mockMessages.length], // Mock last message
  }))
}
