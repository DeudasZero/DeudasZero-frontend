import { useEffect, useId, useRef } from 'react'
import type { FC } from 'react'
import type { CheckboxProps } from './Checkbox.types.ts'

export const Checkbox: FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  onChange,
  label,
  hint,
  error,
  disabled = false,
  id: externalId,
  name,
}) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const isActive = checked || indeterminate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span style={{ position: 'relative', lineHeight: 0, marginTop: '2px', flexShrink: 0 }}>
          <input
            ref={inputRef}
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            disabled={disabled}
            aria-invalid={Boolean(error) || undefined}
            onChange={(e) => onChange?.(e.target.checked)}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              margin: 0,
              cursor: 'inherit',
            }}
          />
          <span
            aria-hidden
            style={{
              width: '18px',
              height: '18px',
              borderRadius: 'var(--dz-r-xs)',
              border: `1.5px solid ${isActive ? 'var(--dz-signature)' : 'var(--dz-border-strong)'}`,
              background: isActive ? 'var(--dz-signature)' : 'var(--dz-bg-sunken)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition:
                'background var(--dz-transition-fast), border-color var(--dz-transition-fast)',
              opacity: disabled ? 0.45 : 1,
            }}
          >
            {isActive && (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                {indeterminate ? (
                  <path
                    d="M2.5 5.5h6"
                    stroke="var(--dz-bg-page)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M2 5.5l2.5 2.5L9 3"
                    stroke="var(--dz-bg-page)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            )}
          </span>
        </span>

        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: 'var(--dz-fs-body)',
              color: 'var(--dz-text-primary)',
              lineHeight: 'var(--dz-lh-body)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.45 : 1,
            }}
          >
            {label}
          </label>
        )}
      </div>

      {(error || hint) && (
        <span
          style={{
            fontSize: '12px',
            color: error ? 'var(--dz-expense)' : 'var(--dz-text-muted)',
            paddingLeft: '28px',
          }}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
