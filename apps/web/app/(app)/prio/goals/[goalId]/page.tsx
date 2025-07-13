'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge, Button, useAppShell, VirtualizedTable } from '@zondax/ui-common/client'
import { Calendar, Clock, MessageSquare, MoreHorizontal, Settings, Target, Users } from 'lucide-react'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { type ChatChannel, type GoalDetail, getGoalDetail, type Objective } from '@/app/(app)/prio/store/prio-mock-data'
import { useAppAuthorization } from '@/lib/authorization/useAppAuthorization'

function GoalPageContent({ config }: { config: GoalDetail }) {
  const _appShell = useAppShell()
  const auth = useAppAuthorization()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'objectives' | 'chat-channels' | 'team-members'>('objectives')

  // Get user ID from auth claims
  const _userId = auth.claims?.sub || 'anonymous-user'

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

  const handleObjectiveClick = useCallback(
    (objectiveId: string) => {
      router.push(`/prio/objectives/${objectiveId}`)
    },
    [router]
  )

  const handleChatClick = useCallback(
    (chatId: string) => {
      router.push(`/prio/chats/${chatId}`)
    },
    [router]
  )

  // Define columns for objectives table
  const objectiveColumns = useMemo<ColumnDef<Objective>[]>(
    () => [
      {
        id: 'title',
        header: 'Objective',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium">{row.original.title}</div>
            <div className="text-sm text-muted-foreground">{row.original.description}</div>
          </div>
        ),
        minSize: 200,
        maxSize: 400,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
        minSize: 100,
        maxSize: 150,
      },
      {
        id: 'assignee',
        header: 'Assignee',
        accessorKey: 'assigneeName',
        minSize: 100,
        maxSize: 150,
      },
      {
        id: 'dueDate',
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: ({ row }) =>
          row.original.dueDate ? (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{row.original.dueDate.toLocaleDateString()}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">No deadline</span>
          ),
        minSize: 120,
        maxSize: 180,
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
        minSize: 120,
        maxSize: 180,
      },
    ],
    [getStatusColor]
  )

  // Define columns for chat channels table
  const chatColumns = useMemo<ColumnDef<ChatChannel>[]>(
    () => [
      {
        id: 'status',
        header: '',
        accessorKey: 'id',
        cell: () => <div className="w-2 h-2 bg-green-500 rounded-full" />,
        minSize: 30,
        maxSize: 30,
      },
      {
        id: 'name',
        header: 'Channel',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-muted-foreground">Last activity: {row.original.lastActivity.toLocaleTimeString()}</div>
          </div>
        ),
        minSize: 200,
        maxSize: 400,
      },
      {
        id: 'actions',
        header: 'Actions',
        accessorKey: 'id',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleChatClick(row.original.id)
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Join Chat
          </Button>
        ),
        minSize: 120,
        maxSize: 120,
      },
    ],
    [handleChatClick]
  )

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 pt-2">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('objectives')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-all relative ${
                activeTab === 'objectives'
                  ? 'bg-background border-border text-foreground shadow-sm -mb-px z-10'
                  : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Target className="w-4 h-4 mr-2 inline" />
              Objectives
            </button>
            <button
              onClick={() => setActiveTab('chat-channels')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-all relative ${
                activeTab === 'chat-channels'
                  ? 'bg-background border-border text-foreground shadow-sm -mb-px z-10'
                  : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              Chat Channels
            </button>
            {config.type === 'team' && (
              <button
                onClick={() => setActiveTab('team-members')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-all relative ${
                  activeTab === 'team-members'
                    ? 'bg-background border-border text-foreground shadow-sm -mb-px z-10'
                    : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Users className="w-4 h-4 mr-2 inline" />
                Team Members
              </button>
            )}
          </div>
        </div>
        <div className="border-b border-border" />
      </div>

      {/* Goal Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{config.name}</h1>
                <Badge className={getStatusColor(config.status)}>{config.status}</Badge>
                <Badge className={getPriorityColor(config.priority)}>{config.priority} priority</Badge>
              </div>
              <p className="text-muted-foreground">{config.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {config.participants.length} participant{config.participants.length === 1 ? '' : 's'}
                  </span>
                </div>
                {config.targetDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due {config.targetDate.toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{config.progress}% complete</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{config.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${config.progress}%` }} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'objectives' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Objectives</h3>
                <p className="text-sm text-muted-foreground">Track progress on key deliverables and milestones</p>
              </div>
              <div className="h-[400px] border rounded-lg flex flex-col">
                <VirtualizedTable
                  data={config.objectives}
                  columns={objectiveColumns as ColumnDef<any>[]}
                  onRowClick={(row) => {
                    if (row?.original?.id) {
                      handleObjectiveClick(row.original.id)
                    }
                  }}
                  enableSorting
                  enableColumnResizing
                />
              </div>
            </div>
          )}

          {activeTab === 'chat-channels' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Chat Channels</h3>
                <p className="text-sm text-muted-foreground">Active discussions and collaboration spaces</p>
              </div>
              <div className="h-[400px] border rounded-lg flex flex-col">
                <VirtualizedTable
                  data={config.chatChannels}
                  columns={chatColumns as ColumnDef<any>[]}
                  onRowClick={(row) => {
                    if (row?.original?.id) {
                      handleChatClick(row.original.id)
                    }
                  }}
                  enableSorting
                  enableColumnResizing
                />
              </div>
            </div>
          )}

          {activeTab === 'team-members' && config.type === 'team' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <p className="text-sm text-muted-foreground">Collaborate with your team on this mission</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{participant.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{participant.name}</h4>
                      <p className="text-xs text-muted-foreground">{participant.role || 'Team Member'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GoalPage() {
  const { goalId } = useParams()
  const goalIdString = goalId as string

  // Get goal from centralized mock data
  const goal = getGoalDetail(goalIdString)

  if (!goal) {
    notFound()
  }

  return <GoalPageContent config={goal} />
}
