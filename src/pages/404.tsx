import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'

import { Routes } from '@/routes'

export const NotFound: React.FC = () => {
  const router = useRouter()

  return (
    <div className={`h-screen flex flex-col justify-center items-center`}>
      <h1>404 Not Found</h1>
      <h2 className="mb-4 text-center">Please check your URL.</h2>
      <div className="flex gap-2">
        <Button variant="contained" onClick={() => router.push(Routes.index)}>
          Back To Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound
