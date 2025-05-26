import type { GrpcConfig, Metadata } from '@prio-grpc'
import { AgentServiceClient } from '@prio-grpc/entities/proto/api/v1/AgentServiceClientPb'
import { QueryRequest } from '@prio-grpc/entities/proto/api/v1/agent_pb'

export type AgentInput = {
  message: string
  sessionId?: string
}

export type AgentResponse = {
  result: string
  sessionId: string
}

export type AgentClient = AgentServiceClient

export const createAgentClient = (cp: GrpcConfig): AgentClient => {
  return new AgentServiceClient(cp.baseUrl, cp.metadata as Metadata)
}

export const sendMessage = async (client: AgentClient, clientParams: GrpcConfig, data: AgentInput): Promise<AgentResponse> => {
  const request = new QueryRequest()

  request.setQuery(data.message)
  if (data.sessionId) {
    request.setSessionId(data.sessionId)
  }

  const response = await client.processQuery(request, clientParams.metadata as Metadata)

  return {
    result: response.getResponse(),
    sessionId: response.getSessionId(),
  }
}
