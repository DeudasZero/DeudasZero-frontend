import { useState, useEffect, useCallback, type FC, type FormEvent } from 'react'
import { Input } from '@atoms/input/Input.tsx'
import { Button } from '@atoms/button/Button.tsx'
import type { DebtKind, CardFormValues, LoanFormValues } from '../types/debts.types.ts'

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const CardTabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
  </svg>
)
const LoanTabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

function calcCardPreview(balance: number, monthlyRate: number, minPayment: number) {
  const interest = Math.round((balance * monthlyRate) / 100)
  const monthsOnly =
    minPayment > 0 && minPayment > interest
      ? Math.ceil(Math.log(minPayment / (minPayment - interest)) / Math.log(1 + monthlyRate / 100))
      : 0
  const eaRate = ((1 + monthlyRate / 100) ** 12 - 1) * 100
  const scoreImpact = +(1.4).toFixed(1)
  return {
    interest,
    monthsOnly: isFinite(monthsOnly) ? monthsOnly : 999,
    eaRate: +eaRate.toFixed(1),
    scoreImpact,
  }
}

function calcLoanPreview(
  balance: number,
  monthlyRate: number,
  monthlyPayment: number,
  months: number,
) {
  const interest = Math.round((balance * monthlyRate) / 100)
  const eaRate = ((1 + monthlyRate / 100) ** 12 - 1) * 100
  const scoreImpact = 7.9
  void monthlyPayment
  return { interest, months, eaRate: +eaRate.toFixed(1), scoreImpact }
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-CO').format(Math.round(n))
}

interface PreviewProps {
  interestPerMonth: number
  metric2Label: string
  metric2Value: string
  scoreImpact: number
}

const PreviewPanel: FC<PreviewProps> = ({
  interestPerMonth,
  metric2Label,
  metric2Value,
  scoreImpact,
}) => (
  <div
    className="flex flex-col gap-4 p-4 rounded-[8px]"
    style={{ background: 'rgb(8,13,18)', border: '1px solid rgba(220,235,255,0.06)' }}
  >
    <span
      className="font-mono uppercase"
      style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
    >
      VISTA PREVIA · CÁLCULO BACKEND
    </span>
    <div className="grid grid-cols-3 gap-3">
      <div className="flex flex-col gap-1">
        <span
          className="font-mono uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
        >
          INTERÉS / MES
        </span>
        <span
          className="font-sans"
          style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-expense)' }}
        >
          {fmt(interestPerMonth)}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span
          className="font-mono uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
        >
          {metric2Label}
        </span>
        <span
          className="font-sans"
          style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
        >
          {metric2Value}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span
          className="font-mono uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
        >
          CONTRIBUCIÓN AL SCORE
        </span>
        <span
          className="font-sans"
          style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
        >
          +{scoreImpact} pts
        </span>
      </div>
    </div>
  </div>
)

interface RegisterDebtModalProps {
  open: boolean
  onClose: () => void
  onSaveCard?: (values: CardFormValues) => void
  onSaveLoan?: (values: LoanFormValues) => void
  defaultKind?: DebtKind
}

const EMPTY_CARD: CardFormValues = {
  name: '',
  balance: '',
  monthlyRate: '',
  minPayment: '',
  cutDay: '',
}
const EMPTY_LOAN: LoanFormValues = {
  name: '',
  balance: '',
  monthlyRate: '',
  monthlyPayment: '',
  remainingMonths: '',
  originalMonths: '',
}

