'use client'

import type { ReactNode } from 'react'

interface FormActionProps {
  action: (formData: FormData) => Promise<void>
  children: ReactNode
  redirectData?: Record<string, string>
}

export function FormAction({ action, children, redirectData = {} }: FormActionProps) {
  return (
    <form action={action}>
      {/* Add hidden inputs for any redirect data */}
      {Object.entries(redirectData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      {children}
    </form>
  )
}
