'use client'

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@zondax/ui-web/client'
import { Plus, Target, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { getMissionsWithDetails } from '@/app/(app)/demo/store/prio-mock-data'
import MissionsTab from './tab-missions'
import ObjectivesTab from './tab-objectives'
import TeamMembersTab from './tab-team-members'

export default function AllMissionsPage() {
  const router = useRouter()

  // Get all missions with details
  const allMissions = useMemo(() => getMissionsWithDetails(), [])

  // Get all objectives across all missions
  const allObjectives = useMemo(() => {
    return allMissions.flatMap((mission) =>
      mission.objectives.map((obj) => ({
        ...obj,
        missionName: mission.name,
        missionId: mission.id,
        missionStatus: mission.status,
        missionPriority: mission.priority,
      }))
    )
  }, [allMissions])

  // Get all team members across all missions
  const allTeamMembers = useMemo(() => {
    const memberMap = new Map()
    for (const mission of allMissions) {
      for (const participant of mission.participants) {
        const key = participant.id
        if (!memberMap.has(key)) {
          memberMap.set(key, {
            ...participant,
            missionCount: 1,
            missions: [{ id: mission.id, name: mission.name, status: mission.status }],
          })
        } else {
          const existing = memberMap.get(key)
          existing.missionCount += 1
          existing.missions.push({ id: mission.id, name: mission.name, status: mission.status })
        }
      }
    }
    return Array.from(memberMap.values())
  }, [allMissions])

  const handleCreateMission = useCallback(() => {
    router.push('/prio/mission')
  }, [router])

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="missions" className="h-full flex flex-col">
        {/* Tabs */}
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 pt-2">
            <TabsList>
              <TabsTrigger value="missions">
                <Target className="w-4 h-4 mr-2" />
                Missions ({allMissions.length})
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
                <h1 className="text-2xl font-bold">All Missions</h1>
                <p className="text-muted-foreground">Manage and track progress across all your missions and projects</p>
              </div>
              <Button onClick={handleCreateMission}>
                <Plus className="w-4 h-4 mr-2" />
                Create Mission
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="missions" className="flex-1 overflow-hidden">
          <div className="p-6">
            <MissionsTab allMissions={allMissions} />
          </div>
        </TabsContent>

        <TabsContent value="objectives" className="flex-1 overflow-hidden">
          <div className="p-6">
            <ObjectivesTab allMissions={allMissions} />
          </div>
        </TabsContent>

        <TabsContent value="team-members" className="flex-1 overflow-hidden">
          <div className="p-6">
            <TeamMembersTab allMissions={allMissions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
