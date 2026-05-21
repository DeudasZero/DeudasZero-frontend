import { useId, useState } from 'react'
import type { ChangeEvent, FC } from 'react'
import type { AmountInputProps, AmountInputCurrency } from './AmountInput.types.ts'

const CURRENCY_SYMBOL: Record<AmountInputCurrency, string> = {
  COP: '$',
  USD: '$',
  EUR: '€',
}

export const AmountInput: FC<AmountInputProps> = ({
  value,
  onChange,
  currency = 'COP',
  label,
  hint,
  error,
  placeholder = '0',
  min,
  max,
  disabled = false,
  fullWidth = false,
  id: externalId,
}) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const [focused, setFocused] = useState(false)
  const hasError = Boolean(error)

  const borderColor = hasError
    ? 'var(--dz-expense)'
    : focused
      ? 'var(--dz-border-focus)'
      : 'var(--dz-border-base)'

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d.]/g, '')
    if (raw === '') {
      onChange('')
      return
    }
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) onChange(parsed)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-caption)',
            fontWeight: 500,
            color: 'var(--dz-text-secondary)',
            letterSpacing: '-0.005em',
            cursor: 'default',
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '48px',
          background: 'var(--dz-bg-sunken)',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 'var(--dz-r-sm)',
          transition: 'border-color var(--dz-transition-fast)',
          overflow: 'hidden',
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 12px',
            height: '100%',
            borderRight: '1px solid var(--dz-border-soft)',
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--dz-text-muted)',
            letterSpacing: '0.02em',
            userSelect: 'none',
            gap: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          {CURRENCY_SYMBOL[currency]}
          <span style={{ fontSize: '10px', opacity: 0.7 }}>{currency}</span>
        </span>

        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value === '' ? '' : String(value)}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={error || hint ? `${id}-desc` : undefined}
          min={min}
          max={max}
          style={{
            flex: 1,
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '0 14px',
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            color: hasError ? 'var(--dz-expense)' : 'var(--dz-text-primary)',
            textAlign: 'right',
          }}
        />
      </div>

      {(error || hint) && (
        <span
          id={`${id}-desc`}
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12px',
            color: error ? 'var(--dz-expense)' : 'var(--dz-text-muted)',
            lineHeight: 1.4,
          }}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
