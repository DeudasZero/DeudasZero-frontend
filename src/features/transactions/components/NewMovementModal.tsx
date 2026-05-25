import { useState, useRef, useEffect, type FC, type KeyboardEvent } from 'react'
import type { NewTransactionForm, TxType } from '../types/transactions.types.ts'

const INCOME_SOURCES = ['Salario', 'Freelance', 'Otros'] as const
type IncomeSource = (typeof INCOME_SOURCES)[number]

interface NewMovementModalProps {
  open: boolean
  onClose: () => void
  onSave: (form: NewTransactionForm) => void
  isSaving?: boolean
  saveError?: string | null
  defaultType?: TxType
}

function today() {
  return new Date().toISOString().split('T')[0]!
}

function formatDisplay(raw: string): string {
  const n = parseInt(raw.replace(/\D/g, ''), 10)
  if (!n) return ''
  return new Intl.NumberFormat('es-CO').format(n)
}

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const SpinnerIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    style={{ animation: 'spin 0.8s linear infinite' }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="40"
      strokeDashoffset="10"
      strokeLinecap="round"
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
)

const ModalContent: FC<Omit<NewMovementModalProps, 'open'>> = ({
  onClose,
  onSave,
  isSaving = false,
  saveError,
  defaultType = 'income',
}) => {
  const [type, setType] = useState<TxType>(defaultType)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState<IncomeSource>('Salario')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today())
  const dialogRef = useRef<HTMLDivElement>(null)

  const isIncome = type === 'income'
  const amountColor = isIncome ? 'rgb(94,225,230)' : 'rgb(224,122,156)'

  function handleTypeChange(next: TxType) {
    setType(next)
    setSource('Salario')
    setDescription('')
  }

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const amountRaw = amount.replace(/\D/g, '')
  const isValid =
    amountRaw.length > 0 &&
    parseInt(amountRaw, 10) > 0 &&
    (isIncome || description.trim().length > 0)

  function handleAmountKey(e: KeyboardEvent<HTMLInputElement>) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
    if (allowed.includes(e.key)) return
    if (!/\d/.test(e.key)) e.preventDefault()
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value.replace(/\D/g, ''))
  }

  function handleSave() {
    if (!isValid || isSaving) return
    const base = {
      type,
      amount: amountRaw,
      description: description.trim() || (isIncome ? source : ''),
      date,
    }
    const form: NewTransactionForm = isIncome ? { ...base, source } : base
    onSave(form)
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleBackdropKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') onClose()
  }

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgb(8,13,18)',
    border: '1px solid rgba(220,235,255,0.08)',
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'var(--dz-font-sans)',
    fontSize: '13px',
    color: 'rgb(232,238,245)',
    boxSizing: 'border-box',
    cursor: 'pointer',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgb(8,13,18)',
    border: '1px solid rgba(220,235,255,0.08)',
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'var(--dz-font-sans)',
    fontSize: '13px',
    color: 'rgb(232,238,245)',
    boxSizing: 'border-box',
  }

  const fieldLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--dz-font-mono)',
    fontSize: '10px',
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: 'var(--dz-text-faint)',
    marginBottom: '8px',
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Cerrar modal"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKey}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        background: 'rgba(8,13,18,0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Nuevo movimiento"
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgb(20,28,36)',
          borderRadius: '14px',
          border: '1px solid rgba(220,235,255,0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px 12px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: 'var(--dz-text-faint)',
            }}
          >
            Nuevo movimiento
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--dz-text-faint)',
              lineHeight: 0,
              padding: '4px',
            }}
          >
            <XIcon />
          </button>
        </div>

        {/* Type toggle: Ingreso / Gasto */}
        <div style={{ display: 'flex', gap: '6px', padding: '0 20px 20px' }}>
          {(['income', 'expense'] as TxType[]).map((t) => {
            const active = type === t
            const label = t === 'income' ? 'Ingreso' : 'Gasto'
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                aria-pressed={active}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: active
                    ? t === 'income'
                      ? 'rgba(94,225,230,0.15)'
                      : 'rgba(224,122,156,0.15)'
                    : 'rgba(220,235,255,0.06)',
                  color: active
                    ? t === 'income'
                      ? 'rgb(94,225,230)'
                      : 'rgb(224,122,156)'
                    : 'var(--dz-text-faint)',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Monto */}
        <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
          <div style={fieldLabelStyle}>MONTO</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--dz-font-display)',
                fontSize: '40px',
                fontWeight: 500,
                color: amountColor,
                lineHeight: 1,
              }}
            >
              $
            </span>
            <input
              id="modal-amount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={formatDisplay(amount)}
              onChange={handleAmountChange}
              onKeyDown={handleAmountKey}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--dz-font-display)',
                fontSize: '40px',
                fontWeight: 500,
                color: amountColor,
                width: '250px',
                textAlign: 'center',
                caretColor: amountColor,
                fontVariantNumeric: 'tabular-nums',
              }}
            />
          </div>
        </div>

        <div
          style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {isIncome && (
            <div>
              <label htmlFor="modal-source" style={fieldLabelStyle}>
                FUENTE
              </label>
              <select
                id="modal-source"
                value={source}
                onChange={(e) => setSource(e.target.value as IncomeSource)}
                style={selectStyle}
              >
                {INCOME_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Descripción / nombre */}
          <div>
            <label htmlFor="modal-description" style={fieldLabelStyle}>
              {isIncome ? 'DESCRIPCIÓN (OPCIONAL)' : 'DESCRIPCIÓN'}
            </label>
            <input
              id="modal-description"
              type="text"
              placeholder={isIncome ? 'Ej: Salario julio' : 'Ej: Almuerzo equipo'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
              style={inputStyle}
            />
          </div>

          {/* Fecha — visible para ambos tipos */}
          {!isIncome && (
            <div>
              <label htmlFor="modal-date" style={fieldLabelStyle}>
                FECHA
              </label>
              <input
                id="modal-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={today()}
                style={{ ...inputStyle, colorScheme: 'dark' } as React.CSSProperties}
              />
            </div>
          )}
        </div>

        {/* Error de guardado */}
        {saveError && (
          <div
            role="alert"
            style={{
              margin: '0 20px 12px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(224,122,156,0.1)',
              border: '1px solid rgba(224,122,156,0.25)',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '12.5px',
              color: 'rgb(224,122,156)',
            }}
          >
            {saveError}
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            padding: '0 20px 20px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              height: '48px',
              background: 'transparent',
              border: '1px solid rgba(220,235,255,0.1)',
              borderRadius: '8px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgb(172,183,196)',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid || isSaving}
            aria-busy={isSaving}
            style={{
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: !isValid || isSaving ? 'rgba(94,225,230,0.3)' : 'rgb(94,225,230)',
              border: 'none',
              borderRadius: '8px',
              cursor: !isValid || isSaving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'rgb(13,20,25)',
              transition: 'opacity 0.15s',
            }}
          >
            {isSaving && <SpinnerIcon />}
            {isSaving ? 'Guardando…' : isIncome ? 'Guardar ingreso' : 'Guardar gasto'}
          </button>
        </div>
      </div>
    </div>
  )
}

export const NewMovementModal: FC<NewMovementModalProps> = ({ open, ...props }) => {
  if (!open) return null
  return <ModalContent key={String(open)} {...props} />
}
