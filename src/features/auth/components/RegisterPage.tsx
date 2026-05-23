import { RegisterForm } from './RegisterForm.tsx'
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

const stats = [
  { value: '$720k', label: 'Ahorro promedio' },
  { value: '9 meses', label: 'Liquidación típica' },
]

export const RegisterPage = () => (
  <>
    <style>{`
      .register-root {
        display: flex;
        min-height: 100vh;
        background: var(--dz-bg-page);
      }
      .register-panel {
        display: none;
      }
      @media (min-width: 1024px) {
        .register-panel {
          display: flex;
        }
      }
    `}</style>

    <main className="register-root">
      <aside
        className="register-panel"
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

        <div className="relative flex flex-col gap-5">
          <p
            className="uppercase tracking-widest text-xs"
            style={{
              fontFamily: 'var(--dz-font-mono)',
              color: 'var(--dz-signature)',
              letterSpacing: 'var(--dz-ls-eyebrow)',
            }}
          >
            Consejero financiero
          </p>
          <h2
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-display)',
              fontWeight: 700,
              color: 'var(--dz-text-primary)',
              lineHeight: 1.1,
              letterSpacing: 'var(--dz-ls-tight)',
            }}
          >
            Tu deuda
            <br />
            al <span style={{ color: 'var(--dz-signature)' }}>cero</span>
            <br />
            con plan.
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              fontFamily: 'var(--dz-font-sans)',
              color: 'var(--dz-text-secondary)',
              maxWidth: '320px',
            }}
          >
            Registra ingresos, gastos y deudas — la IA calcula el orden óptimo y te dice cuánto te
            ahorras en intereses.
          </p>

          <div className="flex gap-8 pt-2">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
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

        <div className="relative flex justify-between">
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

      <section className="flex flex-1 items-center justify-center p-5 min-h-screen">
        <RegisterForm />
      </section>
    </main>
  </>
)
