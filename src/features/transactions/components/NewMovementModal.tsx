import { useState, useRef, useEffect, type FC, type KeyboardEvent } from 'react'
import type { NewTransactionForm, TxCategory, TxType } from '../types/transactions.types.ts'

const EXPENSE_CATS: TxCategory[] = [
  'Vivienda',
  'Alimentos',
  'Servicios',
  'Transporte',
  'Ocio',
  'Otros',
]
const INCOME_CATS: TxCategory[] = ['Salario', 'Freelance', 'Otros']

interface NewMovementModalProps {
  open: boolean
  onClose: () => void
  onSave: (form: NewTransactionForm) => void
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

const ModalContent: FC<Omit<NewMovementModalProps, 'open'>> = ({
  onClose,
  onSave,
  defaultType = 'income',
}) => {
  const [type, setType] = useState<TxType>(defaultType)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<TxCategory | ''>('')
  const [name, setName] = useState('')
  const [date, setDate] = useState(today())
  const dialogRef = useRef<HTMLDivElement>(null)

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

  const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS
  const amountColor = type === 'income' ? 'rgb(94,225,230)' : 'rgb(224,122,156)'
  const isIncome = type === 'income'

  function handleSave() {
    if (!amount || !category) return
    onSave({ type, amount, category: category as TxCategory, name, date })
    onClose()
  }

  function handleAmountKey(e: KeyboardEvent<HTMLInputElement>) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
    if (allowed.includes(e.key)) return
    if (!/\d/.test(e.key)) e.preventDefault()
  }

  function handleBackdropKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') onClose()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Cerrar modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
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
              color: 'rgb(110,121,134)',
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
              color: 'rgb(110,121,134)',
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
                onClick={() => {
                  setType(t)
                  setCategory('')
                }}
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
                    : 'rgb(110,121,134)',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Amount */}
        <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
          <div
            style={{
              color: 'rgb(110,121,134)',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '13px',
              marginBottom: '8px',
            }}
          >
            MONTO
          </div>
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
              type="text"
              inputMode="numeric"
              placeholder="0"
              aria-label="Monto del movimiento"
              value={formatDisplay(amount)}
              onKeyDown={handleAmountKey}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              style={{
                fontFamily: 'var(--dz-font-display)',
                fontSize: '80px',
                fontWeight: 500,
                letterSpacing: '-2.4px',
                color: amountColor,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                textAlign: 'center',
                width: '100%',
                lineHeight: 1,
                caretColor: amountColor,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '12px',
              color: 'rgb(110,121,134)',
              marginTop: '6px',
            }}
          >
            Pesos colombianos
          </div>
        </div>

        {/* Category pills */}
        <div style={{ padding: '0 20px 16px' }}>
          <div
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10px',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: 'rgb(110,121,134)',
              marginBottom: '10px',
            }}
          >
            CATEGORÍA
          </div>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
            role="group"
            aria-label="Categorías"
          >
            {cats.map((cat) => {
              const active = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  aria-pressed={active}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    transition: 'all 0.15s',
                    background: active
                      ? isIncome
                        ? 'rgba(94,225,230,0.14)'
                        : 'rgba(224,122,156,0.14)'
                      : 'rgb(8,13,18)',
                    color: active
                      ? isIncome
                        ? 'rgb(94,225,230)'
                        : 'rgb(224,122,156)'
                      : 'rgb(172,183,196)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Description + Date row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '10px',
            padding: '0 20px 24px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '10px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: 'rgb(110,121,134)',
                marginBottom: '8px',
              }}
            >
              DESCRIPCIÓN
            </div>
            <input
              type="text"
              placeholder={isIncome ? 'Ej: Salario julio' : 'Ej: Almuerzo equipo'}
              aria-label="Descripción del movimiento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={
                {
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
                } as React.CSSProperties
              }
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '10px',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: 'rgb(110,121,134)',
                marginBottom: '8px',
              }}
            >
              FECHA
            </div>
            <input
              type="date"
              aria-label="Fecha del movimiento"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={
                {
                  padding: '10px 12px',
                  background: 'rgb(8,13,18)',
                  border: '1px solid rgba(220,235,255,0.08)',
                  borderRadius: '8px',
                  outline: 'none',
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: '13px',
                  color: 'rgb(232,238,245)',
                  colorScheme: 'dark',
                } as React.CSSProperties
              }
            />
          </div>
        </div>

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
            style={{
              height: '48px',
              background: 'transparent',
              border: '1px solid rgba(220,235,255,0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
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
            disabled={!amount || !category}
            aria-disabled={!amount || !category}
            style={{
              height: '48px',
              background: !amount || !category ? 'rgba(94,225,230,0.3)' : 'rgb(94,225,230)',
              border: 'none',
              borderRadius: '8px',
              cursor: !amount || !category ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'rgb(13,20,25)',
              transition: 'opacity 0.15s',
            }}
          >
            {isIncome ? 'Guardar ingreso' : 'Guardar gasto'}
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
