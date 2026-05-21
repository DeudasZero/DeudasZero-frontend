import { useEffect, useState } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: Infinity,
}

function resolveBreakpoint(width: number): Breakpoint {
  if (width < BREAKPOINTS.xs) return 'xs'
  if (width < BREAKPOINTS.sm) return 'sm'
  if (width < BREAKPOINTS.md) return 'md'
  if (width < BREAKPOINTS.lg) return 'lg'
  return 'xl'
}

export function useBreakpoint() {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== 'undefined' ? resolveBreakpoint(window.innerWidth) : 'xl',
  )

  useEffect(() => {
    function handleResize() {
      setBp(resolveBreakpoint(window.innerWidth))
    }

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => handleResize())
      ro.observe(document.body)
      return () => ro.disconnect()
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    bp,
    isMobile: bp === 'xs' || bp === 'sm',
    isTablet: bp === 'md' || bp === 'lg',
    isDesktop: bp === 'xl',
    isNarrow: bp === 'xs' || bp === 'sm' || bp === 'md',
    isCompact: bp !== 'xl',
    below: (target: Breakpoint) => {
      const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
      return order.indexOf(bp) < order.indexOf(target)
    },
    aboveOrEqual: (target: Breakpoint) => {
      const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
      return order.indexOf(bp) >= order.indexOf(target)
    },
  }
}
