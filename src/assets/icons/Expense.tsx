import type { SVGProps } from 'react'

export const ExpenseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
    <path
      d="M17 7L7 17M7 17H14M7 17V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
