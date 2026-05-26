import { useState, useRef, useEffect, type FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { SendIcon, DotsIcon, RefreshIcon } from '@/assets/icons/index.ts'
import { QUICK_REPLIES } from '../utils/chat.utils.ts'
import type { ChatMessage } from '../types/plan-ia.types.ts'

interface AIAdvisorChatProps {
  messages: ChatMessage[]
  onSend: (text: string) => void
  isTyping?: boolean
  onReset?: () => void
}

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

const MessageBubble: FC<{ msg: ChatMessage }> = ({ msg }) => {
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

const TypingIndicator: FC = () => (
  <div style={{ display: 'flex', gap: '4px', padding: '10px 0', marginBottom: '8px' }}>
    <style>{`
      @keyframes dzTyping { 0%,80%,100%{transform:scale(1);opacity:.4} 40%{transform:scale(1.3);opacity:1} }
    `}</style>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--dz-text-faint)',
          animation: `dzTyping 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
)

export const AIAdvisorChat: FC<AIAdvisorChatProps> = ({
  messages,
  onSend,
  isTyping = false,
  onReset,
}) => {
  const [input, setInput] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function handleSend(text: string) {
    if (!text.trim() || isTyping) return
    onSend(text.trim())
    setInput('')
  }

  function handleReset() {
    onReset?.()
    setMenuOpen(false)
  }

  return (
    <div
      style={{
        width: '340px',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--dz-bg-surface)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--dz-border-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--dz-bg-raised)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--dz-signature)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--dz-bg-page)',
              flexShrink: 0,
            }}
          >
            IA
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--dz-text-primary)',
              }}
            >
              Consejero DeudaZero
            </p>
            <p
              style={{
                margin: '1px 0 0',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '9.5px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dz-text-faint)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--dz-signature)',
                  display: 'inline-block',
                }}
              />
              Responde sobre tus finanzas reales
            </p>
          </div>
        </div>

        {/* Dots button con dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: menuOpen ? 'var(--dz-text-secondary)' : '#fff',
              padding: '4px',
              borderRadius: 'var(--dz-r-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--dz-transition-fast)',
            }}
            aria-label="Opciones del chat"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Icon as={DotsIcon} size={15} />
          </button>

          {menuOpen && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />

              {/* Dropdown menu */}
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  background: 'var(--dz-bg-raised)',
                  border: '1px solid var(--dz-border-base)',
                  borderRadius: 'var(--dz-r-sm)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                  zIndex: 20,
                  minWidth: '164px',
                  overflow: 'hidden',
                }}
              >
                <button
                  role="menuitem"
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    padding: '9px 13px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: 'var(--dz-text-secondary)',
                    textAlign: 'left',
                    transition: 'background var(--dz-transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--dz-bg-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Icon as={RefreshIcon} size={13} />
                  Reiniciar chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          scrollBehavior: 'smooth',
          minHeight: '380px',
          maxHeight: '480px',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '12.5px',
              color: 'var(--dz-text-faint)',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            Genera tu plan para que el consejero IA pueda ayudarte.
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick replies */}
      <div
        style={{
          padding: '8px 14px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          borderTop: '1px solid var(--dz-border-soft)',
        }}
      >
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr.id}
            onClick={() => handleSend(qr.label)}
            disabled={isTyping}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--dz-r-pill)',
              border: '1px solid var(--dz-border-strong)',
              background: 'var(--dz-bg-raised)',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '11.5px',
              fontWeight: 500,
              color: 'var(--dz-text-secondary)',
              cursor: isTyping ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              opacity: isTyping ? 0.5 : 1,
              transition: 'border-color var(--dz-transition-fast), color var(--dz-transition-fast)',
            }}
          >
            {qr.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--dz-border-soft)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend(input)
            }
          }}
          placeholder="Pregunta sobre tu plan..."
          disabled={isTyping}
          style={{
            flex: 1,
            padding: '9px 12px',
            background: 'var(--dz-bg-raised)',
            border: '1px solid var(--dz-border-base)',
            borderRadius: 'var(--dz-r-sm)',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '13px',
            color: 'var(--dz-text-primary)',
            outline: 'none',
            transition: 'border-color var(--dz-transition-fast)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--dz-border-focus)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--dz-border-base)')}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          aria-label="Enviar mensaje"
          style={{
            width: '38px',
            height: '38px',
            flexShrink: 0,
            borderRadius: 'var(--dz-r-sm)',
            border: 'none',
            background: input.trim() && !isTyping ? 'var(--dz-signature)' : 'var(--dz-bg-raised)',
            color: input.trim() && !isTyping ? 'var(--dz-bg-page)' : 'var(--dz-text-faint)',
            cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--dz-transition-fast), color var(--dz-transition-fast)',
          }}
        >
          <Icon as={SendIcon} size={16} />
        </button>
      </div>
    </div>
  )
}
