'use client'

import { Button, Card } from '@zondax/ui-common'
import { Coffee, Compass, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <Compass className="w-24 h-24 animate-[spin_3s_linear_infinite] text-muted-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
            <Rocket className="w-8 h-8 text-primary transform rotate-45" />
            <Coffee className="w-4 h-4 text-primary/50 absolute -bottom-4 left-2 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404: Too Simple to Find</h1>
          <p className="text-muted-foreground">
            Looks like we simplified this page right out of existence! Even our rocket is taking a coffee break trying to find it.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Link href="/" className="w-full">
            <Button className="w-full">Return to Reality</Button>
          </Link>
          <p className="text-sm text-muted-foreground italic">
            &quot;I simplified everything so much, I accidentally deleted this page.&quot; - A Very Minimalist Developer
          </p>
        </div>
      </Card>
    </div>
  )
}
