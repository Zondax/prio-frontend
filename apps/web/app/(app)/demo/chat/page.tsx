'use client'

import { Badge, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@zondax/ui-web/client'
import { MessageSquare, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { CHAT_TEMPLATES } from '@/app/(app)/demo/store/prio-mock-data'

type ChatTemplate = (typeof CHAT_TEMPLATES)[0]

export default function NewChatPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<ChatTemplate | null>(null)
  const [chatName, setChatName] = useState('')
  const [chatDescription, setChatDescription] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [chatType, setChatType] = useState<'individual' | 'team'>('individual')
  const [isCreating, setIsCreating] = useState(false)

  const handleTemplateSelect = useCallback((template: ChatTemplate) => {
    setSelectedTemplate(template)
    setChatName(template.name)
    setChatDescription(template.description)
    setCustomPrompt(template.prompt)
    setChatType(template.type)
  }, [])

  const handleCreateChat = useCallback(async () => {
    if (!selectedTemplate || !chatName.trim()) return

    setIsCreating(true)

    try {
      // Generate a new UUID for the chat
      const newChatId = `00000000-0000-0000-0000-${Math.floor(Math.random() * 1000000000000)
        .toString()
        .padStart(12, '0')}`

      // In a real implementation, this would:
      // 1. Call API to create the chat with the configuration
      // 2. Set up initial system prompt
      // 3. Configure chat settings

      // For now, simulate creation delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to the new chat
      router.push(`/prio/chats/${newChatId}`)
    } catch (error) {
      console.error('Failed to create chat:', error)
      setIsCreating(false)
    }
  }, [selectedTemplate, chatName, router])

  const handleCancel = useCallback(() => {
    router.push('/prio/chats')
  }, [router])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Create New Chat</h1>
          </div>
          <p className="text-muted-foreground">Choose a template or create a custom chat to get started with AI assistance.</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Template Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Choose a Template</h2>
              <p className="text-muted-foreground">Select a pre-configured chat template or create a custom one</p>
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CHAT_TEMPLATES.map((template) => (
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
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.type}
                          </Badge>
                          {template.tags.length > 0 && (
                            <div className="flex gap-1">
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration */}
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Chat Configuration</h2>
                <p className="text-muted-foreground">Customize your chat settings and initial prompt</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chat-name">Chat Name</Label>
                      <Input id="chat-name" value={chatName} onChange={(e) => setChatName(e.target.value)} placeholder="Enter chat name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chat-description">Description</Label>
                      <Input
                        id="chat-description"
                        value={chatDescription}
                        onChange={(e) => setChatDescription(e.target.value)}
                        placeholder="Enter chat description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chat-type">Chat Type</Label>
                      <Select value={chatType} onValueChange={(value: 'individual' | 'team') => setChatType(value)}>
                        <SelectTrigger id="chat-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="custom-prompt">System Prompt</Label>
                      <Textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Enter system prompt for the AI assistant"
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{chatName || 'Untitled Chat'}</span>
                      <Badge variant="outline" className="text-xs">
                        {chatType}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{chatDescription || 'No description provided'}</p>
                    {customPrompt && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">System Prompt:</p>
                        <p className="text-xs bg-background/50 p-2 rounded border line-clamp-3">{customPrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {selectedTemplate && (
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleCreateChat} disabled={!chatName.trim() || isCreating} className="min-w-[120px]">
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Chat
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
