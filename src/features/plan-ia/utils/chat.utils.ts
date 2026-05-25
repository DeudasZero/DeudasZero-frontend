import type { ChatMessage, ChatMessageTag, QuickReply } from '../types/plan-ia.types.ts'

export const QUICK_REPLIES: QuickReply[] = [
  { id: 'q1', label: '¿Por qué esta estrategia?' },
  { id: 'q2', label: '¿Y si abono $200.000 extra?' },
  { id: 'q3', label: '¿Cuánto ahorro en total?' },
  { id: 'q4', label: 'Dame el mejor plan' },
]

export function makeUserMessage(text: string): ChatMessage {
  return {
    id: `u_${Date.now()}`,
    role: 'user',
    content: text.trim(),
    timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
  }
}

export function makeAIMessage(content: string, tag?: ChatMessageTag): ChatMessage {
  return {
    id: `ai_${Date.now()}`,
    role: 'ai',
    content,
    timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    ...(tag !== undefined && { tag }),
  }
}
