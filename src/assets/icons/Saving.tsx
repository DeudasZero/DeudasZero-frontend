import type { SVGProps } from 'react'

export const SavingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6.5 9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S10.38 7 9 7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M9 5.5V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
