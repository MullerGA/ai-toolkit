export interface TimelinePoint {
  id: string
  label: string
  active: boolean
}

export interface ContextWindow {
  active: string[]
  recent: string[]
}

export interface MemoryStack {
  high: string[]
  medium: string[]
  low: string[]
}

export interface Message {
  id: string
  content: string
  sender: 'human' | 'assistant'
}

export interface ConversationState {
  timelinePoint: TimelinePoint
  contextWindow: ContextWindow
  memoryStack: MemoryStack
  messages: Message[]
} 