'use client'

import { Search, X } from 'lucide-react'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...', onClear, className }: SearchInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear()
    } else {
      onChange('')
    }
  }, [onChange, onClear])

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input type="text" value={value} onChange={handleChange} placeholder={placeholder} className="pl-9 pr-9 rounded-full" />
      {value && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full text-muted-foreground/70 hover:text-foreground transition-all duration-200"
          type="button"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