export const RegisterDebtModal: FC<RegisterDebtModalProps> = ({
  open,
  onClose,
  onSaveCard,
  onSaveLoan,
  defaultKind = 'card',
}) => {
  const [kind, setKind] = useState<DebtKind>(defaultKind)
  const [card, setCard] = useState<CardFormValues>(EMPTY_CARD)
  const [loan, setLoan] = useState<LoanFormValues>(EMPTY_LOAN)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      setKind(defaultKind)
      setCard(EMPTY_CARD)
      setLoan(EMPTY_LOAN)
      setErrors({})
    }
  }

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [open, handleGlobalKeyDown])

  if (!open) return null

  const cardPreview =
    kind === 'card'
      ? calcCardPreview(+card.balance || 0, +card.monthlyRate || 0, +card.minPayment || 0)
      : null
  const loanPreview =
    kind === 'loan'
      ? calcLoanPreview(
          +loan.balance || 0,
          +loan.monthlyRate || 0,
          +loan.monthlyPayment || 0,
          +loan.remainingMonths || 0,
        )
      : null

  function setF<T>(setter: React.Dispatch<React.SetStateAction<T>>, key: keyof T) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key as string]
        return next
      })
    }
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (kind === 'card') {
      if (!card.name) errs['name'] = 'Requerido'
      if (!card.balance || +card.balance <= 0) errs['balance'] = 'Ingresa un saldo válido'
      if (!card.monthlyRate || +card.monthlyRate <= 0)
        errs['monthlyRate'] = 'Ingresa la tasa mensual'
    } else {
      if (!loan.name) errs['name'] = 'Requerido'
      if (!loan.balance || +loan.balance <= 0) errs['balance'] = 'Ingresa un saldo válido'
      if (!loan.monthlyRate || +loan.monthlyRate <= 0)
        errs['monthlyRate'] = 'Ingresa la tasa mensual'
    }
    return errs
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    if (kind === 'card') onSaveCard?.(card)
    else onSaveLoan?.(loan)
    onClose()
  }

  function handleDialogClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
  }

  return (
    <button
      type="button"
      aria-label="Cerrar modal"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 z-400 w-full"
      style={{
        background: 'rgba(8,13,18,0.72)',
        backdropFilter: 'blur(4px)',
        border: 'none',
        cursor: 'default',
      }}
    >
      <button
        type="button"
        aria-label="Contenido del modal"
        onClick={handleDialogClick}
        onKeyDown={(e) => e.stopPropagation()}
        style={{ all: 'unset', display: 'contents' }}
      >
        <div
          role="dialog"
          aria-modal
          aria-label={kind === 'card' ? 'Nueva tarjeta' : 'Nuevo crédito'}
          className="flex flex-col w-full max-w-130 rounded-[14px] overflow-hidden text-left"
          style={{
            background: 'rgb(20,28,36)',
            border: '1px solid rgba(220,235,255,0.08)',
            maxHeight: '90vh',
            overflowY: 'auto',
            cursor: 'auto',
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(220,235,255,0.06)' }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: '10px', letterSpacing: '1.4px', color: 'var(--dz-text-faint)' }}
            >
              {kind === 'card' ? 'Nueva tarjeta' : 'Nuevo crédito'}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex items-center justify-center"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--dz-text-faint)',
                padding: '4px',
              }}
            >
              <XIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-5">
            <div className="flex gap-1 p-1 rounded-[8px]" style={{ background: 'rgb(8,13,18)' }}>
              {(['card', 'loan'] as DebtKind[]).map((k) => {
                const active = kind === k
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setKind(k)
                      setErrors({})
                    }}
                    className="flex items-center gap-2 flex-1 justify-center rounded-[6px] font-sans font-semibold transition-all"
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      background: active ? 'rgb(20,28,36)' : 'transparent',
                      color: active ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {k === 'card' ? <CardTabIcon /> : <LoanTabIcon />}
                    {k === 'card' ? 'Tarjeta de crédito' : 'Crédito / préstamo'}
                  </button>
                )
              })}
            </div>

            {kind === 'card' && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Nombre de la tarjeta"
                  placeholder="Visa Bancolombia"
                  value={card.name}
                  onChange={setF(setCard, 'name')}
                  error={errors['name'] ?? ''}
                  fullWidth
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Saldo actual"
                    type="number"
                    placeholder="1500000"
                    value={card.balance}
                    onChange={setF(setCard, 'balance')}
                    error={errors['balance'] ?? ''}
                    prefix="$"
                    suffix="COP"
                    fullWidth
                  />
                  <div className="flex flex-col gap-1.5">
                    <Input
                      label="Tasa de interés mensual (rotativa)"
                      type="number"
                      step="0.01"
                      placeholder="3.1"
                      value={card.monthlyRate}
                      onChange={setF(setCard, 'monthlyRate')}
                      error={errors['monthlyRate'] ?? ''}
                      suffix="%"
                      fullWidth
                    />
                    {card.monthlyRate && +card.monthlyRate > 0 && (
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
                      >
                        Equivalente E.A.:{' '}
                        {(((1 + +card.monthlyRate / 100) ** 12 - 1) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Pago mínimo mensual"
                    type="number"
                    placeholder="75000"
                    value={card.minPayment}
                    onChange={setF(setCard, 'minPayment')}
                    prefix="$"
                    fullWidth
                  />
                  <Input
                    label="Día de corte"
                    type="number"
                    min={1}
                    max={31}
                    placeholder="15"
                    value={card.cutDay}
                    onChange={setF(setCard, 'cutDay')}
                    suffix="del mes"
                    fullWidth
                  />
                </div>
              </div>
            )}

            {kind === 'loan' && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Nombre del crédito"
                  placeholder="Crédito libre inversión"
                  value={loan.name}
                  onChange={setF(setLoan, 'name')}
                  error={errors['name'] ?? ''}
                  fullWidth
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Saldo actual"
                    type="number"
                    placeholder="6800000"
                    value={loan.balance}
                    onChange={setF(setLoan, 'balance')}
                    error={errors['balance'] ?? ''}
                    prefix="$"
                    suffix="COP"
                    fullWidth
                  />
                  <div className="flex flex-col gap-1.5">
                    <Input
                      label="Tasa de interés mensual"
                      type="number"
                      step="0.01"
                      placeholder="1.8"
                      value={loan.monthlyRate}
                      onChange={setF(setLoan, 'monthlyRate')}
                      error={errors['monthlyRate'] ?? ''}
                      suffix="%"
                      fullWidth
                    />
                    {loan.monthlyRate && +loan.monthlyRate > 0 && (
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
                      >
                        Equivalente E.A.:{' '}
                        {(((1 + +loan.monthlyRate / 100) ** 12 - 1) * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Cuota mensual"
                    type="number"
                    placeholder="410000"
                    value={loan.monthlyPayment}
                    onChange={setF(setLoan, 'monthlyPayment')}
                    prefix="$"
                    fullWidth
                  />
                  <div className="flex flex-col gap-1.5">
                    <Input
                      label="Plazo restante"
                      type="number"
                      placeholder="36"
                      value={loan.remainingMonths}
                      onChange={setF(setLoan, 'remainingMonths')}
                      suffix="meses"
                      fullWidth
                    />
                    {loan.originalMonths && (
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
                      >
                        De los {loan.originalMonths} originales
                      </span>
                    )}
                  </div>
                </div>
                <Input
                  label="Plazo original (opcional)"
                  type="number"
                  placeholder="60"
                  value={loan.originalMonths}
                  onChange={setF(setLoan, 'originalMonths')}
                  suffix="meses"
                  fullWidth
                />
              </div>
            )}

            {cardPreview && (cardPreview.interest > 0 || cardPreview.monthsOnly > 0) && (
              <PreviewPanel
                interestPerMonth={cardPreview.interest}
                metric2Label="SI PAGAS SOLO MÍNIMO"
                metric2Value={cardPreview.monthsOnly > 0 ? `~${cardPreview.monthsOnly} meses` : '—'}
                scoreImpact={cardPreview.scoreImpact}
              />
            )}
            {loanPreview && loanPreview.interest > 0 && (
              <PreviewPanel
                interestPerMonth={loanPreview.interest}
                metric2Label="PLAZO RESTANTE"
                metric2Value={loanPreview.months > 0 ? `${loanPreview.months} meses` : '—'}
                scoreImpact={loanPreview.scoreImpact}
              />
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button type="button" variant="ghost" size="lg" fullWidth onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                {kind === 'card' ? 'Registrar tarjeta' : 'Registrar crédito'}
              </Button>
            </div>
          </form>
        </div>
      </button>
    </button>
  )
}
