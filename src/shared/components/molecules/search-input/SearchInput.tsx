import { useId, useRef, useState } from 'react'
import type { FC } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { SearchIcon, ClearIcon } from '@/assets/icons/index.ts'
import type { SearchInputProps } from './SearchInput.types.ts'

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar…',
  loading = false,
  disabled = false,
  fullWidth = false,
  id: externalId,
  className,
}) => {
  const autoId = useId()
  const id = externalId ?? autoId
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClear() {
    onChange('')
    onClear?.()
    inputRef.current?.focus()
  }

  const borderColor = focused ? 'var(--dz-border-focus)' : 'var(--dz-border-base)'

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '40px',
        padding: '0 12px',
        background: 'var(--dz-bg-sunken)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--dz-r-pill)',
        transition: 'border-color var(--dz-transition-fast)',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.45 : 1,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          lineHeight: 0,
          color: focused ? 'var(--dz-signature)' : 'var(--dz-text-muted)',
          transition: 'color var(--dz-transition-fast)',
        }}
      >
        {loading ? <SpinnerMini /> : <Icon as={SearchIcon} size={16} />}
      </span>

      <input
        ref={inputRef}
        id={id}
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-body)',
          color: 'var(--dz-text-primary)',
          letterSpacing: 'var(--dz-ls-normal)',
          minWidth: 0,
          /* remove native search clear button */
          WebkitAppearance: 'none',
        }}
      />

      {value.length > 0 && !disabled && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={handleClear}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--dz-bg-raised)',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            color: 'var(--dz-text-muted)',
            transition: 'background var(--dz-transition-fast)',
            padding: 0,
          }}
        >
          <Icon as={ClearIcon} size={14} />
        </button>
      )}
    </div>
  )
}

function SpinnerMini() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'dz-spin .7s linear infinite' }}
    >
      <style>{`@keyframes dz-spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity=".2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
