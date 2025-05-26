'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY as string

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError: (error: string) => void
  onExpire: () => void
  onTimeout: () => void
  className?: string
}

// TODO: Move to a common place
export function TurnstileWidget({ onSuccess, onError, onExpire, onTimeout, className = '' }: TurnstileWidgetProps) {
  const turnstileRef = useRef<TurnstileInstance>(null)

  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <Turnstile
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={(token: string) => {
          onSuccess(token)
        }}
        onExpire={() => {
          onExpire()
        }}
        onTimeout={() => {
          onTimeout()
        }}
        onError={(error: string) => {
          onError(error)
        }}
      />
    </div>
  )
}
