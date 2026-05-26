import type { FC } from 'react'
import type { ChatMessage } from '../types/plan-ia.types.ts'

function parseBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} style={{ color: 'var(--dz-text-primary)', fontWeight: 700 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}

export const MessageBubble: FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isAI = msg.role === 'ai'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isAI ? 'flex-start' : 'flex-end',
        gap: '4px',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          maxWidth: '88%',
          padding: '10px 13px',
          borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
          background: isAI ? 'var(--dz-bg-raised)' : 'var(--dz-signature)',
          color: isAI ? 'var(--dz-text-secondary)' : 'var(--dz-bg-page)',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: '13.5px',
          lineHeight: 1.55,
          fontWeight: isAI ? 400 : 500,
          whiteSpace: 'pre-wrap',
        }}
      >
        {isAI ? parseBold(msg.content) : msg.content}
      </div>
      <div
        style={{
          fontFamily: 'var(--dz-font-mono)',
          fontSize: '10px',
          color: 'var(--dz-text-faint)',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {isAI && '★ IA '}
        {msg.timestamp}
        {msg.tag && (
          <span style={{ color: 'var(--dz-signature)', fontWeight: 600, letterSpacing: '0.1em' }}>
            · {msg.tag}
          </span>
        )}
      </div>
    </div>
  )
}
