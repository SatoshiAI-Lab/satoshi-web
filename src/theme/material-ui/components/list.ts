import { Components } from '@mui/material'
import { themeDark } from '../dark'

export const MuiList = (vars: typeof themeDark) => {
  return {
    styleOverrides: {
      // root: {
      //   backgroundColor: vars.bgColor,
      //   color: '#000000',
      // },
    },
  } as Components['MuiDivider']
}
