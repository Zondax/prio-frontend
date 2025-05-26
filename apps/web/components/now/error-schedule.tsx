'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface ErrorScheduleProps {
  error: Error | string | unknown
  onRetry?: () => void
  className?: string
}

export function ErrorSchedule({ error, onRetry, className = '' }: ErrorScheduleProps) {
  // Format the error message
  const errorMessage = error ? (error instanceof Error ? error.message : String(error).replace(/\[.*?\]/g, '')) : null

  return (
    <Card className={`flex flex-col items-center justify-center p-6 gap-6 ${className}`}>
      <div className="flex flex-col items-center gap-2 w-full">
        <AlertTriangle size={64} className="text-destructive mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Unable to load activities</h3>
        <p className="text-muted-foreground text-center max-w-md">We encountered an error while trying to load your activities.</p>
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 w-full max-w-2xl mx-auto mt-2">
            <p className="text-destructive text-sm font-medium">{errorMessage}</p>
          </div>
        )}
      </div>

      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          Try again
        </Button>
      )}
    </Card>
  )
}
