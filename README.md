# DeudaZero — Frontend

App web de finanzas personales orientada a la gestión y eliminación de deudas. Permite registrar ingresos, gastos y deudas, visualizar el estado financiero en un dashboard y generar un plan de liquidación con inteligencia artificial (estrategias Avalanche y Snowball).

---

## Stack tecnológico

| Categoría       | Tecnología                                                     |
| --------------- | -------------------------------------------------------------- |
| Framework UI    | React 19                                                       |
| Lenguaje        | TypeScript ~5.9 (strict mode)                                  |
| Bundler         | Vite 8                                                         |
| Estilos         | CSS custom properties (design tokens `--dz-*`), Tailwind CSS 4 |
| Estado global   | Redux Toolkit 2 (`createSlice`, `createAsyncThunk`)            |
| Routing         | React Router v7                                                |
| Formularios     | React Hook Form + Zod                                          |
| HTTP            | Axios con interceptores de auth (Bearer token)                 |
| Package manager | pnpm ≥ 9                                                       |
| Fuentes         | Instrument Sans (sans/display), Geist Mono (mono)              |
| Tema            | Dark-first, sistema de tokens CSS (`data-theme="arctic"`)      |

---

## Arquitectura

El proyecto combina dos metodologías complementarias:

### SCREAM — organización por feature

Cada dominio vive en `src/features/<feature>/` y agrupa sus propias capas internas siguiendo la estructura **SCREAM** (Services · Components · Routes · Effects · Actions · Models):

```
<feature>/
├── components/   # (C) UI de la feature
├── hooks/        # (E) Efectos y lógica reactiva
├── services/     # (S) Llamadas a API
├── store/        # (A) Actions y state — slice de Redux
└── types/        # (M) Modelos e interfaces de dominio
```

Las rutas protegidas se centralizan en `src/router/` porque son transversales a todas las features.

### Atomic Design — jerarquía de componentes compartidos

Los componentes reutilizables en `src/shared/components/` siguen la metodología **Atomic Design**:

| Nivel      | Carpeta      | Ejemplos                                                   |
| ---------- | ------------ | ---------------------------------------------------------- |
| Átomos     | `atoms/`     | Button, Input, Icon, Badge, Skeleton, Money, Spinner       |
| Moléculas  | `molecules/` | FormField, StatCard, ConfirmModal, SearchInput, NavItem    |
| Organismos | `organisms/` | Sidebar, TopBar, DashboardLayout, BudgetOverview, DebtList |

Cada nivel solo puede importar del nivel anterior o del mismo nivel, nunca hacia abajo.

### Estructura completa

```
src/
├── assets/
│   ├── icons/          # Íconos propios del sistema de diseño (TSX)
│   └── logo.png
├── features/
│   ├── auth/           # Login, registro, sesión
│   ├── dashboard/      # Resumen financiero, historial, gráficas
│   ├── debts/          # CRUD de deudas, score de carga, liquidación
│   ├── transactions/   # Ingresos y gastos
│   ├── plan-ia/        # Plan de pago IA (Avalanche / Snowball), chat
│   └── profile/        # Datos personales y base financiera
├── shared/
│   ├── components/
│   │   ├── atoms/      # Atomic Design — nivel 1
│   │   ├── molecules/  # Atomic Design — nivel 2
│   │   └── organisms/  # Atomic Design — nivel 3
│   ├── hooks/          # useBreakpoint
│   └── styles/
│       ├── index.css   # Estilos globales
│       └── tokens.css  # Design tokens CSS
├── store/              # configureStore, typed hooks
├── services/           # http.ts (instancia Axios compartida)
└── router/             # AppRouter, rutas protegidas, AppShell
```

---

## Sistema de diseño — tokens CSS

Los estilos usan variables CSS con prefijo `--dz-`. No usar valores hardcoded.

