'use client'

import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useEndpointStore, useWaitingListStore } from '@prio-state'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import { joinWaitlist } from './form-handlers'
import { TurnstileWidget } from './turnstile-widget'

const initialState = {
  message: '',
}

interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

function WaitlistForm({ utmParams }: { utmParams: UtmParams }) {
  const router = useRouter()
  const [state, setState] = useState(initialState)
  const [error, setError] = useState<string | null>(null)

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)
  const { selectedEndpoint } = useEndpointStore()

  const waitingListStore = useWaitingListStore()

  const { pending } = useFormStatus()

  useEffect(() => {
    const config = {
      baseUrl: selectedEndpoint,
      metadata: {},
    }
    waitingListStore.setParams(config)
  }, [selectedEndpoint, waitingListStore])

  const resetTurnstile = () => {
    if (turnstileRef.current) {
      turnstileRef.current.reset()
      setTurnstileToken(null)
    }
  }

  useEffect(() => {
    if (state.message) {
      // Reset the form and Turnstile on success
      resetTurnstile()
    }
  }, [state.message])

  // Handle expiration
  useEffect(() => {
    if (error === '[expired] Please complete the security check') {
      resetTurnstile()
    }
  }, [error])

  const handleSubmit = async (formData: FormData) => {
    const result = await joinWaitlist(formData, waitingListStore)

    if (!result.success) {
      setState({ message: result.message || 'Unknown error' })
      return
    }

    router.push('/soon')
  }

  return (
    <>
      {!turnstileToken ? (
        <TurnstileWidget
          onSuccess={(token) => {
            setTurnstileToken(token)
          }}
          onError={setError}
          onExpire={() => {
            setError('[expired] Please complete the security check')
            resetTurnstile()
          }}
          onTimeout={() => {
            setError('[timeout] Please complete the security check')
            resetTurnstile()
          }}
        />
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            if (!turnstileToken) {
              setError('Please complete the security check')
              return
            }
            setError(null)
            formData.append('cf-turnstile-response', turnstileToken)
            formData.append('metadata', JSON.stringify(utmParams))
            await handleSubmit(formData)
          }}
          className="space-y-4 w-full"
        >
          <div className="relative">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className={cn('pr-4 transition-all duration-200', error ? 'border-destructive focus-visible:ring-destructive' : '')}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'email-error' : undefined}
              onChange={() => error && setError(null)}
              disabled={waitingListStore.isLoading}
            />
            {error && (
              <p id="email-error" className="text-sm text-destructive mt-1">
                {error}
              </p>
            )}
            {state.message && !error && <p className="text-sm text-green-500 mt-1">{state.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={pending || !turnstileToken || waitingListStore.isLoading}
            className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02]"
          >
            {waitingListStore.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Let&apos;s go!
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      )}
    </>
  )
}

export default WaitlistForm
