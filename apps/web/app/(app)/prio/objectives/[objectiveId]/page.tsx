'use client'

import { Badge, BlockNoteEditorComponent, Button, Progress, Tabs, TabsContent, TabsList, TabsTrigger } from '@zondax/ui-common/client'
import { ArrowLeft, Calendar, CheckCircle, Edit, FileText, MessageSquare, MoreHorizontal, Users } from 'lucide-react'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { getObjectiveDetail, type ObjectiveDetail } from '@/app/(app)/prio/store/prio-mock-data'
import { useAppAuthorization } from '@/lib/authorization/useAppAuthorization'

// Legacy objective configurations for backward compatibility (non-UUID format)
// These are simplified versions that don't have full data relationships
const LEGACY_OBJECTIVE_CONFIGS: Record<string, any> = {
  'alpha-frontend': {
    id: 'alpha-frontend',
    title: 'Frontend Tasks',
    description: 'Implement new UI components and layouts for better user experience',
    status: 'in-progress' as const,
    priority: 'high' as const,
    progress: 75,
    assigneeId: 'user-sarah',
    assigneeName: 'Sarah',
    missionId: 'project-alpha',
    missionName: 'Project Alpha',
    startDate: new Date('2024-01-20'),
    dueDate: new Date('2024-02-28'),
    estimatedHours: 120,
    actualHours: 90,
    tags: ['frontend', 'ui', 'react'],
    subtasks: [
      {
        id: '1',
        objectiveId: 'alpha-frontend',
        title: 'Design system components',
        completed: true,
        assigneeId: 'user-sarah',
        createdAt: new Date('2024-01-20'),
        completedAt: new Date('2024-01-25'),
      },
      { id: '2', title: 'Responsive layout implementation', completed: true, assignee: 'Sarah' },
      { id: '3', title: 'Accessibility improvements', completed: false, assignee: 'Sarah' },
      { id: '4', title: 'Performance optimization', completed: false, assignee: 'John' },
    ],
    comments: [
      {
        id: '1',
        author: 'Sarah',
        content: 'Made good progress on the responsive layouts. Mobile version is looking great!',
        timestamp: new Date('2024-01-25T10:30:00'),
      },
      {
        id: '2',
        author: 'John',
        content: 'I can help with the performance optimization part. Let me know when you are ready.',
        timestamp: new Date('2024-01-26T14:15:00'),
      },
    ],
    attachments: [
      { id: '1', name: 'design-mockups.figma', type: 'design', size: '2.4MB' },
      { id: '2', name: 'component-specs.pdf', type: 'document', size: '856KB' },
    ],
    documents: [],
  },
  'alpha-backend': {
    id: 'alpha-backend',
    title: 'Backend Tasks',
    description: 'API development and database optimization',
    status: 'completed' as const,
    priority: 'high' as const,
    progress: 100,
    assigneeId: 'user-mike',
    assigneeName: 'Mike',
    missionId: 'project-alpha',
    missionName: 'Project Alpha',
    startDate: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    estimatedHours: 80,
    actualHours: 75,
    tags: ['backend', 'api', 'database'],
    subtasks: [
      { id: '1', title: 'User authentication API', completed: true, assignee: 'Mike' },
      { id: '2', title: 'Data models and relationships', completed: true, assignee: 'Mike' },
      { id: '3', title: 'Performance optimization', completed: true, assignee: 'Mike' },
      { id: '4', title: 'API documentation', completed: true, assignee: 'Mike' },
    ],
    comments: [
      {
        id: '1',
        author: 'Mike',
        content: 'All backend tasks completed ahead of schedule. API is ready for frontend integration.',
        timestamp: new Date('2024-02-14T16:00:00'),
      },
    ],
    attachments: [
      { id: '1', name: 'api-documentation.pdf', type: 'document', size: '1.2MB' },
      { id: '2', name: 'database-schema.sql', type: 'code', size: '45KB' },
    ],
    documents: [],
  },
  'alpha-testing': {
    id: 'alpha-testing',
    title: 'Testing',
    description: 'End-to-end testing and quality assurance',
    status: 'pending' as const,
    priority: 'medium' as const,
    progress: 0,
    assigneeId: 'user-john',
    assigneeName: 'John',
    missionId: 'project-alpha',
    missionName: 'Project Alpha',
    startDate: new Date('2024-02-20'),
    dueDate: new Date('2024-03-10'),
    estimatedHours: 60,
    actualHours: 0,
    tags: ['testing', 'qa', 'automation'],
    subtasks: [
      { id: '1', title: 'Unit test coverage', completed: false, assignee: 'John' },
      { id: '2', title: 'Integration tests', completed: false, assignee: 'John' },
      { id: '3', title: 'E2E test automation', completed: false, assignee: 'Emma' },
      { id: '4', title: 'Performance testing', completed: false, assignee: 'John' },
    ],
    comments: [],
    attachments: [],
    documents: [],
  },
  'beta-research': {
    id: 'beta-research',
    title: 'Research',
    description: 'Market analysis and technology evaluation',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    progress: 40,
    assigneeId: 'user-david',
    assigneeName: 'David',
    missionId: 'project-beta',
    missionName: 'Project Beta',
    startDate: new Date('2024-02-01'),
    dueDate: new Date('2024-03-01'),
    estimatedHours: 40,
    actualHours: 16,
    tags: ['research', 'analysis', 'market'],
    subtasks: [
      { id: '1', title: 'Competitor analysis', completed: true, assignee: 'David' },
      { id: '2', title: 'Technology stack evaluation', completed: false, assignee: 'David' },
      { id: '3', title: 'User research surveys', completed: false, assignee: 'Lisa' },
    ],
    comments: [
      {
        id: '1',
        author: 'David',
        content: 'Competitor analysis is complete. Found some interesting insights about market trends.',
        timestamp: new Date('2024-02-10T11:00:00'),
      },
    ],
    attachments: [{ id: '1', name: 'competitor-analysis.xlsx', type: 'spreadsheet', size: '3.1MB' }],
    documents: [],
  },
  'personal-ai-assistant': {
    id: 'personal-ai-assistant',
    title: 'AI Assistant',
    description: 'Personal AI conversations and assistance',
    status: 'active' as const,
    priority: 'medium' as const,
    progress: 60,
    assigneeId: 'user-you',
    assigneeName: 'You',
    missionId: 'personal',
    missionName: 'Personal Workspace',
    startDate: new Date('2024-01-01'),
    dueDate: null,
    estimatedHours: null,
    actualHours: 24,
    tags: ['ai', 'productivity', 'assistance'],
    subtasks: [
      { id: '1', title: 'Daily AI interactions', completed: true, assignee: 'You' },
      { id: '2', title: 'Code review assistance', completed: true, assignee: 'You' },
      { id: '3', title: 'Advanced prompt engineering', completed: false, assignee: 'You' },
    ],
    comments: [],
    attachments: [],
    documents: [],
  },
}

