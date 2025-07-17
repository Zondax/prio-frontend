// Types for individual objective operations
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

export interface GetObjectiveRequest {
  objectiveId: string
}

export interface UpdateObjectiveRequest {
  objectiveId: string
  title?: string
  description?: string
  status?: 'active' | 'in-progress' | 'completed' | 'pending'
  priority?: 'high' | 'medium' | 'low'
  progress?: number
  assigneeId?: string
  dueDate?: Date | null
  estimatedHours?: number | null
  actualHours?: number
  tags?: string[]
}

export interface DeleteObjectiveRequest {
  objectiveId: string
}

export interface StandardResponse {
  success: boolean
  message: string
}
