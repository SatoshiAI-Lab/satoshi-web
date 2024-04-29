import React from 'react'
import { Collapse } from '@mui/material'

interface Props extends React.ComponentProps<'div'> {}

export const CustomCollapse = (props: Props) => {
  const { children } = props

  return <Collapse in>{children}</Collapse>
}

export default CustomCollapse
