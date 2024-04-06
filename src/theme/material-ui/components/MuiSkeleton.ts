import { Components } from '@mui/material'

import { themeDark } from '../dark'

export const MuiSkeleton = (vars: typeof themeDark) => {
  return {
    styleOverrides: {
      root: {
        backgroundColor: vars.skeletonColor,
      },
    },
  } as Components['MuiSkeleton']
}
