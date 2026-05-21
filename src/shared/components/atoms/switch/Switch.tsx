import { useId } from 'react'
import type { FC } from 'react'
import type { SwitchProps, SwitchSize } from './Switch.types.ts'

const TRACK: Record<SwitchSize, { w: number; h: number }> = {
  sm: { w: 32, h: 18 },
  md: { w: 40, h: 22 },
}

export const Switch: FC<SwitchProps> = ({
  checked = false,
  onChange,
  label,
  hint,
  disabled = false,
  size = 'md',
  id: externalId,
}) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const { w, h } = TRACK[size]
  const thumbSz = h - 4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ position: 'relative', lineHeight: 0, flexShrink: 0 }}>
          <input
            type="checkbox"
            role="switch"
            id={id}
            checked={checked}
            disabled={disabled}
            aria-checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              margin: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
          <span
            aria-hidden
            style={{
              display: 'block',
              width: `${w}px`,
              height: `${h}px`,
              borderRadius: 'var(--dz-r-pill)',
              background: checked ? 'var(--dz-signature)' : 'var(--dz-border-strong)',
              position: 'relative',
              transition: 'background var(--dz-transition-fast)',
              opacity: disabled ? 0.45 : 1,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: checked ? `${w - thumbSz - 2}px` : '2px',
                width: `${thumbSz}px`,
                height: `${thumbSz}px`,
                borderRadius: '50%',
                background: 'white',
                transition: 'left var(--dz-transition-fast)',
                boxShadow: '0 1px 3px rgba(0,0,0,.25)',
              }}
            />
          </span>
        </span>

        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: 'var(--dz-fs-body)',
              color: 'var(--dz-text-primary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.45 : 1,
            }}
          >
            {label}
          </label>
        )}
      </div>

      {hint && (
        <span
          style={{
            fontSize: '12px',
            color: 'var(--dz-text-muted)',
            paddingLeft: `${w + 10}px`,
          }}
        >
          {hint}
        </span>
      )}
    </div>
  )
}
