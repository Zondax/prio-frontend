'use client'

import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@zondax/ui-common/client'
import { ArrowLeft, Calendar, CheckCircle, Plus, Target, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { AVAILABLE_MISSIONS, OBJECTIVE_TEMPLATES } from '@/app/(app)/demo/store/prio-mock-data'

type ObjectiveTemplate = (typeof OBJECTIVE_TEMPLATES)[0]

export default function NewObjectivePage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<ObjectiveTemplate | null>(null)
  const [objectiveName, setObjectiveName] = useState('')
  const [objectiveDescription, setObjectiveDescription] = useState('')
  const [parentMissionId, setParentMissionId] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [estimatedHours, setEstimatedHours] = useState<number>(0)
  const [dueDate, setDueDate] = useState('')
  const [assignee, setAssignee] = useState('')
  const [subtasks, setSubtasks] = useState<string[]>([])
  const [newSubtask, setNewSubtask] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleTemplateSelect = useCallback((template: ObjectiveTemplate) => {
    setSelectedTemplate(template)
    setObjectiveName(template.name)
    setObjectiveDescription(template.description)
    setPriority(template.priority)
    setEstimatedHours(template.estimatedHours)
    setSubtasks(template.suggestedSubtasks)
  }, [])

  const handleAddSubtask = useCallback(() => {
    if (newSubtask.trim() && !subtasks.includes(newSubtask.trim())) {
      setSubtasks([...subtasks, newSubtask.trim()])
      setNewSubtask('')
    }
  }, [newSubtask, subtasks])

  const handleRemoveSubtask = useCallback(
    (index: number) => {
      setSubtasks(subtasks.filter((_, i) => i !== index))
    },
    [subtasks]
  )

  const handleCreateObjective = useCallback(async () => {
    if (!selectedTemplate || !objectiveName.trim() || !parentMissionId) return

    setIsCreating(true)

    try {
      // Generate a new UUID for the objective
      const newObjectiveId = `00000000-0000-0000-0000-${Math.floor(Math.random() * 1000000000000)
        .toString()
        .padStart(12, '0')}`

      // In a real implementation, this would:
      // 1. Call API to create the objective
      // 2. Link it to the parent mission
      // 3. Create subtasks
      // 4. Set up notifications and assignments

      // For now, simulate creation delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to the new objective
      router.push(`/prio/objectives/${newObjectiveId}`)
    } catch (error) {
      console.error('Failed to create objective:', error)
      setIsCreating(false)
    }
  }, [selectedTemplate, objectiveName, parentMissionId, router])

  const handleCancel = useCallback(() => {
    router.push('/prio/objectives')
  }, [router])

  const selectedMission = AVAILABLE_MISSIONS.find((m) => m.id === parentMissionId)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={handleCancel} className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Target className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Create New Objective</h1>
          </div>
          <p className="text-muted-foreground">Define a specific deliverable or milestone for a mission.</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Template Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Choose an Objective Template</h2>
              <p className="text-muted-foreground">Select a template that matches your objective type</p>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {OBJECTIVE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-primary bg-muted/50' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleTemplateSelect(template)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{template.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`text-xs ${
                              template.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : template.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {template.priority}
                          </Badge>
                          {template.estimatedHours > 0 && (
                            <span className="text-xs text-muted-foreground">~{template.estimatedHours}h</span>
                          )}
                        </div>
                        {template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {template.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration */}
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Objective Configuration</h2>
                <p className="text-muted-foreground">Configure the details and requirements for this objective</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-mission">Parent Mission</Label>
                      <Select value={parentMissionId} onValueChange={setParentMissionId}>
                        <SelectTrigger id="parent-mission">
                          <SelectValue placeholder="Select parent mission" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MISSIONS.map((mission) => (
                            <SelectItem key={mission.id} value={mission.id}>
                              <div className="flex items-center gap-2">
                                {mission.type === 'team' ? <Users className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                                {mission.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objective-name">Objective Name</Label>
                      <Input
                        id="objective-name"
                        value={objectiveName}
                        onChange={(e) => setObjectiveName(e.target.value)}
                        placeholder="Enter objective name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Input
                        id="assignee"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Who will work on this?"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="objective-description">Description</Label>
                      <Textarea
                        id="objective-description"
                        value={objectiveDescription}
                        onChange={(e) => setObjectiveDescription(e.target.value)}
                        placeholder="Describe what this objective aims to achieve"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date</Label>
                      <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimated-hours">Estimated Hours</Label>
                      <Input
                        id="estimated-hours"
                        type="number"
                        value={estimatedHours}
                        onChange={(e) => setEstimatedHours(Number(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subtasks</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder="Add a subtask"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSubtask()
                          }
                        }}
                      />
                      <Button onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {subtasks.map((subtask, index) => (
                      <div key={subtask} className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1">{subtask}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSubtask(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>

                  {subtasks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm">No subtasks added yet. Add subtasks to break down the work.</p>
                    </div>
                  )}
                </div>

                {/* Preview */}
                {selectedMission && (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{objectiveName || 'Untitled Objective'}</span>
                        <Badge
                          className={`text-xs ${
                            priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Mission:</span>
                        <span className="font-medium">{selectedMission.name}</span>
                      </div>
                      {assignee && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>Assigned to {assignee}</span>
                        </div>
                      )}
                      {dueDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Due {new Date(dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <p className="text-muted-foreground">{objectiveDescription || 'No description provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {selectedTemplate && (
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateObjective}
                disabled={!objectiveName.trim() || !parentMissionId || isCreating}
                className="min-w-[140px]"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Objective
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
