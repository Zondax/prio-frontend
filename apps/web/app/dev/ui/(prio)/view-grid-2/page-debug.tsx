'use client'

import { useEffect } from 'react'

import { useFloatingSettings } from '@/components/debug/floating-settings-context'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

interface VirtualDebugPanelProps {
  itemCount: number
  gridSize: string
  setGridSize: (size: string) => void
  isLoading: boolean
  showGrid: boolean
  setShowGrid: (value: boolean) => void
  showBorders: boolean
  setShowBorders: (value: boolean) => void
  overscan: number
  setOverscan: (value: number) => void
  rowHeight: number
  setRowHeight: (value: number) => void
  gridSpacing: number
  setGridSpacing: (value: number) => void
  debug: boolean
  setDebug: (value: boolean) => void
}

export function VirtualDebugPanel({
  itemCount,
  gridSize,
  setGridSize,
  isLoading,
  showGrid,
  setShowGrid,
  showBorders,
  setShowBorders,
  overscan,
  setOverscan,
  rowHeight,
  setRowHeight,
  gridSpacing,
  setGridSpacing,
  debug,
  setDebug,
}: VirtualDebugPanelProps) {
  const { registerSettings, clearSettings } = useFloatingSettings()

  // Register settings panel
  useEffect(() => {
    registerSettings(
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Show Grid</p>
            </div>
            <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Show Borders</p>
            </div>
            <Switch id="show-borders" checked={showBorders} onCheckedChange={setShowBorders} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Debug Logging</p>
            </div>
            <Switch id="debug-logging" checked={debug} onCheckedChange={setDebug} />
          </div>
        </div>

        <div>
          <span className="text-xs text-muted-foreground">Grid Columns:</span>
          <div className="flex gap-1 mt-1">
            {['2', '3', '4', '6'].map((size) => (
              <Button
                key={size}
                variant={gridSize === size ? 'default' : 'outline'}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setGridSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">Row Height:</span>
            <span className="text-xs">{rowHeight}px</span>
          </div>
          <Slider
            className="w-full"
            value={[rowHeight]}
            min={100}
            max={500}
            step={20}
            onValueChange={(values) => setRowHeight(values[0])}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">Grid Spacing:</span>
            <span className="text-xs">{gridSpacing}px</span>
          </div>
          <Slider
            className="w-full"
            value={[gridSpacing]}
            min={0}
            max={48}
            step={2}
            onValueChange={(values) => setGridSpacing(values[0])}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground">Overscan:</span>
            <span className="text-xs">{overscan} rows</span>
          </div>
          <Slider className="w-full" value={[overscan]} min={5} max={100} step={5} onValueChange={(values) => setOverscan(values[0])} />
        </div>

        <div>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div>
              Grid Size: <span className="font-medium text-foreground">{gridSize}</span>
            </div>
            <div>
              Total Items: <span className="font-medium text-foreground">{itemCount}</span>
            </div>
            <div>
              Status:{' '}
              <span className={`font-medium ${isLoading ? 'text-amber-500' : 'text-green-500'}`}>{isLoading ? 'Loading...' : 'Idle'}</span>
            </div>
          </div>
        </div>
      </div>
    )

    // Clean up function to clear settings when component unmounts
    return () => {
      clearSettings()
    }
  }, [
    registerSettings,
    clearSettings,
    itemCount,
    gridSize,
    setGridSize,
    isLoading,
    overscan,
    setOverscan,
    showBorders,
    setShowBorders,
    showGrid,
    setShowGrid,
    rowHeight,
    setRowHeight,
    gridSpacing,
    setGridSpacing,
    debug,
    setDebug,
  ])

  // This component doesn't render anything directly - it just registers settings with the floating panel
  return null
}
