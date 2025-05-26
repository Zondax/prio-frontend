// Default welcome message for new sessions
export const defaultWelcomeMessage = {
  id: 'welcome-msg',
  role: 'assistant' as const,
  content: 'Hello! How can I help you today?',
  type: 'text' as const,
  timestamp: new Date(),
}
