import type { PageProps } from '@/.next/types/app/(waiting)/join/page'
import { Rocket } from 'lucide-react'

import GenerativeBackground from '@/components/teaser/generative-background'
import { GlitchLink } from '@/components/teaser/glitch-link'
import { Card } from '@/components/ui/card'
import { getUtmParams } from '@/lib/utils'

import WaitlistForm from '../form/waitlistForm'

export default async function WaitingPage({ searchParams }: PageProps) {
  // Access specific query parameters
  // Handle the case where searchParams might be a Promise
  const resolvedParams = searchParams && typeof searchParams.then === 'function' ? await searchParams : searchParams
  const utmParams = resolvedParams ? getUtmParams(resolvedParams) : {}

  return (
    <div className="relative min-h-screen flex flex-col">
      <GenerativeBackground />
      <div className="grow flex items-center justify-center">
        <div className="max-w-xl w-[90%] mx-auto text-center">
          <Card className="p-10 backdrop-blur-xs bg-background/80">
            <Rocket className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Join the Waitlist</h1>
            <p className="text-muted-foreground mb-8">
              Be the first to experience our
              <br />
              revolutionary platform
            </p>
            <WaitlistForm utmParams={utmParams} />
          </Card>
        </div>
      </div>
      <footer className="relative p-4 z-10 flex justify-between items-center">
        <GlitchLink href="https://zondax.ch/terms-of-use">Terms and conditions</GlitchLink>
        <GlitchLink href="/">What is prio?</GlitchLink>
      </footer>
    </div>
  )
}
