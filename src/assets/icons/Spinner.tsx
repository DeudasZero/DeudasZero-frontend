import type { SVGProps } from 'react'

export const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    style={{ animation: 'dz-spin 0.8s linear infinite' }}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="40"
      strokeDashoffset="10"
      strokeLinecap="round"
    />
    <style>{`@keyframes dz-spin { to { transform: rotate(360deg) } }`}</style>
  </svg>
)
