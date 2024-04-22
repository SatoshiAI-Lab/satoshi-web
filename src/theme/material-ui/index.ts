import type { ThemeOptions } from '@mui/material'

import { themeDark } from './dark'
import { themeLight } from './light'
import { MuiList } from './components/list'
import { MuiListItemButton } from './components/list-item-button'
import { MuiSkeleton } from './components/skeleton'
import { MuiDivider } from './components/divider'

/**
 * Material-ui theming options config
 * @param isDark Use dark theme if true.
 * @returns Return material theme options.
 */
export const themeOptions = (isDark: boolean) => {
  const vars = isDark ? themeDark : themeLight

  return {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: vars.primary },
      secondary: { main: vars.secondary },
      error: { main: vars.error },
    },
    components: {
      MuiList: MuiList(vars),
      MuiListItemButton: MuiListItemButton(vars),
      MuiSkeleton: MuiSkeleton(vars),
      MuiDivider: MuiDivider(vars),
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  } as ThemeOptions
}
