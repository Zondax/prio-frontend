import type { Participant } from './participant.types'

// Mock data that would be replaced with real gRPC calls
export const MOCK_PARTICIPANTS: Record<string, Participant> = {
  'user-you': {
    id: 'user-you',
    name: 'You',
    email: 'user@example.com',
    role: 'Individual Contributor',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  'user-john': {
    id: 'user-john',
    name: 'John',
    email: 'john@example.com',
    role: 'Frontend Developer',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date(),
  },
  'user-sarah': {
    id: 'user-sarah',
    name: 'Sarah',
    email: 'sarah@example.com',
    role: 'Senior Frontend Developer',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date(),
  },
  'user-mike': {
    id: 'user-mike',
    name: 'Mike',
    email: 'mike@example.com',
    role: 'Backend Developer',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date(),
  },
  'user-emma': {
    id: 'user-emma',
    name: 'Emma',
    email: 'emma@example.com',
    role: 'Full Stack Developer',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
  },
  'user-alex': {
    id: 'user-alex',
    name: 'Alex',
    email: 'alex@example.com',
    role: 'Project Manager',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date(),
  },
}
