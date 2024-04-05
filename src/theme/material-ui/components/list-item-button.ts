import type { Components } from '@mui/material'

import { themeDark } from '../dark'

export const MuiListItemButton = (vars: typeof themeDark) => {
  return {
    styleOverrides: {
      root: {
        '&': {
          color: vars.textColor,
        },
        '&.Mui-selected': {
          backgroundColor: vars.primary,
          color: 'white !important',
        },
        '&.Mui-selected:hover': {
          backgroundColor: vars.secondary,
        },
        '&:hover': {
          backgroundColor: vars.secondary,
          color: 'white !important',
        },
      },
    },
  } as Components['MuiListItemButton']
}
