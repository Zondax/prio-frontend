// Re-export types from mock data for convenience

// Zustand stores for state management
export { useActivitiesStore } from './activities-store'
export { useChatChannelsStore } from './chat-channels-store'
export { useComposedStore } from './composed-stores'
export { useMissionsStore } from './missions-store'
export { useNavigationStore } from './navigation-store'
export { useObjectivesStore } from './objectives-store'
export { useParticipantsStore } from './participants-store'
export type {
  Activity,
  ChatChannel,
  ChatChannelDetail,
  Mission,
  MissionDetail,
  Objective,
  ObjectiveDetail,
  Participant,
} from './prio-mock-data'
export { useTemplatesStore } from './templates-store'
