import type { BreadcrumbDataItem } from '@zondax/ui-web/client'
import type { LucideIcon } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href: string
  icon?: LucideIcon
}

export interface RouteConfig {
  segment: string
  label: string
  icon?: LucideIcon
  pattern?: RegExp
  isParam?: boolean
  resolver?: (id: string) => BreadcrumbDataItem | null
  parentResolver?: (id: string) => BreadcrumbDataItem | null
}

export interface BreadcrumbRoute {
  segments: RouteConfig[]
  basePath: string
}
