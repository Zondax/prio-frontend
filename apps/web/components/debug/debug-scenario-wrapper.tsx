'use client'

import type React from 'react'
import { cn } from '@/lib/utils'

interface WidthVariant {
  name: string
  className: string // Tailwind class for width
}

export const widthVariants: WidthVariant[] = [
  { name: 'XS (max-w-xs / 320px)', className: 'max-w-xs' },
  { name: 'SM (max-w-sm / 384px)', className: 'max-w-sm' },
  { name: 'MD (max-w-md / 448px)', className: 'max-w-md' },
  { name: 'LG (max-w-lg / 512px)', className: 'max-w-lg' },
  { name: 'XL (max-w-xl / 576px)', className: 'max-w-xl' },
  { name: '2XL (max-w-2xl / 672px)', className: 'max-w-2xl' },
  { name: '3XL (max-w-3xl / 768px)', className: 'max-w-3xl' },
  { name: '4XL (max-w-4xl / 896px)', className: 'max-w-4xl' },
  { name: '5XL (max-w-5xl / 1024px)', className: 'max-w-5xl' },
  { name: '6XL (max-w-6xl / 1152px)', className: 'max-w-6xl' },
  { name: '7XL (max-w-7xl / 1280px)', className: 'max-w-7xl' },
  { name: 'Full (max-w-full)', className: 'max-w-full' },
]

interface DebugWrapperProps {
  children: React.ReactNode
  title?: string
  variants?: WidthVariant[]
  showVariantDetails?: boolean
}

export function DebugScenarioWrapper({ children, title, variants = widthVariants, showVariantDetails = true }: DebugWrapperProps) {
  return (
    <div className="space-y-6">
      {title && <h2 className="mb-2 font-semibold">{title}</h2>}
      {variants.map((variant) => {
        // Create a clean data-testid from the variant name
        const testIdName = variant.name.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/--+/g, '-')
        return (
          <div key={variant.name} data-testid={`variant-container-${testIdName}`}>
            {showVariantDetails && <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Variant: {variant.name}</p>}
            <div className={cn('border border-dashed border-pink-300 dark:border-pink-600 container', variant.className)}>{children}</div>
          </div>
        )
      })}
    </div>
  )
}
