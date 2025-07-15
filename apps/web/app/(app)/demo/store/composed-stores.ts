import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useChatChannelsStore } from './chat-channels-store'
import { useMissionsStore } from './missions-store'
import { useObjectivesStore } from './objectives-store'
import { useParticipantsStore } from './participants-store'
import type { ChatChannelDetail, MissionDetail, ObjectiveDetail } from './prio-mock-data'

interface ComposedState {
  getMissionDetail: (missionId: string) => MissionDetail | null
  getObjectiveDetail: (objectiveId: string) => ObjectiveDetail | null
  getChatChannelDetail: (channelId: string) => ChatChannelDetail | null
  getAllMissionsWithDetails: () => MissionDetail[]
  getAllChatsWithDetails: () => ChatChannelDetail[]
  formatRelativeTime: (date: Date) => string
}

export const useComposedStore = create<ComposedState>()(
  devtools(
    () => ({
      formatRelativeTime: (date: Date): string => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMins < 1) return 'just now'
        if (diffMins < 60) return `${diffMins} min ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      },

      getMissionDetail: (missionId: string): MissionDetail | null => {
        const mission = useMissionsStore.getState().getMission(missionId)
        if (!mission) return null

        const objectives = useObjectivesStore.getState().getObjectivesByMission(missionId)
        const chats = useChatChannelsStore.getState().getChatChannelsByMission(missionId)
        const participants = useParticipantsStore.getState().getParticipantsByIds(mission.participantIds)
        const completedObjectives = objectives.filter((obj) => obj.status === 'completed').length

        return {
          ...mission,
          missionName: mission.name,
          participants: participants.map((p) => ({
            id: p.id,
            name: p.name,
            role: p.role,
          })),
          objectives,
          chats,
          chatChannels: chats,
          completedObjectives,
          objectiveCount: objectives.length,
        }
      },

      getObjectiveDetail: (objectiveId: string): ObjectiveDetail | null => {
        const objective = useObjectivesStore.getState().getObjective(objectiveId)
        if (!objective) return null

        const mission = useMissionsStore.getState().getMission(objective.missionId)
        const assignee = useParticipantsStore.getState().getParticipant(objective.assigneeId)

        const mockSubtasks = [
          {
            id: `${objectiveId}-1`,
            text: 'Define requirements and scope',
            title: 'Requirements Definition',
            completed: true,
            assigneeId: objective.assigneeId,
          },
          {
            id: `${objectiveId}-2`,
            text: 'Research and analysis phase',
            title: 'Research Phase',
            completed: true,
            assigneeId: objective.assigneeId,
          },
          {
            id: `${objectiveId}-3`,
            text: 'Design and planning',
            title: 'Design Planning',
            completed: false,
            assigneeId: objective.assigneeId,
          },
          {
            id: `${objectiveId}-4`,
            text: 'Implementation and testing',
            title: 'Implementation',
            completed: false,
            assigneeId: objective.assigneeId,
          },
          {
            id: `${objectiveId}-5`,
            text: 'Review and documentation',
            title: 'Documentation',
            completed: false,
            assigneeId: objective.assigneeId,
          },
        ]

        const mockDocuments = [
          {
            id: `${objectiveId}-doc-1`,
            name: 'requirements.pdf',
            title: 'Requirements Document',
            description: 'Detailed requirements and specifications for the objective',
            type: 'PDF',
            url: '/documents/requirements.pdf',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          },
          {
            id: `${objectiveId}-doc-2`,
            name: 'design-specs.docx',
            title: 'Design Specifications',
            description: 'Technical design documents and architecture plans',
            type: 'DOCX',
            url: '/documents/design-specs.docx',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
          {
            id: `${objectiveId}-doc-3`,
            name: 'test-results.xlsx',
            title: 'Test Results',
            description: 'Comprehensive testing results and metrics',
            type: 'XLSX',
            url: '/documents/test-results.xlsx',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
            lastModified: new Date(Date.now() - 1000 * 60 * 60 * 6),
          },
        ]

        const mockComments = [
          {
            id: `${objectiveId}-comment-1`,
            author: 'Team Lead',
            content: 'Great progress on this objective! The implementation is looking solid.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          },
          {
            id: `${objectiveId}-comment-2`,
            author: 'Project Manager',
            content: 'Please update the timeline estimates in the next standup.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
          },
          {
            id: `${objectiveId}-comment-3`,
            author: assignee?.name || 'Team Member',
            content: 'Working on the final testing phase. Should be complete by end of week.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
          },
        ]

        return {
          ...objective,
          missionName: mission?.name || 'Unknown Mission',
          assigneeName: assignee?.name || 'Unknown',
          subtasks: mockSubtasks,
          documents: mockDocuments,
          comments: mockComments,
        }
      },

      getChatChannelDetail: (channelId: string): ChatChannelDetail | null => {
        const chat = useChatChannelsStore.getState().getChatChannel(channelId)
        if (!chat) return null

        const mission = useMissionsStore.getState().getMission(chat.missionId)
        const participants = useParticipantsStore.getState().getParticipantsByIds(chat.participantIds)
        const formatTime = useComposedStore.getState().formatRelativeTime

        const mockMessages = [
          'Let me help you with that code review.',
          'The data analysis is complete. Here are the insights...',
          'Team standup scheduled for 10 AM tomorrow.',
          'I found a potential optimization in the codebase.',
          'Documentation has been updated successfully.',
          'Strategy document draft is ready for review.',
        ]

        return {
          ...chat,
          missionName: mission?.name || 'Unknown Mission',
          lastMessageTime: formatTime(chat.lastActivity),
          unreadCount: Math.floor(Math.random() * 5),
          participants: participants.map((p) => ({ id: p.id, name: p.name })),
          messageCount: Math.floor(Math.random() * 100) + 10,
          lastMessage: mockMessages[Math.floor(Math.random() * mockMessages.length)],
        }
      },

      getAllMissionsWithDetails: (): MissionDetail[] => {
        const missions = useMissionsStore.getState().missions
        const getMissionDetail = useComposedStore.getState().getMissionDetail

        return Object.values(missions)
          .map((mission) => getMissionDetail(mission.id))
          .filter((detail): detail is MissionDetail => detail !== null)
      },

      getAllChatsWithDetails: (): ChatChannelDetail[] => {
        const chats = useChatChannelsStore.getState().chatChannels
        const getChatChannelDetail = useComposedStore.getState().getChatChannelDetail

        return Object.values(chats)
          .map((chat) => getChatChannelDetail(chat.id))
          .filter((detail): detail is ChatChannelDetail => detail !== null)
      },
    }),
    {
      name: 'composed-store',
    }
  )
)
