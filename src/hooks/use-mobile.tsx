
import * as React from "react"
import { useResponsive } from "./useResponsive"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const { isMobile } = useResponsive()
  
  // Fallback for compatibility
  const [fallbackIsMobile, setFallbackIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setFallbackIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setFallbackIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Prefer the new responsive hook, fallback to the old logic
  return isMobile !== undefined ? isMobile : !!fallbackIsMobile
}
