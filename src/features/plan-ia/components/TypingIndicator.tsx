import type { FC } from 'react'

export const TypingIndicator: FC = () => (
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
