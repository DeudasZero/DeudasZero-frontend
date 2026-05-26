import { useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister.ts'
import { Spinner } from '@shared/components/atoms/spinner/Spinner.tsx'
import { FormField } from '@molecules/form-field/FormField.tsx'
import type { RegisterCredentials } from '../types/auth.types.ts'

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="8" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M2 2l12 12M6.8 6.9A1.75 1.75 0 0 0 9.1 9.2M4.3 4.4C2.7 5.4 1.5 8 1.5 8s2.5 4.5 6.5 4.5c1.4 0 2.7-.4 3.7-1.1M7 3.6c.33-.07.66-.1 1-.1 4 0 6.5 4.5 6.5 4.5s-.5 1-1.4 2"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
)

interface PasswordStrength {
  score: number
  label: string
  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return { score: 0, label: '', color: 'transparent' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels: PasswordStrength[] = [
    { score: 1, label: 'MUY DÉBIL', color: '#ef4444' },
    { score: 2, label: 'DÉBIL', color: '#f97316' },
    { score: 3, label: 'BUENA', color: '#eab308' },
    { score: 4, label: 'FUERTE', color: '#5EE1E6' },
  ]

  return levels[score - 1] ?? { score: 0, label: '', color: 'transparent' }
}

const inputBase: React.CSSProperties = {
  width: '100%',
  height: '46px',
  padding: '0 14px',
  background: 'var(--dz-bg-card)',
  border: '1px solid var(--dz-border-soft)',
  borderRadius: '10px',
  fontFamily: 'var(--dz-font-sans)',
  fontSize: 'var(--dz-fs-body)',
  color: 'var(--dz-text-primary)',
  outline: 'none',
  transition: 'border-color var(--dz-transition-fast)',
}

export const RegisterForm = () => {
  const formId = useId()
  const nameId = `${formId}-name`
  const emailId = `${formId}-email`
  const passwordId = `${formId}-password`

  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, error, handleRegister, dismissError } = useRegister()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterCredentials>({ mode: 'onBlur' })

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })
  const strength = getPasswordStrength(passwordValue)

  const { onBlur: nameBlur, ...nameField } = register('name', {
    required: 'El nombre es requerido',
    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
  })
  const { onBlur: emailBlur, ...emailField } = register('email', {
    required: 'El correo es requerido',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
  })
  const { onBlur: passwordBlur, ...passwordField } = register('password', {
    required: 'La contraseña es requerida',
    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[0-9])/,
      message: 'Debe incluir al menos una mayúscula y un número',
    },
  })

  const onSubmit = (data: RegisterCredentials) => handleRegister(data)

  return (
    <div className="w-full max-w-100 flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h1
          className="text-2xl font-semibold"
          style={{
            fontFamily: 'var(--dz-font-sans)',
            color: 'var(--dz-text-primary)',
            letterSpacing: 'var(--dz-ls-snug)',
          }}
        >
          Empieza a liquidar tus deudas
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: 'var(--dz-font-sans)', color: 'var(--dz-text-secondary)' }}
        >
          Toma 30 segundos. No pedimos datos bancarios.
        </p>
      </div>

      {error && (
        <div
          className="flex items-start justify-between gap-3 rounded-xl px-4 py-3"
          style={{
            background: 'color-mix(in srgb, var(--dz-expense) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--dz-expense) 25%, transparent)',
          }}
          role="alert"
        >
          <p
            className="text-sm"
            style={{ fontFamily: 'var(--dz-font-sans)', color: 'var(--dz-expense)' }}
          >
            {error}
          </p>
          <button
            type="button"
            onClick={dismissError}
            aria-label="Cerrar error"
            className="mt-0.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            style={{
              color: 'var(--dz-expense)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Nombre completo" htmlFor={nameId} error={errors.name?.message ?? ''}>
          <input
            id={nameId}
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            style={{
              ...inputBase,
              borderColor: errors.name ? 'var(--dz-expense)' : 'var(--dz-border-soft)',
            }}
            {...nameField}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--dz-signature)'
            }}
            onBlur={(e) => {
              void nameBlur(e)
              e.currentTarget.style.borderColor = errors.name
                ? 'var(--dz-expense)'
                : 'var(--dz-border-soft)'
            }}
          />
        </FormField>

        <FormField label="Correo electrónico" htmlFor={emailId} error={errors.email?.message ?? ''}>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            style={{
              ...inputBase,
              borderColor: errors.email ? 'var(--dz-expense)' : 'var(--dz-border-soft)',
            }}
            {...emailField}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--dz-signature)'
            }}
            onBlur={(e) => {
              void emailBlur(e)
              e.currentTarget.style.borderColor = errors.email
                ? 'var(--dz-expense)'
                : 'var(--dz-border-soft)'
            }}
          />
        </FormField>

        <FormField label="Contraseña" htmlFor={passwordId} error={errors.password?.message ?? ''}>
          <div className="relative">
            <input
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              style={{
                ...inputBase,
                paddingRight: '44px',
                borderColor: errors.password ? 'var(--dz-expense)' : 'var(--dz-border-soft)',
              }}
              {...passwordField}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--dz-signature)'
              }}
              onBlur={(e) => {
                void passwordBlur(e)
                e.currentTarget.style.borderColor = errors.password
                  ? 'var(--dz-expense)'
                  : 'var(--dz-border-soft)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center opacity-60 hover:opacity-100 transition-opacity"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--dz-text-muted)',
                padding: 0,
                lineHeight: 0,
              }}
            >
              {showPassword ? <EyeClosed /> : <EyeOpen />}
            </button>
          </div>
          {passwordValue.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-0.5">
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="flex-1 rounded-full transition-all duration-300"
                    style={{
                      background: bar <= strength.score ? strength.color : 'var(--dz-border-soft)',
                    }}
                  />
                ))}
              </div>
              {strength.label && (
                <p
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    color: strength.color,
                    letterSpacing: 'var(--dz-ls-eyebrow)',
                  }}
                >
                  FUERZA · {strength.label}
                </p>
              )}
            </div>
          )}
        </FormField>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex items-center justify-center gap-2 h-11.5 w-full rounded-xl font-medium text-sm transition-opacity disabled:opacity-60"
          style={{
            fontFamily: 'var(--dz-font-sans)',
            background: 'var(--dz-signature)',
            color: 'var(--dz-bg-page)',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            letterSpacing: 'var(--dz-ls-snug)',
          }}
        >
          {isLoading ? <Spinner size="sm" /> : 'Crear cuenta'}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <p
          className="text-xs text-center leading-relaxed"
          style={{ fontFamily: 'var(--dz-font-sans)', color: 'var(--dz-text-faint)' }}
        >
          Al continuar aceptas los{' '}
          <span style={{ color: 'var(--dz-signature)', cursor: 'pointer' }}>Términos</span> y la{' '}
          <span style={{ color: 'var(--dz-signature)', cursor: 'pointer' }}>
            Política de privacidad
          </span>
          . Tu información se guarda cifrada y nunca se comparte.
        </p>

        <p
          className="text-sm text-center"
          style={{ fontFamily: 'var(--dz-font-sans)', color: 'var(--dz-text-secondary)' }}
        >
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-medium transition-opacity hover:opacity-80"
            style={{ color: 'var(--dz-signature)', textDecoration: 'none' }}
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
