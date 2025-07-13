// Re-export types from mock data for convenience

// TODO: These stores need zustand dependency - temporarily disabled for build compatibility
// export { useActivitiesStore } from './activities-store'
// export { useChatChannelsStore } from './chat-channels-store'
// export { useComposedStore } from './composed-stores'
// export { useGoalsStore } from './goals-store'
// export { useNavigationStore } from './navigation-store'
// export { useObjectivesStore } from './objectives-store'
// export { useParticipantsStore } from './participants-store'
// export { useTemplatesStore } from './templates-store'

export type {
  Activity,
  ChatChannel,
  ChatChannelDetail,
  Goal,
  GoalDetail,
  Objective,
  ObjectiveDetail,
  Participant,
} from './prio-mock-data'
