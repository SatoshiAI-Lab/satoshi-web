import type { ThemeOptions } from '@mui/material'

import { themeDark } from './dark'
import { themeLight } from './light'
import { MuiListItemButton } from './components/MuiListItemButton'
import { MuiDivider } from './components/MuiDivider'
import { MuiList } from './components/MuiList'
import { MuiSkeleton } from './components/MuiSkeleton'

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
      // MuiListItemButton: MuiListItemButton(vars),
      // MuiDivider: MuiDivider(vars),
      // MuiList: MuiList(vars),
      // MuiSkeleton: MuiSkeleton(vars),
    },
  } as ThemeOptions
}
