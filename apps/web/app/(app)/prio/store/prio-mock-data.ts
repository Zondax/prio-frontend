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
    name: 'Next Holidays',
    description:
      'Plan and organize comprehensive holiday travel experience including destinations, accommodations, activities, and budget management',
    status: 'active',
    type: 'individual',
    priority: 'high',
    progress: 35,
    participantIds: ['user-you', 'user-sarah'],
    startDate: new Date('2024-01-15'),
    targetDate: new Date('2024-03-01'),
    tags: ['travel', 'personal', 'planning', 'vacation'],
  },
  '00000000-0000-0000-0000-000000000101': {
    id: '00000000-0000-0000-0000-000000000101',
    name: 'New Product',
    description: 'Research, design, develop, and launch an innovative AI-powered productivity tool for knowledge workers',
    status: 'active',
    type: 'team',
    priority: 'high',
    progress: 65,
    participantIds: ['user-john', 'user-sarah', 'user-mike', 'user-emma', 'user-alex'],
    startDate: new Date('2023-12-01'),
    targetDate: new Date('2024-06-15'),
    tags: ['product', 'innovation', 'AI', 'development', 'launch'],
  },
  '00000000-0000-0000-0000-000000000102': {
    id: '00000000-0000-0000-0000-000000000102',
    name: 'Strategy 2026',
    description:
      'Develop comprehensive 3-year strategic roadmap including market analysis, technology investments, team expansion, and revenue growth targets',
    status: 'active',
    type: 'team',
    priority: 'high',
    progress: 45,
    participantIds: ['user-alex', 'user-mike', 'user-emma'],
    startDate: new Date('2024-01-01'),
    targetDate: new Date('2024-04-30'),
    tags: ['strategy', 'planning', '2026', 'roadmap', 'growth'],
  },
}

