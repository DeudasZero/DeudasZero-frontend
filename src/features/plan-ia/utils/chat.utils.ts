import type { ChatMessage, ChatMessageTag, QuickReply } from '../types/plan-ia.types.ts'

export function buildInitialMessages(): ChatMessage[] {
  return [
    {
      id: 'init-1',
      role: 'ai',
      content:
        'Hola Mariana. Analicé tus 3 deudas activas y tu flujo de $1.24M. Tu plan recomendado es **Avalancha**: ataca primero la Visa Bancolombia por su tasa de 3.1%/mes.',
      timestamp: '9:32',
    },
    {
      id: 'init-2',
      role: 'user',
      content: '¿Por qué Avalancha y no Bola de Nieve?',
      timestamp: '9:33',
    },
    {
      id: 'init-3',
      role: 'ai',
      content:
        'Con Avalancha ahorras **$690.000 en intereses**. Bola de Nieve solo ahorraría $410.000 — pero termina las deudas más pequeñas antes, lo que motiva. Tú tienes 3 deudas: el orden óptimo matemático es claro.',
      timestamp: '9:33',
    },
  ]
}

export const QUICK_REPLIES: QuickReply[] = [
  { id: 'q1', label: '¿Por qué Avalancha?' },
  { id: 'q2', label: '¿Y si abono $200k?' },
  { id: 'q3', label: 'Mejor plan' },
]

export function generateAIReply(userText: string): { content: string; tag?: ChatMessageTag } {
  const lower = userText.toLowerCase()

  if (lower.includes('200k') || lower.includes('200.000')) {
    return {
      content:
        'Recalculo... Con $200k extra al mes en Ago, terminas en **7 meses** (no 9) y ahorras $38k adicionales. ¡Excelente movimiento si tu flujo lo permite!',
      tag: 'WHAT-IF',
    }
  }
  if (lower.includes('300k') || lower.includes('300.000')) {
    return {
      content:
        'Recalculo... Con $300k extra en Sep, terminas en **8 meses** (no 9) y ahorras $52k adicionales. Te conviene si tu freelance se concreta.',
      tag: 'WHAT-IF',
    }
  }
  if (lower.includes('avalancha') || lower.includes('por qué') || lower.includes('bola')) {
    return {
      content:
        'Con Avalancha ahorras **$690.000 en intereses**. Bola de Nieve solo ahorraría $410.000 — pero termina las deudas más pequeñas antes, lo que motiva. Tú tienes 3 deudas: el orden óptimo matemático es claro.',
    }
  }
  if (lower.includes('tasa') || lower.includes('interés') || lower.includes('interes')) {
    return {
      content:
        'Tu tasa promedio ponderada es **2.5%/mes**. La Visa Bancolombia es la más alta con 3.1%. Eliminarla primero te ahorra $47.000/mes en intereses.',
      tag: 'INFO',
    }
  }
  if (lower.includes('mejor plan') || lower.includes('mejor')) {
    return {
      content:
        'Tu plan actual es óptimo dado tu flujo de $1.24M. Si quieres acelerar, podrías destinar el bono de fin de año a la Visa Bancolombia y reducir 2 meses del plan total.',
    }
  }
  return {
    content:
      'Entendido. Basado en tu perfil financiero, recomiendo mantener el plan Avalancha activo. ¿Hay algún cambio en tus ingresos este mes que deba considerar para recalcular?',
  }
}

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
