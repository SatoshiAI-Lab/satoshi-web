import React from 'react'

export interface CustomErrorProps {
  reason?: string
  code?: number
  reasonComponent?: React.FC<any>
}