export const OBJECTIVES: Record<string, Objective> = {
  // Next Holidays - Documents/Outputs
  '00000000-0000-0000-0000-000000000200': {
    id: '00000000-0000-0000-0000-000000000200',
    title: 'Travel Itinerary Document',
    description: 'Comprehensive day-by-day travel plan with flights, accommodations, activities, and local recommendations',
    status: 'active',
    priority: 'high',
    progress: 75,
    assigneeId: 'user-you',
    goalId: '00000000-0000-0000-0000-000000000100',
    dueDate: new Date('2024-02-20'),
    startDate: new Date('2024-01-15'),
    estimatedHours: 12,
    actualHours: 9,
    tags: ['itinerary', 'planning', 'travel', 'document'],
  },
  '00000000-0000-0000-0000-000000000201': {
    id: '00000000-0000-0000-0000-000000000201',
    title: 'Budget & Expense Tracker',
    description: 'Detailed budget breakdown with cost estimates, expense tracking sheet, and financial planning',
    status: 'in-progress',
    priority: 'medium',
    progress: 45,
    assigneeId: 'user-sarah',
    goalId: '00000000-0000-0000-0000-000000000100',
    dueDate: new Date('2024-02-25'),
    startDate: new Date('2024-01-20'),
    estimatedHours: 8,
    actualHours: 4,
    tags: ['budget', 'expenses', 'financial', 'spreadsheet'],
  },
  '00000000-0000-0000-0000-000000000202': {
    id: '00000000-0000-0000-0000-000000000202',
    title: 'Packing & Checklist Guide',
    description: 'Weather-appropriate packing list, travel essentials checklist, and emergency contact sheet',
    status: 'pending',
    priority: 'low',
    progress: 10,
    assigneeId: 'user-you',
    goalId: '00000000-0000-0000-0000-000000000100',
    dueDate: new Date('2024-02-28'),
    startDate: new Date('2024-02-15'),
    estimatedHours: 4,
    actualHours: 0,
    tags: ['packing', 'checklist', 'preparation'],
  },
  // New Product - Documents/Outputs
  '00000000-0000-0000-0000-000000000210': {
    id: '00000000-0000-0000-0000-000000000210',
    title: 'Market Research Report',
    description: 'Comprehensive analysis of target market, competitor landscape, user personas, and market opportunity',
    status: 'completed',
    priority: 'high',
    progress: 100,
    assigneeId: 'user-emma',
    goalId: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date('2024-02-01'),
    startDate: new Date('2023-12-01'),
    estimatedHours: 60,
    actualHours: 65,
    tags: ['research', 'market', 'analysis', 'report'],
  },
  '00000000-0000-0000-0000-000000000211': {
    id: '00000000-0000-0000-0000-000000000211',
    title: 'Product Requirements Document (PRD)',
    description: 'Detailed technical and functional specifications, user stories, acceptance criteria, and system architecture',
    status: 'completed',
    priority: 'high',
    progress: 100,
    assigneeId: 'user-alex',
    goalId: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date('2024-02-15'),
    startDate: new Date('2024-01-15'),
    estimatedHours: 40,
    actualHours: 42,
    tags: ['requirements', 'specification', 'architecture', 'PRD'],
  },
  '00000000-0000-0000-0000-000000000212': {
    id: '00000000-0000-0000-0000-000000000212',
    title: 'MVP Prototype & Demo',
    description: 'Working prototype demonstrating core features with user interface mockups and technical proof-of-concept',
    status: 'active',
    priority: 'high',
    progress: 80,
    assigneeId: 'user-john',
    goalId: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date('2024-03-15'),
    startDate: new Date('2024-02-01'),
    estimatedHours: 120,
    actualHours: 95,
    tags: ['prototype', 'MVP', 'demo', 'development'],
  },
  '00000000-0000-0000-0000-000000000213': {
    id: '00000000-0000-0000-0000-000000000213',
    title: 'Go-to-Market Strategy',
    description: 'Launch plan including pricing strategy, marketing channels, sales process, and success metrics',
    status: 'in-progress',
    priority: 'medium',
    progress: 35,
    assigneeId: 'user-sarah',
    goalId: '00000000-0000-0000-0000-000000000101',
    dueDate: new Date('2024-04-01'),
    startDate: new Date('2024-03-01'),
    estimatedHours: 35,
    actualHours: 12,
    tags: ['marketing', 'strategy', 'launch', 'GTM'],
  },
  // Strategy 2026 - Documents/Outputs
  '00000000-0000-0000-0000-000000000220': {
    id: '00000000-0000-0000-0000-000000000220',
    title: 'Market Analysis & Trends Report',
    description: 'Industry landscape analysis, emerging technology trends, competitive positioning, and market opportunities through 2026',
    status: 'completed',
    priority: 'high',
    progress: 100,
    assigneeId: 'user-emma',
    goalId: '00000000-0000-0000-0000-000000000102',
    dueDate: new Date('2024-02-15'),
    startDate: new Date('2024-01-01'),
    estimatedHours: 50,
    actualHours: 55,
    tags: ['analysis', 'trends', 'market', 'research'],
  },
  '00000000-0000-0000-0000-000000000221': {
    id: '00000000-0000-0000-0000-000000000221',
    title: 'Technology Roadmap',
    description: '3-year technology investment plan, infrastructure scaling strategy, and innovation priorities',
    status: 'active',
    priority: 'high',
    progress: 60,
    assigneeId: 'user-mike',
    goalId: '00000000-0000-0000-0000-000000000102',
    dueDate: new Date('2024-03-30'),
    startDate: new Date('2024-02-01'),
    estimatedHours: 45,
    actualHours: 25,
    tags: ['technology', 'roadmap', 'infrastructure', 'innovation'],
  },
  '00000000-0000-0000-0000-000000000222': {
    id: '00000000-0000-0000-0000-000000000222',
    title: 'Financial Projections Model',
    description: 'Revenue forecasts, growth targets, investment requirements, and financial scenarios for 2024-2026',
    status: 'in-progress',
    priority: 'high',
    progress: 70,
    assigneeId: 'user-alex',
    goalId: '00000000-0000-0000-0000-000000000102',
    dueDate: new Date('2024-04-15'),
    startDate: new Date('2024-02-15'),
    estimatedHours: 30,
    actualHours: 20,
    tags: ['financial', 'projections', 'revenue', 'model'],
  },
  '00000000-0000-0000-0000-000000000223': {
    id: '00000000-0000-0000-0000-000000000223',
    title: 'Organizational Development Plan',
    description: 'Team expansion strategy, hiring roadmap, organizational structure, and culture development initiatives',
    status: 'pending',
    priority: 'medium',
    progress: 15,
    assigneeId: 'user-alex',
    goalId: '00000000-0000-0000-0000-000000000102',
    dueDate: new Date('2024-04-30'),
    startDate: new Date('2024-03-15'),
    estimatedHours: 25,
    actualHours: 4,
    tags: ['organization', 'hiring', 'team', 'culture'],
  },
}

