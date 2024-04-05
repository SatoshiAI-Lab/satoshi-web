import { Components } from '@mui/material'
import { themeDark } from '../dark'

export const MuiDivider = (vars: typeof themeDark) => {
  return {
    styleOverrides: {
      root: {
        borderColor: vars.dividerColor,
      },
    },
  } as Components['MuiDivider']
}
