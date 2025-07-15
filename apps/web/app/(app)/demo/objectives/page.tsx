'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge, Button, Input, Progress, VirtualizedTable } from '@zondax/ui-common/client'
import { Calendar, CheckCircle, Clock, Filter, Plus, Search, Target, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { ALL_OBJECTIVES, MISSIONS, PARTICIPANTS } from '@/app/(app)/demo/store/prio-mock-data'

// Extended objectives data with mission names
const getObjectivesWithMissionNames = () => {
  return ALL_OBJECTIVES.map((obj) => {
    const mission = MISSIONS[obj.missionId]
    const assignee = PARTICIPANTS[obj.assigneeId]
    return {
      ...obj,
      missionName: mission?.name || 'Unknown Mission',
      assigneeName: assignee?.name || 'Unknown',
    }
  })
}

const _EXTENDED_OBJECTIVES = [
  {
    id: '00000000-0000-0000-0000-000000000200',
    title: 'AI Assistant',
    description: 'Personal AI conversations and assistance',
    status: 'active' as const,
    priority: 'medium' as const,
    progress: 60,
    assignee: 'You',
    missionId: '00000000-0000-0000-0000-000000000100',
    missionName: 'Personal Workspace',
    startDate: new Date('2024-01-01'),
    dueDate: null,
    estimatedHours: null,
    actualHours: 24,
    tags: ['ai', 'productivity', 'assistance'],
    subtasksCompleted: 2,
    subtasksTotal: 3,
  },
  {
    id: '00000000-0000-0000-0000-000000000201',
    title: 'Bookmarks',
    description: 'Personal bookmark management system',
    status: 'in-progress' as const,
    priority: 'low' as const,
    progress: 40,
    assignee: 'You',
    missionId: '00000000-0000-0000-0000-000000000100',
    missionName: 'Personal Workspace',
    startDate: new Date('2024-01-10'),
    dueDate: new Date('2024-03-01'),
    estimatedHours: 20,
    actualHours: 8,
    tags: ['bookmarks', 'organization'],
    subtasksCompleted: 1,
    subtasksTotal: 4,
  },
  {
    id: '00000000-0000-0000-0000-000000000210',
    title: 'Frontend Tasks',
    description: 'Implement new UI components and layouts for better user experience',
    status: 'in-progress' as const,
    priority: 'high' as const,
    progress: 75,
    assignee: 'Sarah',
    missionId: '00000000-0000-0000-0000-000000000101',
    missionName: 'Project Alpha',
    startDate: new Date('2024-01-20'),
    dueDate: new Date('2024-02-28'),
    estimatedHours: 120,
    actualHours: 90,
    tags: ['frontend', 'ui', 'react'],
    subtasksCompleted: 3,
    subtasksTotal: 4,
  },
  {
    id: '00000000-0000-0000-0000-000000000211',
    title: 'Backend Tasks',
    description: 'API development and database optimization',
    status: 'completed' as const,
    priority: 'high' as const,
    progress: 100,
    assignee: 'Mike',
    missionId: '00000000-0000-0000-0000-000000000101',
    missionName: 'Project Alpha',
    startDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    estimatedHours: 80,
    actualHours: 75,
    tags: ['backend', 'api', 'database'],
    subtasksCompleted: 4,
    subtasksTotal: 4,
  },
  {
    id: '00000000-0000-0000-0000-000000000212',
    title: 'Testing',
    description: 'End-to-end testing and quality assurance',
    status: 'pending' as const,
    priority: 'medium' as const,
    progress: 0,
    assignee: 'John',
    missionId: '00000000-0000-0000-0000-000000000101',
    missionName: 'Project Alpha',
    startDate: new Date('2024-02-20'),
    dueDate: new Date('2024-03-10'),
    estimatedHours: 60,
    actualHours: 0,
    tags: ['testing', 'qa', 'automation'],
    subtasksCompleted: 0,
    subtasksTotal: 4,
  },
  {
    id: '00000000-0000-0000-0000-000000000220',
    title: 'Research',
    description: 'Market analysis and technology evaluation',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    progress: 40,
    assignee: 'David',
    missionId: '00000000-0000-0000-0000-000000000102',
    missionName: 'Project Beta',
    startDate: new Date('2024-02-01'),
    dueDate: new Date('2024-03-01'),
    estimatedHours: 40,
    actualHours: 16,
    tags: ['research', 'analysis', 'market'],
    subtasksCompleted: 1,
    subtasksTotal: 3,
  },
  {
    id: '00000000-0000-0000-0000-000000000221',
    title: 'Design',
    description: 'UI/UX design and prototyping',
    status: 'pending' as const,
    priority: 'high' as const,
    progress: 10,
    assignee: 'Lisa',
    missionId: '00000000-0000-0000-0000-000000000102',
    missionName: 'Project Beta',
    startDate: new Date('2024-02-15'),
    dueDate: new Date('2024-03-15'),
    estimatedHours: 50,
    actualHours: 5,
    tags: ['design', 'ux', 'ui'],
    subtasksCompleted: 0,
    subtasksTotal: 5,
  },
  {
    id: '00000000-0000-0000-0000-000000000230',
    title: 'Planning',
    description: 'Strategic roadmap and resource allocation',
    status: 'completed' as const,
    priority: 'high' as const,
    progress: 100,
    assignee: 'Alex',
    missionId: '00000000-0000-0000-0000-000000000103',
    missionName: 'Project Gamma',
    startDate: new Date('2023-12-01'),
    dueDate: new Date('2024-01-15'),
    estimatedHours: 30,
    actualHours: 28,
    tags: ['strategy', 'planning', 'optimization'],
    subtasksCompleted: 3,
    subtasksTotal: 3,
  },
]

type EnrichedObjective = ReturnType<typeof getObjectivesWithMissionNames>[0]
type ObjectiveItem = EnrichedObjective

// Column definitions for VirtualizedTable
const columns: ColumnDef<ObjectiveItem>[] = [
  {
    accessorKey: 'title',
    header: 'Objective',
    cell: ({ row }) => {
      const objective = row.original
      return (
        <div>
          <div className="font-medium">{objective.title}</div>
          <div className="text-sm text-muted-foreground truncate max-w-[300px]">{objective.description}</div>
          <div className="flex gap-1 mt-1">
            {objective.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {objective.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{objective.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'missionName',
    header: 'Goal',
    cell: ({ row }) => <span className="text-sm">{row.original.missionName}</span>,
  },
  {
    accessorKey: 'assigneeName',
    header: 'Assignee',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{row.original.assigneeName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => {
      const objective = row.original
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{objective.progress}%</span>
            <span className="text-muted-foreground">
              {objective.actualHours}h / {objective.estimatedHours || 'N/A'}h
            </span>
          </div>
          <Progress value={objective.progress} className="h-2" />
        </div>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.original.priority
      const getPriorityColor = (priority: string) => {
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
      }
      return <Badge className={getPriorityColor(priority)}>{priority}</Badge>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'completed':
            return 'bg-green-100 text-green-800'
          case 'in-progress':
            return 'bg-blue-100 text-blue-800'
          case 'active':
            return 'bg-green-100 text-green-800'
          case 'pending':
            return 'bg-yellow-100 text-yellow-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      }
      return <Badge className={getStatusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row }) => {
      const objective = row.original
      const formatDueDate = (date: Date | null) => {
        if (!date) return 'No due date'
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
      return (
        <div
          className={`text-sm ${
            objective.dueDate && objective.dueDate < new Date() && objective.status !== 'completed'
              ? 'text-red-600 font-medium'
              : 'text-muted-foreground'
          }`}
        >
          {formatDueDate(objective.dueDate)}
        </div>
      )
    },
  },
]

export default function AllObjectivesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'in-progress' | 'completed' | 'pending'>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [selectedMission, setSelectedMission] = useState<'all' | string>('all')

  // Get enriched objectives with mission names
  const enrichedObjectives = useMemo(() => getObjectivesWithMissionNames(), [])

  // Get unique missions for filter
  const availableMissions = useMemo(() => {
    const missions = new Map()
    for (const obj of enrichedObjectives) {
      if (!missions.has(obj.missionId)) {
        missions.set(obj.missionId, obj.missionName)
      }
    }
    return Array.from(missions.entries()).map(([id, name]) => ({ id, name }))
  }, [enrichedObjectives])

  // Filter and search objectives
  const filteredObjectives = useMemo(() => {
    let filtered = enrichedObjectives

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((obj) => obj.status === selectedStatus)
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter((obj) => obj.priority === selectedPriority)
    }

    // Filter by mission
    if (selectedMission !== 'all') {
      filtered = filtered.filter((obj) => obj.missionId === selectedMission)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (obj) =>
          obj.title.toLowerCase().includes(query) ||
          obj.description.toLowerCase().includes(query) ||
          obj.assigneeName.toLowerCase().includes(query) ||
          obj.missionName.toLowerCase().includes(query) ||
          obj.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Then by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime()
      }
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1
      return 0
    })
  }, [searchQuery, selectedStatus, selectedPriority, selectedMission, enrichedObjectives])

  // Statistics
  const stats = useMemo(() => {
    const total = filteredObjectives.length
    const completed = filteredObjectives.filter((obj) => obj.status === 'completed').length
    const inProgress = filteredObjectives.filter((obj) => obj.status === 'in-progress').length
    const pending = filteredObjectives.filter((obj) => obj.status === 'pending').length
    const overdue = filteredObjectives.filter((obj) => obj.dueDate && obj.dueDate < new Date() && obj.status !== 'completed').length

    return { total, completed, inProgress, pending, overdue }
  }, [filteredObjectives])

  const handleObjectiveClick = useCallback(
    (row: any) => {
      if (row?.original?.id) {
        router.push(`/prio/objectives/${row.original.id}`)
      }
    },
    [router]
  )

  const handleCreateObjective = useCallback(() => {
    router.push('/prio/objective')
  }, [router])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">All Objectives</h1>
              <p className="text-muted-foreground">Track and manage objectives across all missions</p>
            </div>
            <Button onClick={handleCreateObjective}>
              <Plus className="w-4 h-4 mr-2" />
              New Objective
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="text-sm text-muted-foreground">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search objectives, assignees, or missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm min-w-[120px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={selectedMission}
                onChange={(e) => setSelectedMission(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm min-w-[180px]"
              >
                <option value="all">All Missions</option>
                {availableMissions.map((mission) => (
                  <option key={mission.id} value={mission.id}>
                    {mission.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{filteredObjectives.length} objectives</span>
            <span>•</span>
            <span>
              {stats.completed}/{stats.total} completed
            </span>
            {stats.overdue > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600">{stats.overdue} overdue</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Objectives List</h2>
          </div>
          <p className="text-sm text-muted-foreground">Click on any objective to view details and manage progress</p>
        </div>
        <div className="flex-1 overflow-auto px-6">
          <VirtualizedTable
            data={filteredObjectives}
            columns={columns}
            onRowClick={handleObjectiveClick}
            emptyContent={
              <div className="text-center py-8 text-muted-foreground">No objectives found. Try adjusting your search or filters.</div>
            }
          />
        </div>
      </div>
    </div>
  )
}
