'use client'

import { CheckCircle, ShoppingCart } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { EmptyState } from '@/components/empty-state'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const subtitle = sessionId
    ? `We've received your payment and are processing your order. Order reference: ${sessionId.substring(0, 8)}...`
    : "We've received your payment and are processing your order."

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center">
      <EmptyState
        icon={CheckCircle}
        title="Payment Successful!"
        subtitle={subtitle}
        button={{
          onClick: () => router.push('/dev/stripe'),
          label: 'Continue Shopping',
          icon: ShoppingCart,
        }}
      />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex h-screen flex-col items-center justify-center">
          <EmptyState
            icon={CheckCircle}
            title="Payment Successful!"
            subtitle="We've received your payment and are processing your order."
            button={{
              onClick: () => {
                window.location.href = '/dev/stripe'
              },
              label: 'Continue Shopping',
              icon: ShoppingCart,
            }}
          />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
