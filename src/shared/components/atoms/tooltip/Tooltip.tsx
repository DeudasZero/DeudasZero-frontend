import { useRef, useState } from 'react'
import type { CSSProperties, FC } from 'react'
import type { TooltipProps, TooltipPlacement } from './Tooltip.types.ts'

const PLACEMENT_STYLE: Record<TooltipPlacement, CSSProperties> = {
  top: { bottom: 'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)' },
  bottom: { top: 'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)' },
  left: { right: 'calc(100% + 7px)', top: '50%', transform: 'translateY(-50%)' },
  right: { left: 'calc(100% + 7px)', top: '50%', transform: 'translateY(-50%)' },
}

export const Tooltip: FC<TooltipProps> = ({
  content,
  placement = 'top',
  delay = 0,
  children,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function show() {
    if (disabled) return
    timer.current = setTimeout(() => setVisible(true), delay)
  }

  function hide() {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    setVisible(false)
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: 'absolute',
          zIndex: 1000,
          pointerEvents: 'none',
          background: 'var(--dz-bg-raised)',
          border: '1px solid var(--dz-border-base)',
          borderRadius: 'var(--dz-r-xs)',
          padding: '5px 9px',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--dz-text-secondary)',
          letterSpacing: '-0.005em',
          whiteSpace: 'nowrap',
          opacity: visible ? 1 : 0,
          transition: 'opacity var(--dz-transition-fast)',
          boxShadow: 'var(--dz-shadow-md)',
          ...PLACEMENT_STYLE[placement],
        }}
      >
        {content}
      </span>
    </span>
  )
}
