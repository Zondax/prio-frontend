'use client'

import type { Option } from '@prio-state/stores'
import { ArrowDownUp } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SortSelectorProps<T> {
  value?: Option<T>
  options: Option<T>[]
  onValueChange: (value: Option<T>) => void
}

export function SortSelector<T>({ value, options, onValueChange }: SortSelectorProps<T>) {
  return (
    <Select
      value={value?.id}
      onValueChange={(optionValue) => {
        const option = options.find((option) => option.id === optionValue)
        if (option) {
          onValueChange(option)
        }
      }}
    >
      <SelectTrigger className="rounded-full text-xs font-medium sm:w-50 flex-1">
        <ArrowDownUp />
        <SelectValue placeholder="Sort by" className="text-xs max-sm:hidden flex-1" />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.id} value={option.id} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
