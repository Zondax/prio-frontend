'use client'

import { Settings } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useFloatingSettings } from './floating-settings-context'

interface FloatingSettingsPanelProps {
  /**
   * Optional title for the settings panel
   */
  title?: string

  /**
   * Optional CSS class for the panel
   */
  className?: string
}

export function FloatingSettingsPanel({ title = 'Page Settings', className }: FloatingSettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { getSettings, hasSettings } = useFloatingSettings()

  // Don't render if there are no settings
  if (!hasSettings) return null

  return (
    <>
      {/* Floating Settings Button */}
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full shadow-lg z-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="h-5 w-5" />
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <Card
          className={cn('fixed bottom-16 right-4 w-72 shadow-xl z-50 border animate-in slide-in-from-bottom-5 duration-300', className)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between items-center">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">{getSettings()}</CardContent>
        </Card>
      )}
    </>
  )
}
