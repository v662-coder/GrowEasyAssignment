'use client'

import { Toaster } from 'react-hot-toast'

export function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  )
}