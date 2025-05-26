import type { PageProps } from '@/.next/types/app/(what_is)/page'
import { ArrowRight, Building, Calendar, Clock, CreditCard, Inbox, Map as MapIcon, Plane, Search, Timer, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import GenerativeBackground from '@/components/teaser/generative-background'
import { GlitchLink } from '@/components/teaser/glitch-link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { buildUrl, getUtmParams } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'What Is Prio - The Pain of Crypto Conferences',
  description: 'Why we need a better way to manage business travel and networking',
}

export default async function WhatIsPage({ searchParams }: PageProps) {
  // Preserve UTM parameters from the current URL
  // Handle the case where searchParams might be a Promise
  const resolvedParams = searchParams && typeof searchParams.then === 'function' ? await searchParams : searchParams
  const utmParams = resolvedParams ? getUtmParams(resolvedParams) : {}

  // Helper function to create URL with UTM parameters
  const buildWaitlistUrl = () => {
    return buildUrl('/join', utmParams)
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{ transform: 'translateZ(0)', backgroundColor: '#fff' }}>
        <GenerativeBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 container w-full max-w-[98%] lg:max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8 md:py-16 flex flex-col items-center justify-center gap-4 sm:gap-8">
        <Card className="p-3 sm:p-6 md:p-8 lg:p-10 backdrop-blur-xs bg-background/80 w-full overflow-hidden">
          <div className="flex flex-col items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
            <span className="text-[10px] sm:text-xs md:text-sm font-mono tracking-wider text-primary">
              SYSTEM_STATUS: CRYPTO_CONFERENCE_CHAOS
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-4">
              The Pain of Crypto Conferences
            </h1>
            <div className="flex flex-col items-center text-center">
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mt-1">
                Why we need a better way to manage business travel and networking
              </p>
            </div>
            <Link href={buildWaitlistUrl()}>
              <Button
                size="lg"
                className="group w-full sm:w-auto text-xs sm:text-sm md:text-base hover:bg-primary/90 transition-all duration-300"
              >
                <Plane className="mr-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                Join Waiting List
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground font-mono  mt-1">[STATUS: SOLUTION_READY]</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 font-mono">
            {painPoints.map((point, index) => (
              <Card
                key={point.title}
                className={`p-2 sm:p-3 md:p-4 lg:p-6 backdrop-blur-xs bg-background/40 hover:bg-background/60 transition-all duration-500 overflow-hidden group
                  ${index === painPoints.length - 1 ? 'sm:col-span-2' : ''}`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-0.5 hidden sm:block shrink-0 group-hover:text-primary transition-colors">{point.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-1 sm:mb-2 text-primary flex items-center">
                      <span className="sm:hidden mr-2 shrink-0 group-hover:text-primary transition-colors">{point.icon}</span>
                      <span className="truncate font-mono">&gt; {point.title}</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed break-words">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center gap-2 sm:gap-4">
            <Link href={buildWaitlistUrl()}>
              <Button
                size="lg"
                className="group w-full sm:w-auto text-xs sm:text-sm md:text-base hover:bg-primary/90 transition-all duration-300"
              >
                <Plane className="mr-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                Travel Smart, Not Hard
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <footer className="relative mt-auto py-2 px-4 sm:p-4 z-10 flex justify-between items-center text-[10px] sm:text-xs md:text-sm">
        <GlitchLink href="https://zondax.ch/terms-of-use">Terms and conditions</GlitchLink>
        <GlitchLink href={buildWaitlistUrl()}>Join Waitlist</GlitchLink>
      </footer>
    </div>
  )
}

const painPoints = [
  {
    icon: <Search className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Event_FOMO.exe',
    description:
      'You open 10 tabs, join 3 Discord servers, and still end up at a mediocre networking brunch instead of the exclusive rooftop mixer with all the VCs.',
  },
  {
    icon: <MapIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Running_Everywhere.log',
    description: 'Your meetings are all over the city. You spend more time in taxis than actually networking.',
  },
  {
    icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Missed_Connections.log',
    description:
      'You flew 10 hours for a conference, but only realized your dream investor was there when you saw their Instagram... the next day.',
  },
  {
    icon: <Inbox className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Business_Card_Graveyard.err',
    description:
      "You collect 25 business cards, forget who's who, and by the time you follow up, they've pivoted, rebranded, and raised $10M.",
  },
  {
    icon: <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'ROI_404.err',
    description: 'You spend a lot on travel but return home with nothing except a bad selfie and a boring event badge.',
  },
  {
    icon: <Calendar className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Schedule_Overflow.err',
    description: "You RSVP for everything but don't know where to go next. You check Google Maps every 5 minutes just to survive.",
  },
  {
    icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Promise_Overload.err',
    description: "You promised 12 people \"Let's grab coffee!\" but now you're avoiding them because you're triple-booked.",
  },
  {
    icon: <Timer className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Wrong_Time_Meeting.err',
    description: 'You finally meet that one person you really needed to talk to... at the boarding gate, 5 minutes before takeoff.',
  },
  {
    icon: <Building className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-primary shrink-0" />,
    title: 'Logistics_Failure.fatal',
    description:
      'You booked a flight at the wrong time, your hotel is too far, and you just realized the main event is tomorrow, not today.',
  },
]
