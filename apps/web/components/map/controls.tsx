'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertTriangle, Locate, Maximize } from 'lucide-react'

interface MapControlsProps {
  showFullscreenControl: boolean
  showGeolocationControl: boolean
  allowUserLocation: boolean
  locationError: string | null
  permissionGranted: boolean | null
  onFullscreen: () => void
  onLocationClick: () => void
  onShowPermissionDialog: () => void
}

export function MapControls({
  showFullscreenControl,
  showGeolocationControl,
  allowUserLocation,
  locationError,
  permissionGranted,
  onFullscreen,
  onLocationClick,
  onShowPermissionDialog,
}: MapControlsProps) {
  return (
    <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
      <TooltipProvider>
        {showFullscreenControl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={onFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fullscreen</TooltipContent>
          </Tooltip>
        )}
        {showGeolocationControl && allowUserLocation && !locationError && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={onLocationClick}>
                <Locate className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>My Location</TooltipContent>
          </Tooltip>
        )}
        {allowUserLocation && permissionGranted === false && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={onShowPermissionDialog}>
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Location access denied</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}
