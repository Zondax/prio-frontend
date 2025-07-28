import { TeamRole } from '../../../grpc/src/entities/proto/api/v1/team_pb'
import type { Team, TeamMember } from './team.types'

// Mock teams data
export const MOCK_TEAMS: Record<string, Team> = {
  'team-1': {
    id: 'team-1',
    name: 'Engineering Team',
    image: 'https://example.com/team1.png',
    creatorUserId: 'user-1',
    type: 'engineering',
    description: 'Core engineering team responsible for product development',
    plan: 'enterprise',
    metadata: {
      department: 'Technology',
      size: 'large',
      location: 'San Francisco',
    },
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-20T15:30:00Z'),
  },
  'team-2': {
    id: 'team-2',
    name: 'Product Team',
    image: 'https://example.com/team2.png',
    creatorUserId: 'user-2',
    type: 'product',
    description: 'Product management and design team',
    plan: 'professional',
    metadata: {
      department: 'Product',
      size: 'medium',
      location: 'New York',
    },
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-18T14:20:00Z'),
  },
  'team-3': {
    id: 'team-3',
    name: 'Marketing Team',
    image: 'https://example.com/team3.png',
    creatorUserId: 'user-3',
    type: 'marketing',
    description: 'Growth and marketing team',
    plan: 'professional',
    metadata: {
      department: 'Marketing',
      size: 'small',
      location: 'Remote',
    },
    createdAt: new Date('2024-01-05T08:00:00Z'),
    updatedAt: new Date('2024-01-12T16:45:00Z'),
  },
}

// Mock team members data
export const MOCK_TEAM_MEMBERS: Record<string, TeamMember[]> = {
  'team-1': [
    {
      userId: 'user-1',
      teamId: 'team-1',
      role: TeamRole.TEAM_ROLE_OWNER,
      createdAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
      userId: 'user-4',
      teamId: 'team-1',
      role: TeamRole.TEAM_ROLE_ADMIN,
      createdAt: new Date('2024-01-16T11:00:00Z'),
    },
    {
      userId: 'user-5',
      teamId: 'team-1',
      role: TeamRole.TEAM_ROLE_MEMBER,
      createdAt: new Date('2024-01-17T12:00:00Z'),
    },
    {
      userId: 'user-6',
      teamId: 'team-1',
      role: TeamRole.TEAM_ROLE_MEMBER,
      createdAt: new Date('2024-01-18T13:00:00Z'),
    },
  ],
  'team-2': [
    {
      userId: 'user-2',
      teamId: 'team-2',
      role: TeamRole.TEAM_ROLE_OWNER,
      createdAt: new Date('2024-01-10T09:00:00Z'),
    },
    {
      userId: 'user-7',
      teamId: 'team-2',
      role: TeamRole.TEAM_ROLE_ADMIN,
      createdAt: new Date('2024-01-11T10:00:00Z'),
    },
    {
      userId: 'user-8',
      teamId: 'team-2',
      role: TeamRole.TEAM_ROLE_MEMBER,
      createdAt: new Date('2024-01-12T11:00:00Z'),
    },
  ],
  'team-3': [
    {
      userId: 'user-3',
      teamId: 'team-3',
      role: TeamRole.TEAM_ROLE_OWNER,
      createdAt: new Date('2024-01-05T08:00:00Z'),
    },
    {
      userId: 'user-9',
      teamId: 'team-3',
      role: TeamRole.TEAM_ROLE_MEMBER,
      createdAt: new Date('2024-01-06T09:00:00Z'),
    },
  ],
}

// Mock users data for team member references
export const MOCK_USERS: Record<string, { id: string; name: string; email: string; avatar?: string }> = {
  'user-1': { id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: 'https://example.com/avatar1.png' },
  'user-2': { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://example.com/avatar2.png' },
  'user-3': { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://example.com/avatar3.png' },
  'user-4': { id: 'user-4', name: 'Alice Brown', email: 'alice@example.com', avatar: 'https://example.com/avatar4.png' },
  'user-5': { id: 'user-5', name: 'Charlie Davis', email: 'charlie@example.com', avatar: 'https://example.com/avatar5.png' },
  'user-6': { id: 'user-6', name: 'Eve Wilson', email: 'eve@example.com', avatar: 'https://example.com/avatar6.png' },
  'user-7': { id: 'user-7', name: 'Frank Miller', email: 'frank@example.com', avatar: 'https://example.com/avatar7.png' },
  'user-8': { id: 'user-8', name: 'Grace Lee', email: 'grace@example.com', avatar: 'https://example.com/avatar8.png' },
  'user-9': { id: 'user-9', name: 'Henry Chen', email: 'henry@example.com', avatar: 'https://example.com/avatar9.png' },
}
