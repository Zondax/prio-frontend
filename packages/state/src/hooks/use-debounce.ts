'use client'

import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value)
    }, delay)

    handler()

    return () => {
      handler.cancel()
    }
  }, [value, delay])

  return debouncedValue
}
