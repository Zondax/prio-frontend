// Types that would match gRPC protobuf definitions for missions
export interface Mission {
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
  organizationId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Objective {
  id: string
  title: string
  description: string
  status: 'active' | 'in-progress' | 'completed' | 'pending'
  priority: 'high' | 'medium' | 'low'
  progress: number
  assigneeId: string
  missionId: string
  dueDate: Date | null
  startDate: Date
  estimatedHours: number | null
  actualHours: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  userId: string
  missionId: string
  role: string
  joinedAt: Date
}

export interface MissionDetails {
  mission: Mission
  objectives: Objective[]
  teamMembers: TeamMember[]
  chatChannels: Array<{
    id: string
    name: string
    type: string
    lastActivity: Date
  }>
  stats: {
    totalObjectives: number
    completedObjectives: number
    totalHours: number
    completedHours: number
  }
}

export interface GetMissionDetailsRequest {
  missionId: string
}

export interface UpdateMissionRequest {
  missionId: string
  name?: string
  description?: string
  status?: 'active' | 'planning' | 'completed'
  progress?: number
  targetDate?: Date | null
  priority?: 'high' | 'medium' | 'low'
  tags?: string[]
}

export interface AddObjectiveRequest {
  missionId: string
  title: string
  description?: string
  assigneeId?: string
  dueDate?: Date | null
  priority?: 'high' | 'medium' | 'low'
  estimatedHours?: number
  tags?: string[]
}

export interface UpdateObjectiveRequest {
  objectiveId: string
  title?: string
  description?: string
  status?: 'active' | 'in-progress' | 'completed' | 'pending'
  assigneeId?: string
  dueDate?: Date | null
  priority?: 'high' | 'medium' | 'low'
  progress?: number
  estimatedHours?: number
  actualHours?: number
  tags?: string[]
}

export interface DeleteObjectiveRequest {
  objectiveId: string
}

export interface AddTeamMemberRequest {
  missionId: string
  userId: string
  role?: string
}

export interface RemoveTeamMemberRequest {
  missionId: string
  userId: string
}

export interface StandardResponse {
  success: boolean
  message: string
}
