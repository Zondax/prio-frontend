'use client'

import { Button, cn } from '@zondax/ui-common'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle: React.ReactNode
  button?: {
    href?: string
    onClick?: () => void
    icon?: LucideIcon
    label?: string
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, subtitle, button, className = '' }: EmptyStateProps) {
  // Prepare button content if button exists
  const buttonContent = button?.icon && button?.label && (
    <>
      {button.icon && <button.icon className="h-3 w-3 md:h-4 md:w-4" />}
      {button.label}
    </>
  )

  return (
    <div className={cn('flex flex-col items-center justify-center bg-background space-y-6 p-6', className)}>
      <div className="text-center space-y-2 max-w-md">
        <Icon className="mx-auto h-12 w-12 md:h-20 md:w-20 text-foreground/10" role="img" aria-hidden="true" />
        <h4 className="text-xl font-semibold mt-4">{title}</h4>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      {button?.label &&
        (button.href && !button.onClick ? (
          <Link href={button.href} passHref>
            <Button className="gap-2">{buttonContent || button.label}</Button>
          </Link>
        ) : (
          <Button className="gap-2" onClick={button.onClick}>
            {buttonContent || button.label}
          </Button>
        ))}
    </div>
  )
}
