import { LoginForm } from './LoginForm.tsx'
import logo from '@assets/logo.png'

const DecoGrid = () => (
  <svg
    aria-hidden
    width="420"
    height="420"
    viewBox="0 0 420 420"
    fill="none"
    style={{
      position: 'absolute',
      bottom: '-60px',
      right: '-60px',
      opacity: 0.07,
      pointerEvents: 'none',
    }}
  >
    <circle cx="210" cy="210" r="200" stroke="#5EE1E6" strokeWidth="1" />
    <circle cx="210" cy="210" r="148" stroke="#5EE1E6" strokeWidth="1" />
    <circle cx="210" cy="210" r="96" stroke="#5EE1E6" strokeWidth="1" />
    <circle cx="210" cy="210" r="44" stroke="#5EE1E6" strokeWidth="1" />
    <path d="M40 380 L380 40" stroke="#5EE1E6" strokeWidth="1.2" />
    <path d="M40 40  L380 380" stroke="#5EE1E6" strokeWidth="0.6" />
  </svg>
)

export const LoginPage = () => (
  <>
    <style>{`
      .login-root {
        display: flex;
        min-height: 100vh;
        background: var(--dz-bg-page);
      }
      .login-panel {
        display: none;
      }
      @media (min-width: 1024px) {
        .login-panel {
          display: flex;
        }
      }
    `}</style>

    <main className="login-root">
      <aside
        className="login-panel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '460px',
          flexShrink: 0,
          background: 'var(--dz-bg-sidebar)',
          borderRight: '1px solid var(--dz-border-soft)',
          padding: '48px 40px',
        }}
      >
        <DecoGrid />

        <div className="relative flex items-center gap-2.5">
          <img src={logo} alt="DeudaZero Logo" className="h-7 w-7 object-contain" />
          <span
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h3)',
              fontWeight: 700,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            Deuda<span style={{ color: 'var(--dz-signature)' }}>Zero</span>
          </span>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}
        >
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: 'var(--dz-fs-eyebrow)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 'var(--dz-ls-eyebrow)',
              color: 'var(--dz-signature)',
            }}
          >
            Consejero financiero
          </span>

          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: '44px',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: 'var(--dz-ls-tight)',
              color: 'var(--dz-text-primary)',
            }}
          >
            Tu deuda
            <br />
            al <em style={{ fontStyle: 'italic', color: 'var(--dz-signature)' }}>cero,</em>
            <br />
            con plan.
          </h1>

          <p
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-body)',
              color: 'var(--dz-text-muted)',
              lineHeight: 'var(--dz-lh-body)',
              maxWidth: '320px',
            }}
          >
            Registra ingresos, gastos y deudas — la IA calcula el orden óptimo y te dice cuánto te
            ahorras en intereses.
          </p>

          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { value: '$720k', label: 'Ahorro promedio' },
              { value: '9 meses', label: 'Liquidación típica' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--dz-font-mono)',
                    fontSize: 'var(--dz-fs-h2)',
                    fontWeight: 600,
                    color: 'var(--dz-signature)',
                    letterSpacing: 'var(--dz-ls-tight)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--dz-font-sans)',
                    fontSize: 'var(--dz-fs-caption)',
                    color: 'var(--dz-text-faint)',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {['DeudaZero · MVP 2026', 'Hackathon · 4 días'].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '11px',
                color: 'var(--dz-text-faint)',
                letterSpacing: 'var(--dz-ls-eyebrow)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </aside>

      <section
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 20px',
          minHeight: '100vh',
        }}
      >
        <LoginForm />
      </section>
    </main>
  </>
)