export const CHAT_CHANNELS: Record<string, ChatChannel> = {
  // Next Holidays Goal - Travel planning chats
  '00000000-0000-0000-0000-000000000000': {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Travel Planning Assistant',
    description: 'AI helper for destination research, itinerary planning, and travel tips',
    goalId: '00000000-0000-0000-0000-000000000100',
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
    goalId: '00000000-0000-0000-0000-000000000100',
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
    goalId: '00000000-0000-0000-0000-000000000100',
    lastActivity: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    participantIds: ['user-you', 'user-sarah', 'user-alex'],
    type: 'team',
    status: 'active',
    tags: ['family', 'collaboration', 'planning'],
    isShared: true,
  },

  // New Product Goal - AI productivity tool development
  '00000000-0000-0000-0000-000000000003': {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Product Strategy & Research',
    description: 'Market analysis, user research, and competitive intelligence for the new AI tool',
    goalId: '00000000-0000-0000-0000-000000000101',
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
    goalId: '00000000-0000-0000-0000-000000000101',
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
    goalId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    participantIds: ['user-mike'],
    type: 'ai',
    status: 'active',
    tags: ['ai', 'architecture', 'technical'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000006': {
    id: '00000000-0000-0000-0000-000000000006',
    name: 'Go-to-Market Planning',
    description: 'Launch strategy, marketing campaigns, and customer acquisition planning',
    goalId: '00000000-0000-0000-0000-000000000101',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    participantIds: ['user-emma', 'user-sarah'],
    type: 'team',
    status: 'active',
    tags: ['marketing', 'launch', 'gtm'],
    isShared: true,
  },

  // Strategy 2026 Goal - Strategic planning and vision
  '00000000-0000-0000-0000-000000000007': {
    id: '00000000-0000-0000-0000-000000000007',
    name: 'Executive Strategy Council',
    description: 'High-level strategic discussions and decision making for 2026 roadmap',
    goalId: '00000000-0000-0000-0000-000000000102',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    participantIds: ['user-alex', 'user-emma', 'user-mike'],
    type: 'team',
    status: 'active',
    tags: ['executive', 'strategy', 'vision'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000008': {
    id: '00000000-0000-0000-0000-000000000008',
    name: 'Market Intelligence AI',
    description: 'AI assistant for market trends analysis, competitive intelligence, and industry insights',
    goalId: '00000000-0000-0000-0000-000000000102',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    participantIds: ['user-emma'],
    type: 'ai',
    status: 'active',
    tags: ['market-intelligence', 'trends', 'analysis'],
    isShared: false,
  },
  '00000000-0000-0000-0000-000000000009': {
    id: '00000000-0000-0000-0000-000000000009',
    name: 'Technology & Innovation Hub',
    description: 'Technical roadmap planning, innovation projects, and technology investment decisions',
    goalId: '00000000-0000-0000-0000-000000000102',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    participantIds: ['user-mike', 'user-john'],
    type: 'team',
    status: 'active',
    tags: ['technology', 'innovation', 'roadmap'],
    isShared: true,
  },
  '00000000-0000-0000-0000-000000000010': {
    id: '00000000-0000-0000-0000-000000000010',
    name: 'Financial Planning Advisor',
    description: 'AI assistant for financial projections, investment planning, and business modeling',
    goalId: '00000000-0000-0000-0000-000000000102',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    participantIds: ['user-alex'],
    type: 'ai',
    status: 'active',
    tags: ['financial', 'projections', 'modeling'],
    isShared: false,
  },
}

// ============================================================================
// Chat Bookmarks (1-2 per chat for realistic usage)
// ============================================================================

export interface ChatBookmark {
  id: string
  chatChannelId: string
  messageId: string
  type: 'message' | 'selection' | 'paragraph'
  title: string
  content: string
  timestamp: Date
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'pink' | 'cyan' | 'gray'
  tags?: string[]
  note?: string
  position?: {
    start: number
    end: number
    text: string
  }
}

export const CHAT_BOOKMARKS: Record<string, ChatBookmark> = {
  // Next Holidays - Travel Planning Assistant bookmarks
  'bookmark-travel-001': {
    id: 'bookmark-travel-001',
    chatChannelId: '00000000-0000-0000-0000-000000000000',
    messageId: 'msg-travel-003',
    type: 'message',
    title: 'Best Time to Visit Japan',
    content:
      'For cherry blossom season, plan to visit Japan between late March and early May. Tokyo peaks around early April, while northern regions like Hokkaido bloom later in late April to early May.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    color: 'pink',
    tags: ['japan', 'cherry-blossom', 'timing'],
    note: 'Perfect timing for our spring trip!',
  },
  'bookmark-travel-002': {
    id: 'bookmark-travel-002',
    chatChannelId: '00000000-0000-0000-0000-000000000000',
    messageId: 'msg-travel-007',
    type: 'selection',
    title: 'Flight Booking Tips',
    content: 'Book 6-8 weeks in advance for international flights, use Tuesday-Thursday departures for better prices',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    color: 'blue',
    tags: ['flights', 'booking', 'savings'],
    position: {
      start: 45,
      end: 135,
      text: 'Book 6-8 weeks in advance for international flights, use Tuesday-Thursday departures for better prices',
    },
  },

  // Next Holidays - Budget & Expense Tracker bookmarks
  'bookmark-budget-001': {
    id: 'bookmark-budget-001',
    chatChannelId: '00000000-0000-0000-0000-000000000001',
    messageId: 'msg-budget-004',
    type: 'message',
    title: 'Daily Budget Breakdown',
    content:
      'For a 10-day Japan trip: Accommodation $150/day, Food $80/day, Activities $100/day, Transport $30/day. Total: $360/day or $3,600 for the trip.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    color: 'green',
    tags: ['budget', 'daily-costs', 'japan'],
    note: 'Base budget - might need buffer for shopping',
  },

  // Next Holidays - Family Holiday Planning bookmarks
  'bookmark-family-001': {
    id: 'bookmark-family-001',
    chatChannelId: '00000000-0000-0000-0000-000000000002',
    messageId: 'msg-family-002',
    type: 'paragraph',
    title: 'Kid-Friendly Activities Tokyo',
    content:
      'Tokyo Disneyland and DisneySea are must-visits for families. Also consider Ueno Zoo, TeamLab Borderless digital art museum, and Harajuku for teenage shopping. Most attractions have English support.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    color: 'yellow',
    tags: ['family', 'kids', 'tokyo', 'attractions'],
  },
  'bookmark-family-002': {
    id: 'bookmark-family-002',
    chatChannelId: '00000000-0000-0000-0000-000000000002',
    messageId: 'msg-family-006',
    type: 'selection',
    title: 'JR Pass vs Individual Tickets',
    content: 'For 10 days with Tokyo-Kyoto-Osaka route, JR Pass (¥29,650) saves about ¥15,000 vs individual tickets',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    color: 'blue',
    tags: ['transport', 'jr-pass', 'savings'],
    position: {
      start: 22,
      end: 122,
      text: 'JR Pass (¥29,650) saves about ¥15,000 vs individual tickets',
    },
  },

  // New Product - Product Strategy & Research bookmarks
  'bookmark-strategy-001': {
    id: 'bookmark-strategy-001',
    chatChannelId: '00000000-0000-0000-0000-000000000003',
    messageId: 'msg-strategy-005',
    type: 'message',
    title: 'Target Market Size',
    content:
      'AI productivity tools market is $13.8B in 2024, growing at 35% CAGR. Knowledge workers segment (our target) represents 60% of market at $8.3B with highest willingness to pay for AI assistance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    color: 'purple',
    tags: ['market-size', 'ai-productivity', 'growth'],
    note: 'Present this to investors',
  },
  'bookmark-strategy-002': {
    id: 'bookmark-strategy-002',
    chatChannelId: '00000000-0000-0000-0000-000000000003',
    messageId: 'msg-strategy-008',
    type: 'selection',
    title: 'Competitive Differentiation',
    content: 'Focus on context-aware AI that learns user workflows vs generic chatbot approach',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    color: 'orange',
    tags: ['differentiation', 'competitive-advantage'],
    position: {
      start: 15,
      end: 95,
      text: 'context-aware AI that learns user workflows vs generic chatbot approach',
    },
  },

  // New Product - Development Team bookmarks
  'bookmark-dev-001': {
    id: 'bookmark-dev-001',
    chatChannelId: '00000000-0000-0000-0000-000000000004',
    messageId: 'msg-dev-003',
    type: 'message',
    title: 'MVP Architecture Decision',
    content:
      'Decided on microservices architecture: API Gateway → Auth Service → AI Processing Service → Data Store. Using TypeScript/Node.js for backend, React for frontend, and PostgreSQL for persistence.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    color: 'blue',
    tags: ['architecture', 'mvp', 'technical'],
    note: 'Architecture approved by tech lead',
  },
  'bookmark-dev-002': {
    id: 'bookmark-dev-002',
    chatChannelId: '00000000-0000-0000-0000-000000000004',
    messageId: 'msg-dev-007',
    type: 'selection',
    title: 'Sprint 1 Deliverables',
    content: 'User authentication, basic chat interface, AI model integration, data persistence layer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    color: 'green',
    tags: ['sprint', 'deliverables', 'mvp'],
    position: {
      start: 0,
      end: 95,
      text: 'User authentication, basic chat interface, AI model integration, data persistence layer',
    },
  },

  // New Product - AI Architecture Assistant bookmarks
  'bookmark-ai-arch-001': {
    id: 'bookmark-ai-arch-001',
    chatChannelId: '00000000-0000-0000-0000-000000000005',
    messageId: 'msg-ai-arch-004',
    type: 'paragraph',
    title: 'Model Selection Criteria',
    content:
      'For production: GPT-4 for complex reasoning, Claude-3 for long context, fine-tuned Llama2 for cost optimization. Implement model routing based on query complexity and user tier.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    color: 'cyan',
    tags: ['ai-models', 'selection', 'production'],
    note: 'Cost analysis needed for model routing',
  },

  // New Product - Go-to-Market Planning bookmarks
  'bookmark-gtm-001': {
    id: 'bookmark-gtm-001',
    chatChannelId: '00000000-0000-0000-0000-000000000006',
    messageId: 'msg-gtm-002',
    type: 'message',
    title: 'Pricing Strategy Framework',
    content:
      'Freemium model: Free tier (100 AI interactions/month), Pro ($19/month, unlimited), Enterprise ($49/user/month, team features). Based on competitor analysis and customer interviews.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    color: 'green',
    tags: ['pricing', 'freemium', 'strategy'],
    note: 'Validated with 15 potential customers',
  },
  'bookmark-gtm-002': {
    id: 'bookmark-gtm-002',
    chatChannelId: '00000000-0000-0000-0000-000000000006',
    messageId: 'msg-gtm-005',
    type: 'selection',
    title: 'Launch Channels Priority',
    content: 'Product Hunt → Tech Twitter → YC Network → Content marketing → Paid ads',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20), // 20 hours ago
    color: 'orange',
    tags: ['launch', 'marketing', 'channels'],
    position: {
      start: 5,
      end: 75,
      text: 'Product Hunt → Tech Twitter → YC Network → Content marketing → Paid ads',
    },
  },

  // Strategy 2026 - Executive Strategy Council bookmarks
  'bookmark-exec-001': {
    id: 'bookmark-exec-001',
    chatChannelId: '00000000-0000-0000-0000-000000000007',
    messageId: 'msg-exec-003',
    type: 'message',
    title: '2026 Revenue Targets',
    content:
      'Aggressive but achievable targets: $50M ARR by end of 2026, 500K+ active users, enterprise segment contributing 70% of revenue. Requires 10x growth from current $5M ARR baseline.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    color: 'red',
    tags: ['revenue', 'targets', '2026', 'growth'],
    note: 'Board presentation material',
  },
  'bookmark-exec-002': {
    id: 'bookmark-exec-002',
    chatChannelId: '00000000-0000-0000-0000-000000000007',
    messageId: 'msg-exec-007',
    type: 'selection',
    title: 'Strategic Priorities',
    content: 'AI-first transformation, international expansion (EU, APAC), enterprise platform development',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
    color: 'purple',
    tags: ['strategy', 'priorities', 'transformation'],
    position: {
      start: 0,
      end: 95,
      text: 'AI-first transformation, international expansion (EU, APAC), enterprise platform development',
    },
  },

  // Strategy 2026 - Market Intelligence AI bookmarks
  'bookmark-market-001': {
    id: 'bookmark-market-001',
    chatChannelId: '00000000-0000-0000-0000-000000000008',
    messageId: 'msg-market-004',
    type: 'paragraph',
    title: 'Emerging Trends Analysis',
    content:
      'Key trends shaping 2025-2026: Multimodal AI adoption accelerating, regulatory frameworks stabilizing in EU/US, consumer AI fatigue driving demand for specialized vertical solutions.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 72 hours ago
    color: 'blue',
    tags: ['trends', 'multimodal', 'regulation', 'vertical'],
    note: 'Include in quarterly board report',
  },

  // Strategy 2026 - Technology & Innovation Hub bookmarks
  'bookmark-tech-001': {
    id: 'bookmark-tech-001',
    chatChannelId: '00000000-0000-0000-0000-000000000009',
    messageId: 'msg-tech-002',
    type: 'message',
    title: 'Infrastructure Scaling Plan',
    content:
      'Current architecture supports 100K users. For 500K target: migrate to Kubernetes, implement auto-scaling, add CDN globally, upgrade to enterprise-grade AI inference infrastructure.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 96 hours ago
    color: 'green',
    tags: ['infrastructure', 'scaling', 'kubernetes'],
    note: '$2M investment needed for full implementation',
  },
  'bookmark-tech-002': {
    id: 'bookmark-tech-002',
    chatChannelId: '00000000-0000-0000-0000-000000000009',
    messageId: 'msg-tech-006',
    type: 'selection',
    title: 'Innovation Investment Areas',
    content: 'Edge AI computing, privacy-preserving ML, real-time collaboration AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60), // 60 hours ago
    color: 'cyan',
    tags: ['innovation', 'investment', 'edge-ai'],
    position: {
      start: 10,
      end: 75,
      text: 'Edge AI computing, privacy-preserving ML, real-time collaboration AI',
    },
  },

  // Strategy 2026 - Financial Planning Advisor bookmarks
  'bookmark-finance-001': {
    id: 'bookmark-finance-001',
    chatChannelId: '00000000-0000-0000-0000-000000000010',
    messageId: 'msg-finance-003',
    type: 'message',
    title: 'Series B Funding Requirements',
    content:
      'For 2026 targets, need $25M Series B by Q2 2025. Use cases: product development (40%), scaling infrastructure (30%), international expansion (20%), talent acquisition (10%).',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 120 hours ago
    color: 'yellow',
    tags: ['funding', 'series-b', 'allocation'],
    note: 'Pitch deck needed by March',
  },
}

// ============================================================================
// Chat Threads (Branching conversation points)
// ============================================================================

export interface ChatThread {
  id: string
  chatChannelId: string
  parentMessageId: string
  title: string
  description?: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    author?: string
  }>
  isExpanded?: boolean
  unreadCount?: number
  lastActivity: Date
  participants: Array<{
    id: string
    name: string
    avatar?: string
    role?: 'owner' | 'participant'
  }>
}

