import { MOCK_TEAM_MEMBERS, MOCK_TEAMS } from './team.mocks'
import type { SearchMembersResponse, SearchTeamsResponse } from './team-list.types'

// Mock search teams response
export const MOCK_SEARCH_TEAMS_RESPONSE: SearchTeamsResponse = {
  teams: Object.values(MOCK_TEAMS),
  pageResponse: {
    nextPageToken: '',
    totalItems: Object.keys(MOCK_TEAMS).length,
  },
}

// Mock search members responses for each team
export const MOCK_SEARCH_MEMBERS_RESPONSES: Record<string, SearchMembersResponse> = {
  'team-1': {
    members: MOCK_TEAM_MEMBERS['team-1'] || [],
    pageResponse: {
      nextPageToken: '',
      totalItems: MOCK_TEAM_MEMBERS['team-1']?.length || 0,
    },
  },
  'team-2': {
    members: MOCK_TEAM_MEMBERS['team-2'] || [],
    pageResponse: {
      nextPageToken: '',
      totalItems: MOCK_TEAM_MEMBERS['team-2']?.length || 0,
    },
  },
  'team-3': {
    members: MOCK_TEAM_MEMBERS['team-3'] || [],
    pageResponse: {
      nextPageToken: '',
      totalItems: MOCK_TEAM_MEMBERS['team-3']?.length || 0,
    },
  },
}

// Helper to generate paginated team responses
export const generatePaginatedTeamsResponse = (pageSize = 10, pageToken = ''): SearchTeamsResponse => {
  const allTeams = Object.values(MOCK_TEAMS)
  const startIndex = pageToken ? Number.parseInt(pageToken, 10) : 0
  const endIndex = startIndex + pageSize
  const hasMore = endIndex < allTeams.length

  return {
    teams: allTeams.slice(startIndex, endIndex),
    pageResponse: {
      nextPageToken: hasMore ? endIndex.toString() : '',
      totalItems: allTeams.length,
    },
  }
}

// Helper to filter teams by query
export const filterTeamsByQuery = (query: string): SearchTeamsResponse => {
  const lowerQuery = query.toLowerCase()
  const filteredTeams = Object.values(MOCK_TEAMS).filter(
    (team) =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.description.toLowerCase().includes(lowerQuery) ||
      team.type.toLowerCase().includes(lowerQuery)
  )

  return {
    teams: filteredTeams,
    pageResponse: {
      nextPageToken: '',
      totalItems: filteredTeams.length,
    },
  }
}