function ObjectivePageContent({ config }: { config: ObjectiveDetail }) {
  const auth = useAppAuthorization()
  const router = useRouter()

  // Get user ID from auth claims
  const _userId = auth.claims?.sub || 'anonymous-user'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

  const completedSubtasks = config.subtasks.filter((task) => task.completed).length
  const totalSubtasks = config.subtasks.length

  const handleBackToGoal = useCallback(() => {
    router.push(`/prio/goals/${config.goalId}`)
  }, [router, config.goalId])

  const handleEditObjective = useCallback(() => {
    // TODO: Implement edit functionality
    console.log('Edit objective:', config.id)
  }, [config.id])

  return (
    <div className="h-full flex flex-col">
      {/* Objective Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBackToGoal} className="p-1">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold">{config.title}</h1>
                <Badge className={getStatusColor(config.status)}>{config.status}</Badge>
                <Badge className={getPriorityColor(config.priority)}>{config.priority} priority</Badge>
              </div>
              <p className="text-muted-foreground">{config.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Goal: {config.goalName}</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Assigned to {config.assigneeName}</span>
                </div>
                {config.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due {config.dueDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEditObjective}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Overall Progress</div>
              <div className="text-2xl font-bold mb-2">{config.progress}%</div>
              <Progress value={config.progress} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Subtasks</div>
              <div className="text-2xl font-bold mb-2">
                {completedSubtasks}/{totalSubtasks}
              </div>
              <Progress value={(completedSubtasks / totalSubtasks) * 100} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Time Spent</div>
              <div className="text-2xl font-bold mb-2">
                {config.actualHours}h{config.estimatedHours ? `/${config.estimatedHours}h` : ''}
              </div>
              {config.estimatedHours && <Progress value={(config.actualHours / config.estimatedHours) * 100} className="h-2" />}
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

      {/* Objective Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-6">
              {/* Documents Section */}
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents & Resources
                  </h3>
                  <p className="text-sm text-muted-foreground">Create and manage documentation for this objective</p>
                </div>

                {config.documents && config.documents.length > 0 ? (
                  <div className="grid gap-4">
                    {config.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{doc.title}</h4>
                              <p className="text-sm text-muted-foreground">{doc.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="capitalize">{doc.type}</span>
                                <span>Last modified: {doc.lastModified.toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Blocknote Editor for each document */}
                          <div className="border rounded-lg">
                            <BlockNoteEditorComponent editable={true} className="min-h-[200px]" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add New Document Button */}
                    <div className="border border-dashed rounded-lg p-8 text-center">
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Create New Document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-4" />
                    <h4 className="font-medium mb-2">No documents yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">Start creating documentation for this objective</p>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Create First Document
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Information */}
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-semibold">Objective Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      <p className="text-sm mt-1">
                        <Badge className={getStatusColor(config.status)}>{config.status}</Badge>
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Assignee</div>
                      <p className="text-sm mt-1">{config.assigneeName}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                      <p className="text-sm mt-1">{config.startDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Priority</div>
                      <p className="text-sm mt-1">
                        <Badge className={getPriorityColor(config.priority)}>{config.priority}</Badge>
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                      <p className="text-sm mt-1">{config.dueDate ? config.dueDate.toLocaleDateString() : 'No deadline set'}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Estimated Hours</div>
                      <p className="text-sm mt-1">{config.estimatedHours ? `${config.estimatedHours} hours` : 'Not estimated'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subtasks" className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </h3>
                  <p className="text-sm text-muted-foreground">Break down of work items for this objective</p>
                </div>
                <div className="space-y-3">
                  {config.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          subtask.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                      >
                        {subtask.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>{subtask.title}</h4>
                        <p className="text-sm text-muted-foreground">Assigned to {subtask.assigneeId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments ({config.comments.length})
                  </h3>
                  <p className="text-sm text-muted-foreground">Discussion and updates about this objective</p>
                </div>
                {config.comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to add one!</div>
                ) : (
                  <div className="space-y-4">
                    {config.comments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">{comment.author.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Attachments ({config.documents.length})
                  </h3>
                  <p className="text-sm text-muted-foreground">Files and documents related to this objective</p>
                </div>
                {config.documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No attachments yet.</div>
                ) : (
                  <div className="space-y-3">
                    {config.documents.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{attachment.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {attachment.type} • {attachment.description}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function ObjectivePage() {
  const { objectiveId } = useParams()
  const objectiveIdString = objectiveId as string

  // Get objective from centralized mock data
  let objective = getObjectiveDetail(objectiveIdString)

  // Fall back to legacy configs if not found
  if (!objective && LEGACY_OBJECTIVE_CONFIGS[objectiveIdString]) {
    objective = LEGACY_OBJECTIVE_CONFIGS[objectiveIdString]
  }

  if (!objective) {
    notFound()
  }

  return <ObjectivePageContent config={objective} />
}