export const CHAT_THREADS: Record<string, ChatThread> = {
  // Next Holidays - Travel Planning threads
  'thread-travel-001': {
    id: 'thread-travel-001',
    chatChannelId: '00000000-0000-0000-0000-000000000000',
    parentMessageId: 'msg-travel-003',
    title: 'Specific Japan Itinerary Planning',
    description: 'Detailed day-by-day planning branch from cherry blossom discussion',
    messages: [
      {
        id: 'thread-msg-001',
        role: 'user',
        content: 'Can you help me plan a detailed 10-day itinerary for Tokyo and Kyoto during cherry blossom season?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        id: 'thread-msg-002',
        role: 'assistant',
        content:
          "Absolutely! Here's a detailed 10-day itinerary:\n\n**Days 1-2: Tokyo Arrival & East Side**\n- Day 1: Arrive, Asakusa Temple, Tokyo Skytree\n- Day 2: Ueno Park (famous for sakura), Tokyo National Museum\n\n**Days 3-4: Tokyo Central & West**\n- Day 3: Imperial Palace Gardens, Ginza shopping\n- Day 4: Shibuya, Harajuku, Meiji Shrine\n\n**Days 5-7: Kyoto**\n- Day 5: Travel to Kyoto, Philosopher's Path\n- Day 6: Fushimi Inari, Kiyomizu-dera\n- Day 7: Arashiyama Bamboo Grove, Golden Pavilion\n\n**Days 8-10: Tokyo Return**\n- Day 8: Return to Tokyo, Tsukiji Fish Market\n- Day 9: Day trip to Mount Fuji area\n- Day 10: Last-minute shopping, departure",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5 + 1000 * 60 * 2),
      },
    ],
    isExpanded: false,
    unreadCount: 1,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5 + 1000 * 60 * 2),
    participants: [{ id: 'user-you', name: 'You', role: 'owner' }],
  },

  'thread-budget-001': {
    id: 'thread-budget-001',
    chatChannelId: '00000000-0000-0000-0000-000000000001',
    parentMessageId: 'msg-budget-004',
    title: 'Budget Optimization Strategies',
    description: 'Ways to reduce costs while maintaining quality experience',
    messages: [
      {
        id: 'thread-budget-msg-001',
        role: 'user',
        content: 'The $360/day seems high. Are there ways to reduce costs without sacrificing the experience too much?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
      {
        id: 'thread-budget-msg-002',
        role: 'assistant',
        content:
          'Yes! Here are cost-saving strategies:\n\n**Accommodation (-$50/day):**\n- Business hotels instead of luxury: $100/day\n- Consider capsule hotels for 1-2 nights: $40/day\n\n**Food (-$30/day):**\n- Convenience store meals: $15-20/day\n- Local ramen shops vs restaurants: $8-12/meal\n\n**Activities (-$40/day):**\n- Free temples and parks vs paid attractions\n- City passes for multiple attractions\n\n**New total: $240/day saving $1,200 overall**',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6 + 1000 * 60 * 3),
      },
    ],
    isExpanded: true,
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 6 + 1000 * 60 * 3),
    participants: [{ id: 'user-you', name: 'You', role: 'owner' }],
  },

  // New Product - Technical discussion threads
  'thread-dev-001': {
    id: 'thread-dev-001',
    chatChannelId: '00000000-0000-0000-0000-000000000004',
    parentMessageId: 'msg-dev-003',
    title: 'Database Schema Design',
    description: 'Deep dive into data modeling for AI context storage',
    messages: [
      {
        id: 'thread-dev-msg-001',
        role: 'user',
        content: 'For the AI context storage, should we use a relational or document database for user conversation history?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15),
        author: 'John',
      },
      {
        id: 'thread-dev-msg-002',
        role: 'user',
        content: "I'd lean toward hybrid approach - PostgreSQL with JSONB columns for structured + unstructured data",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15 + 1000 * 60 * 5),
        author: 'Mike',
      },
      {
        id: 'thread-dev-msg-003',
        role: 'assistant',
        content:
          'Great discussion! PostgreSQL with JSONB is excellent for this use case:\n\n**Benefits:**\n- ACID compliance for user data\n- Flexible JSONB for conversation context\n- Full-text search capabilities\n- Vector similarity for AI embeddings\n\n**Schema suggestion:**\n```sql\nCREATE TABLE conversations (\n  id UUID PRIMARY KEY,\n  user_id UUID NOT NULL,\n  context JSONB,\n  embedding vector(1536),\n  created_at TIMESTAMP\n);\n```',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15 + 1000 * 60 * 8),
      },
    ],
    isExpanded: false,
    unreadCount: 2,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 15 + 1000 * 60 * 8),
    participants: [
      { id: 'user-john', name: 'John', role: 'owner' },
      { id: 'user-mike', name: 'Mike', role: 'participant' },
    ],
  },

  'thread-strategy-001': {
    id: 'thread-strategy-001',
    chatChannelId: '00000000-0000-0000-0000-000000000003',
    parentMessageId: 'msg-strategy-008',
    title: 'User Workflow Learning Implementation',
    description: 'Technical approach to context-aware AI learning',
    messages: [
      {
        id: 'thread-strategy-msg-001',
        role: 'user',
        content: 'How exactly would the AI learn user workflows? What data do we collect and how do we ensure privacy?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
        author: 'Emma',
      },
      {
        id: 'thread-strategy-msg-002',
        role: 'assistant',
        content:
          "Excellent question! Here's a privacy-first approach:\n\n**Data Collection:**\n- Task patterns (anonymized)\n- Tool usage frequency\n- Time-of-day preferences\n- Success/failure feedback\n\n**Privacy Measures:**\n- Local processing where possible\n- Encrypted data transmission\n- User-controlled data retention\n- Opt-in for each data type\n\n**Learning Approach:**\n- Federated learning to improve models\n- Personal adaptation without data sharing\n- Explicit consent for each workflow pattern",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10 + 1000 * 60 * 4),
      },
    ],
    isExpanded: true,
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 10 + 1000 * 60 * 4),
    participants: [{ id: 'user-emma', name: 'Emma', role: 'owner' }],
  },

  // Strategy 2026 - Strategic planning threads
  'thread-exec-001': {
    id: 'thread-exec-001',
    chatChannelId: '00000000-0000-0000-0000-000000000007',
    parentMessageId: 'msg-exec-003',
    title: 'International Expansion Timeline',
    description: 'Detailed planning for EU and APAC market entry',
    messages: [
      {
        id: 'thread-exec-msg-001',
        role: 'user',
        content: 'For the international expansion, should we prioritize EU or APAC first? What are the regulatory implications?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40),
        author: 'Alex',
      },
      {
        id: 'thread-exec-msg-002',
        role: 'user',
        content: 'I vote EU first - GDPR compliance gives us credibility for other markets, and timezone overlap with US is better',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40 + 1000 * 60 * 10),
        author: 'Emma',
      },
      {
        id: 'thread-exec-msg-003',
        role: 'assistant',
        content:
          'Strategic analysis supports EU-first approach:\n\n**EU Advantages:**\n- GDPR compliance = global trust signal\n- English-speaking markets (UK, Ireland)\n- Similar business practices to US\n- $2.1T AI market by 2026\n\n**Timeline Suggestion:**\n- Q3 2025: EU launch (UK, Germany, France)\n- Q1 2026: APAC (Singapore, Australia)\n- Q3 2026: Full expansion (Japan, South Korea)\n\n**Regulatory Prep:**\n- GDPR compliance audit\n- AI Act compliance planning\n- Local data residency requirements',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40 + 1000 * 60 * 15),
      },
    ],
    isExpanded: false,
    unreadCount: 1,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 40 + 1000 * 60 * 15),
    participants: [
      { id: 'user-alex', name: 'Alex', role: 'owner' },
      { id: 'user-emma', name: 'Emma', role: 'participant' },
    ],
  },

  'thread-tech-001': {
    id: 'thread-tech-001',
    chatChannelId: '00000000-0000-0000-0000-000000000009',
    parentMessageId: 'msg-tech-002',
    title: 'Kubernetes Migration Strategy',
    description: 'Detailed technical planning for infrastructure migration',
    messages: [
      {
        id: 'thread-tech-msg-001',
        role: 'user',
        content: "What's our migration strategy from current infrastructure to Kubernetes? Can we do it without downtime?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80),
        author: 'Mike',
      },
      {
        id: 'thread-tech-msg-002',
        role: 'assistant',
        content:
          'Yes, zero-downtime migration is possible with careful planning:\n\n**Phase 1: Preparation (4 weeks)**\n- Containerize existing services\n- Set up K8s cluster in parallel\n- Implement health checks and monitoring\n\n**Phase 2: Gradual Migration (6 weeks)**\n- Blue-green deployment strategy\n- Migrate non-critical services first\n- Load balancer gradual traffic shifting\n\n**Phase 3: Full Cutover (2 weeks)**\n- Database migration with replication\n- DNS cutover during low-traffic window\n- Rollback plan ready\n\n**Risk Mitigation:**\n- Comprehensive testing environment\n- 24/7 monitoring during migration\n- Automated rollback triggers',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80 + 1000 * 60 * 12),
      },
    ],
    isExpanded: true,
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 80 + 1000 * 60 * 12),
    participants: [{ id: 'user-mike', name: 'Mike', role: 'owner' }],
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

