import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CHAT_TEMPLATES, MISSION_TEMPLATES, OBJECTIVE_TEMPLATES } from './prio-mock-data'

interface TemplatesState {
  chatTemplates: typeof CHAT_TEMPLATES
  missionTemplates: typeof MISSION_TEMPLATES
  objectiveTemplates: typeof OBJECTIVE_TEMPLATES
  getChatTemplate: (id: string) => (typeof CHAT_TEMPLATES)[number] | undefined
  getMissionTemplate: (id: string) => (typeof MISSION_TEMPLATES)[number] | undefined
  getObjectiveTemplate: (id: string) => (typeof OBJECTIVE_TEMPLATES)[number] | undefined
  getChatTemplatesByType: (type: 'individual' | 'team') => typeof CHAT_TEMPLATES
  addChatTemplate: (template: (typeof CHAT_TEMPLATES)[number]) => void
  updateChatTemplate: (id: string, updates: Partial<(typeof CHAT_TEMPLATES)[number]>) => void
  removeChatTemplate: (id: string) => void
}

export const useTemplatesStore = create<TemplatesState>()(
  devtools(
    (set, get) => ({
      chatTemplates: CHAT_TEMPLATES,
      missionTemplates: MISSION_TEMPLATES,
      objectiveTemplates: OBJECTIVE_TEMPLATES,

      getChatTemplate: (id) => get().chatTemplates.find((template) => template.id === id),

      getMissionTemplate: (id) => get().missionTemplates.find((template) => template.id === id),

      getObjectiveTemplate: (id) => get().objectiveTemplates.find((template) => template.id === id),

      getChatTemplatesByType: (type) => get().chatTemplates.filter((template) => template.type === type),

      addChatTemplate: (template) =>
        set((state) => ({
          chatTemplates: [...state.chatTemplates, template],
        })),

      updateChatTemplate: (id, updates) =>
        set((state) => ({
          chatTemplates: state.chatTemplates.map((template) =>
            template.id === id ? ({ ...template, ...updates } as (typeof CHAT_TEMPLATES)[number]) : template
          ),
        })),

      removeChatTemplate: (id) =>
        set((state) => ({
          chatTemplates: state.chatTemplates.filter((template) => template.id !== id),
        })),
    }),
    {
      name: 'templates-store',
    }
  )
)
