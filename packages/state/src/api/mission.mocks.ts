import { MissionMemberRole, MissionStatus } from '../../../grpc/src/entities/proto/api/v1/mission_pb'
import type { Mission, MissionMember } from './mission.types'

// Mock data that would be replaced with real gRPC calls
export const MOCK_MISSIONS: Record<string, Mission> = {
  '00000000-0000-0000-0000-000000000100': {
    id: '00000000-0000-0000-0000-000000000100',
    name: 'Next Holidays',
    description:
      'Plan and organize comprehensive holiday travel experience including destinations, accommodations, activities, and budget management',
    teamId: 'team-1',
    creatorUserId: 'user-you',
    status: MissionStatus.MISSION_STATUS_ACTIVE,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-01'),
    metadata: {
      tags: ['travel', 'personal', 'planning', 'vacation'],
      priority: 'high',
      progress: 35,
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  '00000000-0000-0000-0000-000000000101': {
    id: '00000000-0000-0000-0000-000000000101',
    name: 'New Product',
    description: 'Research, design, develop, and launch an innovative AI-powered productivity tool for knowledge workers',
    teamId: 'team-2',
    creatorUserId: 'user-john',
    status: MissionStatus.MISSION_STATUS_ACTIVE,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-06-15'),
    metadata: {
      tags: ['product', 'innovation', 'AI', 'development', 'launch'],
      priority: 'high',
      progress: 65,
    },
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date(),
  },
  '00000000-0000-0000-0000-000000000102': {
    id: '00000000-0000-0000-0000-000000000102',
    name: 'Strategy 2026',
    description:
      'Develop comprehensive 3-year strategic roadmap including market analysis, technology investments, team expansion, and revenue growth targets',
    teamId: 'team-3',
    creatorUserId: 'user-alex',
    status: MissionStatus.MISSION_STATUS_ACTIVE,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-04-30'),
    metadata: {
      tags: ['strategy', 'planning', '2026', 'roadmap', 'growth'],
      priority: 'high',
      progress: 45,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
}

export const MOCK_MISSION_MEMBERS: Record<string, MissionMember[]> = {
  '00000000-0000-0000-0000-000000000100': [
    {
      userId: 'user-you',
      missionId: '00000000-0000-0000-0000-000000000100',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_OWNER,
      joinedAt: new Date('2024-01-15'),
    },
    {
      userId: 'user-sarah',
      missionId: '00000000-0000-0000-0000-000000000100',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_MEMBER,
      joinedAt: new Date('2024-01-16'),
    },
  ],
  '00000000-0000-0000-0000-000000000101': [
    {
      userId: 'user-john',
      missionId: '00000000-0000-0000-0000-000000000101',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_OWNER,
      joinedAt: new Date('2023-12-01'),
    },
    {
      userId: 'user-sarah',
      missionId: '00000000-0000-0000-0000-000000000101',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_ADMIN,
      joinedAt: new Date('2023-12-01'),
    },
    {
      userId: 'user-mike',
      missionId: '00000000-0000-0000-0000-000000000101',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_MEMBER,
      joinedAt: new Date('2023-12-01'),
    },
    {
      userId: 'user-emma',
      missionId: '00000000-0000-0000-0000-000000000101',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_MEMBER,
      joinedAt: new Date('2023-12-01'),
    },
    {
      userId: 'user-alex',
      missionId: '00000000-0000-0000-0000-000000000101',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_ADMIN,
      joinedAt: new Date('2023-12-01'),
    },
  ],
  '00000000-0000-0000-0000-000000000102': [
    {
      userId: 'user-alex',
      missionId: '00000000-0000-0000-0000-000000000102',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_OWNER,
      joinedAt: new Date('2024-01-01'),
    },
    {
      userId: 'user-mike',
      missionId: '00000000-0000-0000-0000-000000000102',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_MEMBER,
      joinedAt: new Date('2024-01-01'),
    },
    {
      userId: 'user-emma',
      missionId: '00000000-0000-0000-0000-000000000102',
      role: MissionMemberRole.MISSION_MEMBER_ROLE_MEMBER,
      joinedAt: new Date('2024-01-01'),
    },
  ],
}

// Mock users for reference
export const MOCK_USERS: Record<string, { id: string; name: string; email: string }> = {
  'user-you': { id: 'user-you', name: 'You', email: 'you@example.com' },
  'user-john': { id: 'user-john', name: 'John Doe', email: 'john@example.com' },
  'user-sarah': { id: 'user-sarah', name: 'Sarah Smith', email: 'sarah@example.com' },
  'user-mike': { id: 'user-mike', name: 'Mike Johnson', email: 'mike@example.com' },
  'user-emma': { id: 'user-emma', name: 'Emma Wilson', email: 'emma@example.com' },
  'user-alex': { id: 'user-alex', name: 'Alex Brown', email: 'alex@example.com' },
}
