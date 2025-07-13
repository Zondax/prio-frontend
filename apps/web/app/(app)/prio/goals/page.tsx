'use client'

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@zondax/ui-common/client'
import { Plus, Target, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { getGoalsWithDetails } from '@/app/(app)/prio/store/prio-mock-data'
import GoalsTab from './tab-goals'
import ObjectivesTab from './tab-objectives'
import TeamMembersTab from './tab-team-members'

export default function AllGoalsPage() {
  const router = useRouter()

  // Get all goals with details
  const allGoals = useMemo(() => getGoalsWithDetails(), [])

  // Get all objectives across all goals
  const allObjectives = useMemo(() => {
    return allGoals.flatMap((goal) =>
      goal.objectives.map((obj) => ({
        ...obj,
        goalName: goal.name,
        goalId: goal.id,
        goalStatus: goal.status,
        goalPriority: goal.priority,
      }))
    )
  }, [allGoals])

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

  const handleCreateGoal = useCallback(() => {
    router.push('/prio/goal')
  }, [router])

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="goals" className="h-full flex flex-col">
        {/* Tabs */}
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 pt-2">
            <TabsList>
              <TabsTrigger value="goals">
                <Target className="w-4 h-4 mr-2" />
                Goals ({allGoals.length})
              </TabsTrigger>
              <TabsTrigger value="objectives">
                <TrendingUp className="w-4 h-4 mr-2" />
                Objectives ({allObjectives.length})
              </TabsTrigger>
              <TabsTrigger value="team-members">
                <Users className="w-4 h-4 mr-2" />
                Team Members ({allTeamMembers.length})
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="border-b border-border" />
        </div>

        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">All Goals</h1>
                <p className="text-muted-foreground">Manage and track progress across all your goals and projects</p>
              </div>
              <Button onClick={handleCreateGoal}>
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="goals" className="flex-1 overflow-hidden">
          <div className="p-6">
            <GoalsTab allGoals={allGoals} />
          </div>
        </TabsContent>

        <TabsContent value="objectives" className="flex-1 overflow-hidden">
          <div className="p-6">
            <ObjectivesTab allGoals={allGoals} />
          </div>
        </TabsContent>

        <TabsContent value="team-members" className="flex-1 overflow-hidden">
          <div className="p-6">
            <TeamMembersTab allGoals={allGoals} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