| Categoría  | Variables                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Fondos     | `--dz-bg-page`, `--dz-bg-surface`, `--dz-bg-raised`, `--dz-bg-sunken`, `--dz-bg-sidebar`                                |
| Texto      | `--dz-text-primary`, `--dz-text-secondary`, `--dz-text-muted`, `--dz-text-faint`                                        |
| Semánticos | `--dz-income` (cyan), `--dz-expense` (rosa), `--dz-saving` (azul), `--dz-debt` (naranja), `--dz-signature` (cyan marca) |
| Radios     | `--dz-r-xs` → `--dz-r-pill`                                                                                             |
| Tipografía | `--dz-fs-display` → `--dz-fs-eyebrow`, `--dz-font-sans`, `--dz-font-mono`                                               |

---

## Estado global — Redux Toolkit

Un slice por feature. El store combina:

| Slice          | Responsabilidad                                                         |
| -------------- | ----------------------------------------------------------------------- |
| `auth`         | Usuario autenticado, token, persistencia en localStorage/sessionStorage |
| `dashboard`    | Resumen mensual, historial, gastos por categoría                        |
| `transactions` | Lista de movimientos, filtros, CRUD                                     |
| `debts`        | Lista de deudas, score de carga (%), CRUD, liquidación                  |
| `planIA`       | Plan de pago generado, cuotas, chat con IA                              |
| `profile`      | Datos personales y configuración financiera                             |

Hooks tipados definidos en `src/store/hookStore.ts`:

```ts
useAppDispatch() // Typed dispatch
useAppSelector() // Typed selector
```

---

## HTTP y autenticación

Instancia Axios centralizada en `src/services/http.ts`:

- `baseURL` desde la variable de entorno `VITE_API_URL`
- Timeout de 10 segundos
- **Interceptor de request**: adjunta `Authorization: Bearer <token>` desde `localStorage` o `sessionStorage`
- **Interceptor de response**: normaliza errores con mensaje legible en español

La sesión persiste en `localStorage` (recordar sesión) o `sessionStorage` (sesión temporal).

---

## Rutas

| Ruta            | Componente         | Acceso    |
| --------------- | ------------------ | --------- |
| `/login`        | `LoginPage`        | Público   |
| `/register`     | `RegisterPage`     | Público   |
| `/dashboard`    | `DashboardPage`    | Protegido |
| `/transactions` | `TransactionsPage` | Protegido |
| `/debts`        | `DebtsPage`        | Protegido |
| `/ai`           | `PlanIAPage`       | Protegido |
| `/profile`      | `ProfilePage`      | Protegido |

Las rutas protegidas validan token en store o storage. Sin sesión redirigen a `/login`.

---

## Variables de entorno

Copiar `.env.example` como `.env.local` en la raíz:

```
VITE_API_URL=https://api.tudominio.com
VITE_APP_ENV=development
```

---

## Cómo correr el proyecto

```bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build producción
pnpm build

# Preview del build
pnpm preview

# Type checking
pnpm typecheck

# Tests
pnpm test

# Análisis de bundle (genera bundle-report.html)
pnpm analyze
```

---

## Convenciones

### Componentes

- **Naming**: PascalCase, un archivo por componente, colocados en su feature o en `shared/`
- **Exports**: cada carpeta de componente tiene su `index.ts` (barrel export)
- **Tipos**: archivo `ComponentName.types.ts` por componente

### Íconos

Los íconos están definidos como componentes TSX en `src/assets/icons/`, consumidos a través del wrapper:

```tsx
import { Icon } from '@atoms/icon'
import { PlusIcon } from '@assets/icons'

;<Icon as={PlusIcon} size="md" />
```

### Path aliases

| Alias          | Resuelve a                         |
| -------------- | ---------------------------------- |
| `@/`           | `src/`                             |
| `@features/`   | `src/features/`                    |
| `@shared/`     | `src/shared/`                      |
| `@components/` | `src/shared/components/`           |
| `@atoms/`      | `src/shared/components/atoms/`     |
| `@molecules/`  | `src/shared/components/molecules/` |
| `@organisms/`  | `src/shared/components/organisms/` |
| `@store/`      | `src/store/`                       |
| `@services/`   | `src/services/`                    |
| `@router/`     | `src/router/`                      |
| `@assets/`     | `src/assets/`                      |

### Calidad de código

- ESLint (React, Hooks, a11y) + Prettier se ejecutan en cada commit via Husky + lint-staged
- TypeScript en modo estricto: sin `any` implícitos, sin variables sin usar
- Validación de formularios con Zod schemas
