'use client'

import { Button, cn } from '@zondax/ui-common/client'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyButtonProps {
  text: string
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  onCopy?: (text: string) => void
}

export function CopyButton({ text, variant = 'ghost', size = 'sm', className, onCopy }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      onCopy?.(text)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button variant={variant} size={size} className={cn('h-8 px-2 text-xs', className)} onClick={handleCopy}>
      {isCopied ? (
        <>
          <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 mr-1" />
          Copy
        </>
      )}
    </Button>
  )
}
