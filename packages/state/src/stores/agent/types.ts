import type { GrpcConfig } from '@prio-grpc'

import type { AgentInput, AgentResponse } from '../../api/agent'

// Define message types
export interface AgentMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  type?: 'text' | 'markdown' | 'code'
  timestamp: Date
}

// Define chat session types
export interface ChatSession {
  id: string
  name: string
  date: string
  selected?: boolean
  messages?: AgentMessage[]
}

// Re-export API types for convenience
export type { GrpcConfig as ApiConfig, AgentInput, AgentResponse }
