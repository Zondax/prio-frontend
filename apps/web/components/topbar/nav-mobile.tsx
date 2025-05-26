'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Logo } from '@/components/topbar/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { TopBarItems } from '.'

interface NavMobileProps {
  menuItems: TopBarItems
  isVisible: boolean
  forceShowTrigger?: boolean
}

export function NavMobile({ menuItems, isVisible, forceShowTrigger }: NavMobileProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (!isVisible) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
            forceShowTrigger ? 'flex' : 'md:hidden'
          )}
        >
          <Menu className="size-6" strokeWidth={2.5} />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs flex flex-col [&>button[aria-label='Close']]:hidden">
        <SheetHeader className="flex ml-1 mt-1 border-b shrink-0" style={{ height: 'calc(var(--topbar-height) + 0.80rem)' }}>
          <SheetTitle className="flex items-left gap-0">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col flex-grow overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'text-base font-normal transition-colors px-3 py-2.5 rounded-md hover:bg-muted',
                pathname === item.href
                  ? 'bg-cloud-haze dark:bg-midnight-ridge text-midnight-ridge dark:text-fog'
                  : 'text-midnight-ridge dark:text-fog hover:text-clear-horizon'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
