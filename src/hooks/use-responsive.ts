import { useMediaQuery } from '@mui/material'

import { DEVICE_CONFIG } from '@/config/device'

/**
 * Responsive adaptation hook, use for device detection.
 */
export const useResponsive = () => {
  return {
    isMobile: useMediaQuery(`(max-width: ${DEVICE_CONFIG.mobile}px)`),
    isPad: useMediaQuery(`(max-width: ${DEVICE_CONFIG.pad}px)`),
    isDesktop: useMediaQuery(`(min-width: ${DEVICE_CONFIG.desktop}px)`),
  }
}
