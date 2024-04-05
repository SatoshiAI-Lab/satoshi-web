import { useMediaQuery } from '@mui/material'

import { DEVICES_CONFIG } from '@/config/device'

/**
 * Responsive adaptation hook, use for device detection.
 */
export const useResponsive = () => {
  return {
    isMobile: useMediaQuery(`(max-width: ${DEVICES_CONFIG.mobile}px)`),
    isPad: useMediaQuery(`(max-width: ${DEVICES_CONFIG.pad}px)`),
    isDesktop: useMediaQuery(`(min-width: ${DEVICES_CONFIG.desktop}px)`),
  }
}
