import type { ThemeOptions } from '@mui/material'

import { themeDark } from './dark'
import { themeLight } from './light'

/**
 * Material-ui theming options config
 * @param isDark Use dark theme if true.
 * @returns Return material theme options.
 */
export const themeOptions = (isDark: boolean) => {
  const vars = isDark ? themeDark : themeLight

  return {
    palette: {
      primary: { main: vars.primary },
      secondary: { main: vars.secondary },
      error: { main: vars.error },
    },
    components: {},
  } as ThemeOptions
}
