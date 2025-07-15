import type { BreadcrumbDataItem } from '@zondax/ui-common/client'
import { Home } from 'lucide-react'
import { getChatInfo, getObjectiveDetail, MISSIONS } from '../store/prio-mock-data'
import type { BreadcrumbRoute } from './breadcrumb-types'

// Route configuration for Prio application
export const prioRouteConfig: BreadcrumbRoute = {
  basePath: '/prio',
  segments: [
    {
      segment: 'missions',
      label: 'Missions',
      resolver: (id: string) => {
        const mission = MISSIONS[id]
        return mission ? { label: mission.name, href: `/prio/missions/${id}` } : null
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
        return objective ? { label: objective.missionName, href: `/prio/missions/${objective.missionId}` } : null
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
        return chat ? { label: chat.missionName, href: `/prio/missions/${chat.missionId}` } : null
      },
    },
    {
      segment: 'documents',
      label: 'Documents',
    },
  ],
}

// Home breadcrumb item
export const HOME_BREADCRUMB: BreadcrumbDataItem = {
  label: 'Home',
  href: '/prio',
  icon: Home,
}
