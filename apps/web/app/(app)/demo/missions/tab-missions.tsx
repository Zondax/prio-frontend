'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge, Input, VirtualizedTable } from '@zondax/ui-common/client'
import { MoreHorizontal, Search, Target, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import type { MissionDetail } from '@/app/(app)/demo/store/prio-mock-data'

type MissionItem = MissionDetail

interface MissionsTabProps {
  allMissions: MissionItem[]
}

export default function MissionsTab({ allMissions }: MissionsTabProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'team'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  // Filter and search missions
  const filteredMissions = useMemo(() => {
    let filtered = allMissions

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((mission) => mission.type === selectedType)
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((mission) => mission.status === selectedStatus)
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter((mission) => mission.priority === selectedPriority)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (mission) =>
          mission.name.toLowerCase().includes(query) ||
          mission.description.toLowerCase().includes(query) ||
          mission.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          mission.participants.some((participant) => participant.name.toLowerCase().includes(query))
      )
    }

    // Sort by priority and progress
    return filtered.sort((a, b) => {
      // First by status (active first)
      if (a.status === 'active' && b.status !== 'active') return -1
      if (b.status === 'active' && a.status !== 'active') return 1

      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Finally by progress (higher progress first)
      return b.progress - a.progress
    })
  }, [searchQuery, selectedType, selectedStatus, selectedPriority, allMissions])

  const handleMissionClick = useCallback(
    (mission: MissionItem) => {
      router.push(`/prio/missions/${mission.id}`)
    },
    [router]
  )

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'planning':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }, [])

  const getProgressColor = useCallback((progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }, [])

  // Define columns for the missions table
  const missionColumns = useMemo<ColumnDef<MissionItem>[]>(
    () => [
      {
        id: 'icon',
        header: '',
        cell: ({ row: _row }) => {
          return (
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
            </div>
          )
        },
        size: 40,
        minSize: 40,
        maxSize: 40,
      },
      {
        id: 'name',
        header: 'Mission',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium truncate">{row.original.name}</div>
            <div className="text-xs text-muted-foreground truncate">{row.original.description}</div>
          </div>
        ),
        size: 200,
        minSize: 160,
        maxSize: 250,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <Badge className={`${getStatusColor(row.original.status)} text-xs`}>{row.original.status}</Badge>,
        size: 80,
        minSize: 70,
        maxSize: 90,
      },
      {
        id: 'priority',
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ row }) => <Badge className={`${getPriorityColor(row.original.priority)} text-xs`}>{row.original.priority}</Badge>,
        size: 70,
        minSize: 60,
        maxSize: 80,
      },
      {
        id: 'progress',
        header: 'Progress',
        accessorKey: 'progress',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(row.original.progress)}`}
                style={{ width: `${row.original.progress}%` }}
              />
            </div>
            <span className="text-xs font-medium min-w-[30px]">{row.original.progress}%</span>
          </div>
        ),
        size: 100,
        minSize: 90,
        maxSize: 120,
      },
      {
        id: 'objectives',
        header: 'Obj',
        accessorKey: 'objectiveCount',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs">
              {row.original.completedObjectives}/{row.original.objectiveCount}
            </span>
          </div>
        ),
        size: 60,
        minSize: 50,
        maxSize: 70,
      },
      {
        id: 'team',
        header: 'Team',
        accessorKey: 'participants',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs">{row.original.participants.length}</span>
          </div>
        ),
        size: 50,
        minSize: 45,
        maxSize: 60,
      },
      {
        id: 'tags',
        header: 'Tags',
        accessorKey: 'tags',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.slice(0, 1).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-1">
                {tag}
              </Badge>
            ))}
            {row.original.tags.length > 1 && (
              <Badge variant="secondary" className="text-xs px-1">
                +{row.original.tags.length - 1}
              </Badge>
            )}
          </div>
        ),
        size: 80,
        minSize: 70,
        maxSize: 100,
      },
      {
        id: 'actions',
        header: '',
        accessorKey: 'id',
        cell: () => (
          <button type="button" className="h-6 w-6 p-0 rounded-md hover:bg-gray-100 flex items-center justify-center">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        ),
        size: 40,
        minSize: 40,
        maxSize: 40,
      },
    ],
    [getStatusColor, getPriorityColor, getProgressColor]
  )

  const stats = useMemo(() => {
    const activeMissions = filteredMissions.filter((m) => m.status === 'active')
    const totalObjectives = filteredMissions.reduce((sum, m) => sum + m.objectiveCount, 0)
    const completedObjectives = filteredMissions.reduce((sum, m) => sum + m.completedObjectives, 0)

    return {
      total: filteredMissions.length,
      active: activeMissions.length,
      totalObjectives,
      completedObjectives,
      avgProgress: filteredMissions.reduce((sum, m) => sum + m.progress, 0) / filteredMissions.length || 0,
    }
  }, [filteredMissions])

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search missions, participants, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="planning">Planning</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Missions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {stats.completedObjectives}/{stats.totalObjectives}
          </div>
          <div className="text-sm text-muted-foreground">Objectives Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.round(stats.avgProgress)}%</div>
          <div className="text-sm text-muted-foreground">Avg Progress</div>
        </div>
      </div>

      {/* Missions Table */}
      <div className="h-[600px] border rounded-lg flex flex-col">
        <VirtualizedTable
          data={filteredMissions}
          columns={missionColumns as ColumnDef<any>[]}
          onRowClick={(row) => handleMissionClick(row.original)}
          enableSorting
          enableColumnResizing
          emptyContent="No missions found. Try adjusting your search or filters."
        />
      </div>
    </div>
  )
}
