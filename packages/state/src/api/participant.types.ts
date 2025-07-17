// Types for individual participant operations
export interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface GetParticipantRequest {
  participantId: string
}

export interface UpdateParticipantRequest {
  participantId: string
  name?: string
  email?: string
  avatar?: string
  role?: string
}

export interface DeleteParticipantRequest {
  participantId: string
}

export interface StandardResponse {
  success: boolean
  message: string
}
