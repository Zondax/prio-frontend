'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { EmptyState } from '@/components/empty-state'
import { XCircle, ArrowLeft } from 'lucide-react'

function CancelPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')

  const subtitle = sessionId
    ? `Your checkout was cancelled. No charges were made to your payment method. Session reference: ${sessionId.substring(0, 8)}...`
    : 'Your checkout was cancelled. No charges were made to your payment method.'

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center">
      <EmptyState
        icon={XCircle}
        title="Payment Cancelled"
        subtitle={subtitle}
        button={{
          onClick: () => router.push('/dev/stripe'),
          label: 'Return to Products',
          icon: ArrowLeft,
        }}
      />
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex h-screen flex-col items-center justify-center">
          <EmptyState
            icon={XCircle}
            title="Payment Cancelled"
            subtitle="Your checkout was cancelled. No charges were made to your payment method."
            button={{
              onClick: () => {
                window.location.href = '/dev/stripe'
              },
              label: 'Return to Products',
              icon: ArrowLeft,
            }}
          />
        </div>
      }
    >
      <CancelPageContent />
    </Suspense>
  )
}
