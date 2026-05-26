import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin.ts'
import { Spinner } from '@shared/components/atoms/spinner/Spinner.tsx'
import { FormField } from '@molecules/form-field/FormField.tsx'
import { Input } from '@atoms/input/Input.tsx'
import { Icon } from '@atoms/icon/Icon.tsx'
import { EyeOpenIcon, EyeClosedIcon, ArrowRightIcon } from '@/assets/icons/index.ts'
import type { LoginCredentials } from '../types/auth.types.ts'

export const LoginForm = () => {
  const emailId = useId()
  const passId = useId()
  const remId = useId()

  const [showPassword, setShowPassword] = useState(false)
  const { isLoading, error, handleLogin, dismissError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: 'var(--dz-fs-eyebrow)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 'var(--dz-ls-eyebrow)',
            color: 'var(--dz-text-muted)',
          }}
        >
          Bienvenido de vuelta
        </span>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-h1)',
            fontWeight: 600,
            color: 'var(--dz-text-primary)',
            letterSpacing: 'var(--dz-ls-snug)',
          }}
        >
          Entra a tu cuenta
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            color: 'var(--dz-text-muted)',
            lineHeight: 'var(--dz-lh-body)',
          }}
        >
          Tu progreso y plan te están esperando.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            background: 'var(--dz-tint-expense)',
            border: '1px solid rgba(224,122,156,0.25)',
            borderRadius: 'var(--dz-r-md)',
          }}
        >
          <span
            style={{
              flex: 1,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-expense)',
              lineHeight: 1.5,
            }}
          >
            {error}
          </span>
          <button
            type="button"
            onClick={dismissError}
            aria-label="Cerrar error"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--dz-expense)',
              fontSize: '16px',
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleLogin)}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <FormField label="Correo electrónico" htmlFor={emailId}>
          <Input
            id={emailId}
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            error={errors.email?.message ?? ''}
            fullWidth
            {...register('email', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Correo inválido',
              },
            })}
          />
        </FormField>

        <FormField label="Contraseña" htmlFor={passId}>
          <div style={{ position: 'relative' }}>
            <Input
              id={passId}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message ?? ''}
              style={{ paddingRight: '44px' }}
              fullWidth
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '21px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--dz-text-muted)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                lineHeight: 0,
              }}
            >
              {showPassword ? (
                <Icon as={EyeClosedIcon} size={16} />
              ) : (
                <Icon as={EyeOpenIcon} size={16} />
              )}
            </button>
          </div>
        </FormField>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label
            htmlFor={remId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-secondary)',
            }}
          >
            <input
              type="checkbox"
              id={remId}
              style={{ accentColor: 'var(--dz-signature)', width: '15px', height: '15px' }}
              {...register('rememberMe')}
            />
            Recordarme
          </label>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-signature)',
              padding: 0,
              transition: 'opacity var(--dz-transition-fast)',
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '46px',
            width: '100%',
            background: isLoading ? 'rgba(94,225,230,0.6)' : 'var(--dz-signature)',
            border: 'none',
            borderRadius: 'var(--dz-r-sm)',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            fontWeight: 600,
            color: 'var(--dz-bg-page)',
            letterSpacing: '-0.005em',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background var(--dz-transition-fast)',
          }}
        >
          {isLoading ? (
            <Spinner size="sm" color="muted" label="Ingresando…" />
          ) : (
            <>
              <span>Entrar</span>
              <Icon as={ArrowRightIcon} size={14} />
            </>
          )}
        </button>
      </form>

      <p
        style={{
          margin: 0,
          textAlign: 'center',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-caption)',
          color: 'var(--dz-text-muted)',
        }}
      >
        ¿Sin cuenta?{' '}
        <Link
          to="/register"
          style={{
            color: 'var(--dz-signature)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Crea una
        </Link>
      </p>
    </div>
  )
}
