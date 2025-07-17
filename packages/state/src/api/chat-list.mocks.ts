import type { ChatChannel } from './chat-list.types'

// Mock data that would be replaced with real gRPC calls
export const MOCK_CHAT_CHANNELS: Record<string, ChatChannel> = {
  '00000000-0000-0000-0000-000000000000': {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Travel Planning Assistant',
    description: 'AI helper for destination research, itinerary planning, and travel tips',
    missionId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    participantIds: ['user-you'],
    type: 'ai',
    status: 'active',
    tags: ['travel', 'planning', 'destinations'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000001': {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Budget & Expense Tracker',
    description: 'Financial planning and expense tracking for your holiday',
    missionId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    participantIds: ['user-you'],
    type: 'ai',
    status: 'active',
    tags: ['budget', 'finance', 'tracking'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000002': {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Family Holiday Planning',
    description: 'Collaborative space for family members to plan together',
    missionId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    participantIds: ['user-you', 'user-sarah', 'user-alex'],
    type: 'team',
    status: 'active',
    tags: ['family', 'collaboration', 'planning'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000003': {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Product Strategy & Research',
    description: 'Market analysis, user research, and competitive intelligence for the new AI tool',
    missionId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    participantIds: ['user-emma', 'user-alex'],
    type: 'team',
    status: 'active',
    tags: ['strategy', 'research', 'market-analysis'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000004': {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Development Team',
    description: 'Technical discussions, code reviews, and sprint planning for MVP development',
    missionId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    participantIds: ['user-john', 'user-mike', 'user-sarah'],
    type: 'team',
    status: 'active',
    tags: ['development', 'technical', 'sprint'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000005': {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'AI Architecture Assistant',
    description: 'Technical guidance for AI model integration and system architecture',
    missionId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    participantIds: ['user-mike'],
    type: 'ai',
    status: 'active',
    tags: ['ai', 'architecture', 'technical'],
    isShared: false,
  },
}
