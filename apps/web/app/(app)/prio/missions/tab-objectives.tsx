'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge, Input, VirtualizedTable } from '@zondax/ui-common/client'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { type MissionDetail, PARTICIPANTS } from '@/app/(app)/prio/store/prio-mock-data'

interface ObjectivesTabProps {
  allMissions: MissionDetail[]
}

export default function ObjectivesTab({ allMissions }: ObjectivesTabProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Get all objectives across all missions
  const allObjectives = useMemo(() => {
    return allMissions.flatMap((mission) =>
      mission.objectives.map((obj) => {
        const assignee = PARTICIPANTS[obj.assigneeId]
        return {
          ...obj,
          missionName: mission.name,
          missionId: mission.id,
          missionStatus: mission.status,
          missionPriority: mission.priority,
          assigneeName: assignee?.name || 'Unknown',
        }
      })
    )
  }, [allMissions])

  // Filter objectives based on search
  const filteredObjectives = useMemo(() => {
    if (!searchQuery) return allObjectives

    const query = searchQuery.toLowerCase()
    return allObjectives.filter(
      (obj) =>
        obj.title.toLowerCase().includes(query) ||
        obj.description.toLowerCase().includes(query) ||
        obj.missionName.toLowerCase().includes(query) ||
        obj.assigneeName.toLowerCase().includes(query)
    )
  }, [searchQuery, allObjectives])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  // Define columns for objectives table
  const objectiveColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'title',
        header: 'Objective',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium truncate">{row.original.title}</div>
            <div className="text-xs text-muted-foreground truncate">{row.original.description}</div>
          </div>
        ),
        size: 250,
        minSize: 200,
        maxSize: 300,
      },
      {
        id: 'mission',
        header: 'Mission',
        accessorKey: 'missionName',
        cell: ({ row }) => <div className="text-sm">{row.original.missionName}</div>,
        size: 180,
        minSize: 150,
        maxSize: 220,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
        size: 100,
        minSize: 80,
        maxSize: 120,
      },
      {
        id: 'assignee',
        header: 'Assignee',
        accessorKey: 'assigneeName',
        size: 120,
        minSize: 100,
        maxSize: 150,
      },
      {
        id: 'progress',
        header: 'Progress',
        accessorKey: 'progress',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${row.original.progress}%` }} />
            </div>
            <span className="text-sm font-medium">{row.original.progress}%</span>
          </div>
        ),
        size: 120,
        minSize: 100,
        maxSize: 150,
      },
    ],
    [getStatusColor]
  )

  const stats = useMemo(() => {
    return {
      total: filteredObjectives.length,
      completed: filteredObjectives.filter((obj) => obj.status === 'completed').length,
      inProgress: filteredObjectives.filter((obj) => obj.status === 'in-progress').length,
      avgProgress: Math.round(filteredObjectives.reduce((sum, obj) => sum + obj.progress, 0) / filteredObjectives.length || 0),
    }
  }, [filteredObjectives])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search objectives, missions, or assignees..."
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
          <div className="text-sm text-muted-foreground">Total Objectives</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.avgProgress}%</div>
          <div className="text-sm text-muted-foreground">Avg Progress</div>
        </div>
      </div>

      {/* Objectives Table */}
      <div className="h-[600px] border rounded-lg flex flex-col">
        <VirtualizedTable
          data={filteredObjectives}
          columns={objectiveColumns as ColumnDef<any>[]}
          onRowClick={(row) => {
            if (row?.original?.missionId) {
              router.push(`/prio/missions/${row.original.missionId}`)
            }
          }}
          enableSorting
          enableColumnResizing
          emptyContent="No objectives found."
        />
      </div>
    </div>
  )
}
