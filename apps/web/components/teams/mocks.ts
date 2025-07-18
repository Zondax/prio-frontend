// import type { Team, TeamManagementOperations, TeamMember, TeamRole } from '@zondax/ui-common/client'

// Temporary type definitions until they are available in @zondax/ui-common
type TeamRole = 'owner' | 'admin' | 'member' | 'viewer'

interface Team {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  currentUserRole: TeamRole
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  status: 'active' | 'invited' | 'requesting'
  joinedAt: Date
}

interface TeamManagementOperations {
  getTeams: () => Promise<Team[]>
  createTeam: (teamData: { name: string; description?: string }) => Promise<Team>
  updateTeam: (teamId: string, teamData: { name?: string; description?: string }) => Promise<Team>
  deleteTeam: (teamId: string) => Promise<void>
  selectTeam: (teamId: string) => Promise<void>
  getCurrentTeam: () => Promise<Team | null>
  inviteMember: (teamId: string, email: string, role: TeamRole) => Promise<void>
  removeMember: (teamId: string, memberId: string) => Promise<void>
  cancelInvitation: (teamId: string, memberId: string) => Promise<void>
  changeRole: (teamId: string, memberId: string, newRole: TeamRole) => Promise<void>
  getMembers: (teamId: string) => Promise<TeamMember[]>
  getCurrentUser: () => Promise<{ id: string; role: TeamRole }>
}

export const createMockTeamOperations = (): TeamManagementOperations => {
  // Mock teams data
  const mockTeams: Team[] = [
    {
      id: 'personal',
      name: 'Personal',
      description: 'Your personal workspace',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-07-15'),
      currentUserRole: 'owner',
    },
    {
      id: 'team-1',
      name: 'Engineering',
      description: 'Main engineering team',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-07-15'),
      currentUserRole: 'owner',
    },
    {
      id: 'team-2',
      name: 'Marketing',
      description: 'Marketing and growth team',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-07-10'),
      currentUserRole: 'admin',
    },
    {
      id: 'team-3',
      name: 'Design',
      description: 'UI/UX design team',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-07-05'),
      currentUserRole: 'member',
    },
  ]

  // Mock members data by team
  const mockMembersByTeam: Record<string, TeamMember[]> = {
    personal: [
      {
        id: 'current-user',
        name: 'You',
        email: 'you@example.com',
        role: 'owner',
        status: 'active',
        joinedAt: new Date('2024-01-01'),
      },
    ],
    'team-1': [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        status: 'active',
        joinedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: new Date('2024-02-01'),
      },
      {
        id: '3',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'member',
        status: 'invited',
        joinedAt: new Date('2024-02-15'),
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'member',
        status: 'requesting',
        joinedAt: new Date('2024-07-10'),
      },
    ],
    'team-2': [
      {
        id: '5',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: new Date('2024-03-01'),
      },
      {
        id: '6',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'member',
        status: 'active',
        joinedAt: new Date('2024-03-15'),
      },
      {
        id: '7',
        name: 'Mike Davis',
        email: 'mike@example.com',
        role: 'viewer',
        status: 'requesting',
        joinedAt: new Date('2024-07-12'),
      },
    ],
    'team-3': [
      {
        id: '8',
        name: 'Diana Prince',
        email: 'diana@example.com',
        role: 'admin',
        status: 'active',
        joinedAt: new Date('2024-04-01'),
      },
    ],
  }

  let currentTeam: Team | null = null

  return {
    // Team CRUD operations
    getTeams: async () => {
      console.log('Getting teams')
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTeams
    },

    createTeam: async (teamData: { name: string; description?: string }) => {
      console.log('Creating team:', teamData)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamData.name,
        description: teamData.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        currentUserRole: 'owner',
      }

      mockTeams.push(newTeam)
      mockMembersByTeam[newTeam.id] = []

      return newTeam
    },

    updateTeam: async (teamId: string, teamData: { name?: string; description?: string }) => {
      console.log('Updating team:', teamId, teamData)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const teamIndex = mockTeams.findIndex((t) => t.id === teamId)
      if (teamIndex === -1) {
        throw new Error('Team not found')
      }

      const updatedTeam = {
        ...mockTeams[teamIndex],
        ...teamData,
        updatedAt: new Date(),
      }

      mockTeams[teamIndex] = updatedTeam
      return updatedTeam
    },

    deleteTeam: async (teamId: string) => {
      console.log('Deleting team:', teamId)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const teamIndex = mockTeams.findIndex((t) => t.id === teamId)
      if (teamIndex === -1) {
        throw new Error('Team not found')
      }

      mockTeams.splice(teamIndex, 1)
      delete mockMembersByTeam[teamId]
    },

    // Team context operations
    selectTeam: async (teamId: string) => {
      console.log('Selecting team:', teamId)
      const team = mockTeams.find((t) => t.id === teamId)
      if (!team) {
        throw new Error('Team not found')
      }
      currentTeam = team
    },

    getCurrentTeam: async () => {
      console.log('Getting current team')
      return currentTeam
    },

    // Member operations
    inviteMember: async (teamId: string, email: string, role: TeamRole) => {
      console.log('Inviting member to team:', teamId, email, role)

      // Prevent adding members to Personal team
      if (teamId === 'personal') {
        throw new Error('Cannot add members to Personal workspace')
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        status: 'invited',
        joinedAt: new Date(),
      }

      if (!mockMembersByTeam[teamId]) {
        mockMembersByTeam[teamId] = []
      }

      mockMembersByTeam[teamId].push(newMember)
    },

    removeMember: async (teamId: string, memberId: string) => {
      console.log('Removing member from team:', teamId, memberId)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mockMembersByTeam[teamId]) {
        mockMembersByTeam[teamId] = mockMembersByTeam[teamId].filter((m) => m.id !== memberId)
      }
    },

    cancelInvitation: async (teamId: string, memberId: string) => {
      console.log('Canceling invitation for team:', teamId, memberId)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mockMembersByTeam[teamId]) {
        mockMembersByTeam[teamId] = mockMembersByTeam[teamId].filter((m) => m.id !== memberId)
      }
    },

    changeRole: async (teamId: string, memberId: string, newRole: TeamRole) => {
      console.log('Changing role for team:', teamId, memberId, newRole)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mockMembersByTeam[teamId]) {
        const member = mockMembersByTeam[teamId].find((m) => m.id === memberId)
        if (member) {
          member.role = newRole
        }
      }
    },

    getMembers: async (teamId: string) => {
      console.log('Getting members for team:', teamId)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockMembersByTeam[teamId] || []
    },

    // User operations
    getCurrentUser: async () => {
      console.log('Getting current user')
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200))
      return { id: '1', role: 'owner' as TeamRole }
    },
  }
}
