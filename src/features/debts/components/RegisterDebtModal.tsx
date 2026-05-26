import { useState, useEffect, useCallback, type FC, type FormEvent } from 'react'
import { Icon } from '@atoms/icon/Icon.tsx'
import { XIcon, CardIcon, LoanIcon } from '@/assets/icons/index.ts'
import { Input } from '@atoms/input/Input.tsx'
import { Button } from '@atoms/button/Button.tsx'
import { Alert } from '@/shared/components/molecules/alert/index.ts'
import type { DebtKind, ApiDebtType, DebtFormValues, DebtFormErrors } from '../types/debts.types.ts'

function calcPreview(balance: number, monthlyRate: number, minPayment: number) {
  const interest = Math.round((balance * monthlyRate) / 100)
  const monthsOnly =
    minPayment > 0 && minPayment > interest
      ? Math.ceil(Math.log(minPayment / (minPayment - interest)) / Math.log(1 + monthlyRate / 100))
      : 0
  const eaRate = ((1 + monthlyRate / 100) ** 12 - 1) * 100
  return {
    interest,
    monthsOnly: isFinite(monthsOnly) ? monthsOnly : 999,
    eaRate: +eaRate.toFixed(1),
  }
}

function fmtNum(n: number) {
  return new Intl.NumberFormat('es-CO').format(Math.round(n))
}

interface PreviewPanelProps {
  balance: number
  monthlyRate: number
  minPayment: number
  kind: DebtKind
}

const PreviewPanel: FC<PreviewPanelProps> = ({ balance, monthlyRate, minPayment, kind }) => {
  const { interest, monthsOnly, eaRate } = calcPreview(balance, monthlyRate, minPayment)
  if (interest === 0) return null

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-[8px]"
      style={{ background: 'rgb(8,13,18)', border: '1px solid rgba(220,235,255,0.06)' }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: '9.5px', letterSpacing: '1.33px', color: 'var(--dz-text-faint)' }}
      >
        VISTA PREVIA · CÁLCULO ESTIMADO
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
            ${fmtNum(interest)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
          >
            {kind === 'card' ? 'SI PAGAS SOLO MÍNIMO' : 'TASA E.A.'}
          </span>
          <span
            className="font-sans"
            style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
          >
            {kind === 'card' ? (monthsOnly > 0 ? `~${monthsOnly} meses` : '—') : `${eaRate}%`}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="font-mono uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.9px', color: 'var(--dz-text-faint)' }}
          >
            TASA E.A.
          </span>
          <span
            className="font-sans"
            style={{ fontSize: '17px', fontWeight: 600, color: 'var(--dz-text-primary)' }}
          >
            {eaRate}%
          </span>
        </div>
      </div>
    </div>
  )
}

interface RegisterDebtModalProps {
  open: boolean
  onClose: () => void
  onSave: (values: DebtFormValues) => void
  initialValues?: DebtFormValues
  isSaving?: boolean
  saveError?: string | null
  defaultKind?: DebtKind
}

const KIND_TO_API: Record<DebtKind, ApiDebtType> = { card: 'CARD', loan: 'LOAN' }
const API_TO_KIND: Record<ApiDebtType, DebtKind> = { CARD: 'card', LOAN: 'loan' }

const EMPTY_FORM: DebtFormValues = {
  name: '',
  type: 'CARD',
  balance: '',
  monthlyRate: '',
  minPayment: '',
}

