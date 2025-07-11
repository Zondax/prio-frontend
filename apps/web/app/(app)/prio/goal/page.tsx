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
import { ArrowLeft, Calendar, Plus, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { MISSION_TEMPLATES } from '@/app/(app)/prio/store/prio-mock-data'

type MissionTemplate = (typeof MISSION_TEMPLATES)[0]

export default function NewMissionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<MissionTemplate | null>(null)
  const [goalName, setGoalName] = useState('')
  const [goalDescription, setMissionDescription] = useState('')
  const [missionType, setMissionType] = useState<'individual' | 'team'>('team')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [targetDate, setTargetDate] = useState('')
  const [objectives, setObjectives] = useState<string[]>([])
  const [newObjective, setNewObjective] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleTemplateSelect = useCallback((template: MissionTemplate) => {
    setSelectedTemplate(template)
    setGoalName(template.name)
    setMissionDescription(template.description)
    setMissionType(template.type)
    setPriority(template.priority)
    setObjectives(template.suggestedObjectives)
    setCurrentStep(2)
  }, [])

  const handleAddObjective = useCallback(() => {
    if (newObjective.trim() && !objectives.includes(newObjective.trim())) {
      setObjectives([...objectives, newObjective.trim()])
      setNewObjective('')
    }
  }, [newObjective, objectives])

  const handleRemoveObjective = useCallback(
    (index: number) => {
      setObjectives(objectives.filter((_, i) => i !== index))
    },
    [objectives]
  )

  const handleCreateMission = useCallback(async () => {
    if (!selectedTemplate || !goalName.trim()) return

    setIsCreating(true)

    try {
      // Generate a new UUID for the goal
      const newGoalId = `00000000-0000-0000-0000-${Math.floor(Math.random() * 1000000000000)
        .toString()
        .padStart(12, '0')}`

      // In a real implementation, this would:
      // 1. Call API to create the mission
      // 2. Create initial objectives
      // 3. Set up collaboration spaces
      // 4. Send invitations to team members

      // For now, simulate creation delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to the new goal
      router.push(`/prio/goals/${newGoalId}`)
    } catch (error) {
      console.error('Failed to create goal:', error)
      setIsCreating(false)
    }
  }, [selectedTemplate, goalName, router])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/prio/goals')
    }
  }, [currentStep, router])

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const _canProceedToStep2 = selectedTemplate !== null
  const canProceedToStep3 = goalName.trim().length > 0 && goalDescription.trim().length > 0
  const canCreateMission = objectives.length > 0

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Target className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Create New Mission</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step < currentStep
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`text-sm ${
                    step === currentStep ? 'font-medium' : step < currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step === 1 ? 'Template' : step === 2 ? 'Details' : 'Objectives'}
                </span>
                {step < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Choose a Mission Template</h2>
                <p className="text-muted-foreground">Select a template that best matches your mission type and goals</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MISSION_TEMPLATES.map((template) => (
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
                      <div className="flex-shrink-0 mt-1">{<template.icon className="w-6 h-6" />}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {template.type}
                          </Badge>
                          <Badge
                            className={`text-xs ${
                              template.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : template.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {template.priority} priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{template.estimatedDuration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Mission Details */}
          {currentStep === 2 && selectedTemplate && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Mission Details</h2>
                <p className="text-muted-foreground">Configure the basic information for your mission</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission-name">Mission Name</Label>
                      <Input
                        id="mission-name"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Enter mission name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mission-type">Mission Type</Label>
                      <Select value={missionType} onValueChange={(value: 'individual' | 'team') => setMissionType(value)}>
                        <SelectTrigger id="mission-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="target-date">Target Completion Date</Label>
                      <Input id="target-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission-description">Description</Label>
                      <Textarea
                        id="mission-description"
                        value={goalDescription}
                        onChange={(e) => setMissionDescription(e.target.value)}
                        placeholder="Describe the mission goals and scope"
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceedToStep3}>
                    Next: Objectives
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Objectives */}
          {currentStep === 3 && selectedTemplate && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Mission Objectives</h2>
                <p className="text-muted-foreground">Define the key objectives and deliverables for this mission</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add a new objective"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddObjective()
                        }
                      }}
                    />
                    <Button onClick={handleAddObjective} disabled={!newObjective.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {objectives.map((objective, index) => (
                      <div key={objective} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="flex-1">{objective}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjective(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>

                  {objectives.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No objectives added yet. Add your first objective above.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleCreateMission} disabled={!canCreateMission || isCreating} className="min-w-[140px]">
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Mission
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