// Get bookmarks for a specific chat channel
export function getBookmarksByChatChannel(chatChannelId: string): ChatBookmark[] {
  return Object.values(CHAT_BOOKMARKS).filter((bookmark) => bookmark.chatChannelId === chatChannelId)
}

// Get all bookmarks for a specific goal (across all its chat channels)
export function getBookmarksByGoal(goalId: string): ChatBookmark[] {
  const goalChatChannels = getChatChannelsByGoal(goalId)
  const chatChannelIds = goalChatChannels.map((chat) => chat.id)
  return Object.values(CHAT_BOOKMARKS).filter((bookmark) => chatChannelIds.includes(bookmark.chatChannelId))
}

// Get threads for a specific chat channel
export function getThreadsByChatChannel(chatChannelId: string): ChatThread[] {
  return Object.values(CHAT_THREADS).filter((thread) => thread.chatChannelId === chatChannelId)
}

// Get all threads for a specific goal (across all its chat channels)
export function getThreadsByGoal(goalId: string): ChatThread[] {
  const goalChatChannels = getChatChannelsByGoal(goalId)
  const chatChannelIds = goalChatChannels.map((chat) => chat.id)
  return Object.values(CHAT_THREADS).filter((thread) => chatChannelIds.includes(thread.chatChannelId))
}

// Get thread by ID with chat channel context
export function getThreadWithContext(threadId: string) {
  const thread = CHAT_THREADS[threadId]
  if (!thread) return null

  const chatChannel = CHAT_CHANNELS[thread.chatChannelId]
  const goal = chatChannel ? GOALS[chatChannel.goalId] : null

  return {
    ...thread,
    chatChannelName: chatChannel?.name || 'Unknown Chat',
    goalName: goal?.name || 'Unknown Goal',
  }
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
