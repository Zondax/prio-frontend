'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge, Input, VirtualizedTable } from '@zondax/ui-common/client'
import { Search, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { GoalDetail } from '@/app/(app)/prio/store/prio-mock-data'

interface TeamMembersTabProps {
  allGoals: GoalDetail[]
}

export default function TeamMembersTab({ allGoals }: TeamMembersTabProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Get all team members across all goals
  const allTeamMembers = useMemo(() => {
    const memberMap = new Map()
    allGoals.forEach((goal) => {
      goal.participants.forEach((participant) => {
        const key = participant.id
        if (!memberMap.has(key)) {
          memberMap.set(key, {
            ...participant,
            goalCount: 1,
            goals: [{ id: goal.id, name: goal.name, status: goal.status }],
          })
        } else {
          const existing = memberMap.get(key)
          existing.goalCount += 1
          existing.goals.push({ id: goal.id, name: goal.name, status: goal.status })
        }
      })
    })
    return Array.from(memberMap.values())
  }, [allGoals])

  // Filter team members based on search
  const filteredTeamMembers = useMemo(() => {
    if (!searchQuery) return allTeamMembers

    const query = searchQuery.toLowerCase()
    return allTeamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.goals.some((goal: { name: string }) => goal.name.toLowerCase().includes(query)) ||
        member.role?.toLowerCase().includes(query)
    )
  }, [searchQuery, allTeamMembers])

  // Define columns for team members table
  const teamColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'name',
        header: 'Team Member',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{row.original.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-xs text-muted-foreground">{row.original.role || 'Team Member'}</div>
            </div>
          </div>
        ),
        size: 200,
        minSize: 180,
        maxSize: 250,
      },
      {
        id: 'goalCount',
        header: 'Goals',
        accessorKey: 'goalCount',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">{row.original.goalCount}</span>
          </div>
        ),
        size: 80,
        minSize: 60,
        maxSize: 100,
      },
      {
        id: 'activeGoals',
        header: 'Active',
        accessorKey: 'goals',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.goals.filter((g: { status: string }) => g.status === 'active').length}</span>
        ),
        size: 80,
        minSize: 60,
        maxSize: 100,
      },
      {
        id: 'goals',
        header: 'Goal List',
        accessorKey: 'goals',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.goals.slice(0, 2).map((goal: { id: string; name: string }, _index: number) => (
              <Badge key={goal.id} variant="secondary" className="text-xs">
                {goal.name}
              </Badge>
            ))}
            {row.original.goals.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{row.original.goals.length - 2}
              </Badge>
            )}
          </div>
        ),
        size: 200,
        minSize: 180,
        maxSize: 250,
      },
    ],
    []
  )

  const stats = useMemo(() => {
    return {
      total: filteredTeamMembers.length,
      activeMembers: filteredTeamMembers.filter((member) => member.goals.some((g) => g.status === 'active')).length,
      avgGoalsPerMember: Math.round(
        filteredTeamMembers.reduce((sum, member) => sum + member.goalCount, 0) / filteredTeamMembers.length || 0
      ),
      teamGoals: allGoals.filter((g) => g.type === 'team').length,
    }
  }, [filteredTeamMembers, allGoals])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search team members or goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Team Members</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeMembers}</div>
          <div className="text-sm text-muted-foreground">Active Members</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.avgGoalsPerMember}</div>
          <div className="text-sm text-muted-foreground">Avg Goals/Member</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.teamGoals}</div>
          <div className="text-sm text-muted-foreground">Team Goals</div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="h-[600px] border rounded-lg flex flex-col">
        <VirtualizedTable
          data={filteredTeamMembers}
          columns={teamColumns as ColumnDef<any>[]}
          onRowClick={(row) => {
            // Navigate to first active goal for this member
            const activeGoal = row.original.goals.find((g) => g.status === 'active')
            if (activeGoal) {
              router.push(`/prio/goals/${activeGoal.id}`)
            }
          }}
          enableSorting
          enableColumnResizing
          emptyContent="No team members found."
        />
      </div>
    </div>
  )
}