export const RegisterDebtModal: FC<RegisterDebtModalProps> = ({
  open,
  onClose,
  onSave,
  initialValues,
  isSaving = false,
  saveError,
  defaultKind = 'card',
}) => {
  const isEditMode = initialValues !== undefined

  const initKind: DebtKind = initialValues ? API_TO_KIND[initialValues.type] : defaultKind

  const [kind, setKind] = useState<DebtKind>(initKind)
  const [values, setValues] = useState<DebtFormValues>(
    initialValues ?? { ...EMPTY_FORM, type: KIND_TO_API[initKind] },
  )
  const [errors, setErrors] = useState<DebtFormErrors>({})

  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) {
      const nextKind = initialValues ? API_TO_KIND[initialValues.type] : defaultKind
      setKind(nextKind)
      setValues(initialValues ?? { ...EMPTY_FORM, type: KIND_TO_API[nextKind] })
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

  function handleKindChange(next: DebtKind) {
    if (isEditMode) return
    setKind(next)
    setValues({ ...EMPTY_FORM, type: KIND_TO_API[next] })
    setErrors({})
  }

  function setField(key: keyof DebtFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function validate(): DebtFormErrors {
    const errs: DebtFormErrors = {}
    if (!values.name.trim()) errs.name = 'Requerido'
    if (!values.balance || Number(values.balance) <= 0) errs.balance = 'Ingresa un saldo válido'
    if (!values.monthlyRate || Number(values.monthlyRate) <= 0)
      errs.monthlyRate = 'Ingresa la tasa mensual'
    if (!values.minPayment || Number(values.minPayment) <= 0)
      errs.minPayment = 'Ingresa el pago mínimo'
    return errs
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave(values)
  }

  const eaRate =
    values.monthlyRate && Number(values.monthlyRate) > 0
      ? (((1 + Number(values.monthlyRate) / 100) ** 12 - 1) * 100).toFixed(1)
      : null

  const modalTitle = isEditMode
    ? kind === 'card'
      ? 'Editar tarjeta'
      : 'Editar crédito'
    : kind === 'card'
      ? 'Nueva tarjeta'
      : 'Nuevo crédito'

  const submitLabel = isSaving
    ? 'Guardando…'
    : isEditMode
      ? 'Guardar cambios'
      : kind === 'card'
        ? 'Registrar tarjeta'
        : 'Registrar crédito'

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
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        style={{ all: 'unset', display: 'contents' }}
      >
        <div
          role="dialog"
          aria-modal
          aria-label={modalTitle}
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
              {modalTitle}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--dz-text-faint)',
                padding: '4px',
                lineHeight: 0,
              }}
            >
              <Icon as={XIcon} size={16} />
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
                    onClick={() => handleKindChange(k)}
                    disabled={isEditMode}
                    className="flex items-center gap-2 flex-1 justify-center rounded-[6px] font-sans font-semibold transition-all"
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      background: active ? 'rgb(20,28,36)' : 'transparent',
                      color: active ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
                      border: 'none',
                      cursor: isEditMode ? 'default' : 'pointer',
                      opacity: isEditMode && !active ? 0.4 : 1,
                    }}
                  >
                    {k === 'card' ? (
                      <Icon as={CardIcon} size={14} />
                    ) : (
                      <Icon as={LoanIcon} size={14} />
                    )}
                    {k === 'card' ? 'Tarjeta de crédito' : 'Crédito / préstamo'}
                  </button>
                )
              })}
            </div>

            {saveError && <Alert variant="danger">{saveError}</Alert>}

            <div className="flex flex-col gap-4">
              <Input
                label={kind === 'card' ? 'Nombre de la tarjeta' : 'Nombre del crédito'}
                placeholder={kind === 'card' ? 'Visa Bancolombia' : 'Crédito libre inversión'}
                value={values.name}
                onChange={setField('name')}
                error={errors.name ?? ''}
                fullWidth
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Saldo actual"
                  type="number"
                  placeholder={kind === 'card' ? '1500000' : '6800000'}
                  value={values.balance}
                  onChange={setField('balance')}
                  error={errors.balance ?? ''}
                  prefix="$"
                  suffix="COP"
                  fullWidth
                />
                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Tasa de interés mensual"
                    type="number"
                    step="0.01"
                    placeholder={kind === 'card' ? '3.1' : '1.8'}
                    value={values.monthlyRate}
                    onChange={setField('monthlyRate')}
                    error={errors.monthlyRate ?? ''}
                    suffix="%"
                    fullWidth
                  />
                  {eaRate && (
                    <span
                      className="font-mono"
                      style={{ fontSize: '11px', color: 'var(--dz-text-faint)' }}
                    >
                      Equivalente E.A.: {eaRate}%
                    </span>
                  )}
                </div>
              </div>

              <Input
                label={kind === 'card' ? 'Pago mínimo mensual' : 'Cuota mensual'}
                type="number"
                placeholder={kind === 'card' ? '75000' : '410000'}
                value={values.minPayment}
                onChange={setField('minPayment')}
                error={errors.minPayment ?? ''}
                prefix="$"
                suffix="COP"
                fullWidth
              />
            </div>

            {Number(values.balance) > 0 && Number(values.monthlyRate) > 0 && (
              <PreviewPanel
                balance={Number(values.balance)}
                monthlyRate={Number(values.monthlyRate)}
                minPayment={Number(values.minPayment)}
                kind={kind}
              />
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                fullWidth
                onClick={onClose}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSaving}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </button>
    </button>
  )
}
