import type { Option as SelectOption } from '@mono-state/api/event'
import type { Option } from '@rn-primitives/select'
import { ArrowUpDown } from 'lucide-react-native'
import * as React from 'react'
import { useCallback } from 'react'
import { View } from 'react-native'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Text } from '~/components/ui/text'
import { cn } from '~/lib/utils'

interface SortSelectorProps<T> {
  value?: SelectOption<T>
  options: SelectOption<T>[]
  onValueChange: (value: SelectOption<T>) => void
}

export function SortSelector<T>({ value, options, onValueChange }: SortSelectorProps<T>) {
  // Create a new value variable without the id
  const valueWithoutId = value
    ? ({
        label: value.label,
        value: value.id,
      } as Option)
    : undefined

  const handleValueChange = useCallback(
    (selectedOption: Option) => {
      const opt = options?.find((option) => option.id === selectedOption?.value)
      if (opt) {
        onValueChange(opt)
      }
    },
    [options, onValueChange]
  )

  return (
    <View className="w-full shrink-0">
      <Select value={valueWithoutId} defaultValue={valueWithoutId} onValueChange={handleValueChange}>
        <SelectTrigger
          className={cn('flex flex-row items-center border border-border/80 bg-background rounded-full !h-9 px-3 py-1.5', 'gap-1.5')}
        >
          <ArrowUpDown size={14} className="text-foreground" />
          <SelectValue className="text-foreground text-xs font-medium" placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent className="w-[180px]">
          <SelectGroup>
            <SelectLabel>
              <Text className="text-sm font-medium">Sort Options</Text>
            </SelectLabel>
            {options?.map((option) => (
              <SelectItem key={option.id} value={option.id} label={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  )
}
