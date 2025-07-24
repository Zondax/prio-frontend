'use client'

import { Button, Card } from '@zondax/ui-web/client'
import { Bug, Rocket, Zap } from 'lucide-react'
import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 animate-ping opacity-75">
            <Rocket className="w-24 h-24 text-muted-foreground transform rotate-180" />
          </div>
          <Rocket className="w-24 h-24 text-primary transform rotate-180" />
          <Bug className="w-6 h-6 text-destructive absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
          <Zap className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Houston, We Have a Problem</h1>
          <p className="text-muted-foreground">
            Our rocket encountered an unexpected bug in the simplicity matrix. Apparently, &quot;rm -rf complexity&quot; was a bit too
            aggressive.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Button onClick={reset} className="w-full group">
            <span>Ctrl + Z The Universe</span>
            <span className="absolute scale-0 group-hover:scale-100 transition-transform ml-2">🤞</span>
          </Button>
          <p className="text-sm text-muted-foreground italic">
            &quot;To err is human, to really mess things up requires a computer.&quot;
            <br />- Anonymous Developer&apos;s Coffee Mug
          </p>
        </div>
      </Card>
    </div>
  )
}
