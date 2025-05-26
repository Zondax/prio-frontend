'use client'

import Image from 'next/image'
import { type ForwardedRef, forwardRef } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PromoCardProps {
  id: string
  title: string
  colSpan?: number
}

export const PromoCard = forwardRef(({ id, title, colSpan = 2 }: PromoCardProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <Card
      ref={ref}
      className={cn('h-full flex flex-col bg-shadow-base text-white rounded-lg relative overflow-hidden', `col-span-${colSpan}`)}
      data-colspan={colSpan}
      data-promo-id={id}
    >
      <div className="absolute bottom-0 left-0 right-0 z-0 h-3/4">
        <Image
          src="/images/promotional-banner-bg.png"
          alt="Promotional background"
          width={400}
          height={300}
          className="absolute bottom-0 left-0 right-0 w-full h-auto object-contain object-bottom"
          priority
        />
      </div>

      <div className="p-6 flex flex-col items-start space-y-4 z-10 relative">
        <h2 className="text-4xl font-bold text-left">Have any new events for us?</h2>
        <button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-full">
          Let&apos;s share!
        </button>
      </div>
    </Card>
  )
})

PromoCard.displayName = 'PromotionalBanner'
