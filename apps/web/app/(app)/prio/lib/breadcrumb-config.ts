import { Home } from 'lucide-react'
import { GOALS, getChatInfo, getObjectiveDetail } from '../store/prio-mock-data'
import type { BreadcrumbRoute } from './breadcrumb-types'

// Route configuration for Prio application
export const prioRouteConfig: BreadcrumbRoute = {
  basePath: '/prio',
  segments: [
    {
      segment: 'goals',
      label: 'Goals',
      resolver: (id: string) => {
        const goal = GOALS[id]
        return goal ? { label: goal.name, href: `/prio/goals/${id}` } : null
      },
    },
    {
      segment: 'objectives',
      label: 'Objectives',
      resolver: (id: string) => {
        const objective = getObjectiveDetail(id)
        return objective ? { label: objective.title, href: `/prio/objectives/${id}` } : null
      },
      parentResolver: (id: string) => {
        const objective = getObjectiveDetail(id)
        return objective ? { label: objective.goalName, href: `/prio/goals/${objective.goalId}` } : null
      },
    },
    {
      segment: 'chats',
      label: 'Chats',
      resolver: (id: string) => {
        const chat = getChatInfo(id)
        return chat ? { label: chat.name, href: `/prio/chats/${id}` } : null
      },
      parentResolver: (id: string) => {
        const chat = getChatInfo(id)
        return chat ? { label: chat.goalName, href: `/prio/goals/${chat.goalId}` } : null
      },
    },
    {
      segment: 'documents',
      label: 'Documents',
    },
  ],
}

// Home breadcrumb item
export const HOME_BREADCRUMB = {
  label: 'Home',
  href: '/prio',
  icon: Home,
}
