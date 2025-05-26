'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { useMaplibreLoader } from './use-map-loader'

export interface MapLoaderProps {
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function MapLoader({ className = '', style = {}, children }: MapLoaderProps) {
  const { isLoading, loadError, maplibre } = useMaplibreLoader()

  if (isLoading) {
    return (
      <div className={cn('relative flex h-full w-full items-center justify-center bg-muted', className)} style={style}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div
        className={cn(
          'relative flex h-full w-full flex-col items-center justify-center bg-destructive/10 p-4 text-destructive-foreground',
          className
        )}
        style={style}
      >
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>{loadError}</p>
        <p className="text-xs mt-1">Please try refreshing the page.</p>
      </div>
    )
  }

  if (!maplibre) {
    return (
      <div className={cn('relative flex h-full w-full items-center justify-center bg-muted', className)} style={style}>
        <p>Initializing map...</p>
      </div>
    )
  }

  return <>{children}</>
}
