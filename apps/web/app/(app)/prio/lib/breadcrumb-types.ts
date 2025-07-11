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
  resolver?: (id: string) => BreadcrumbItem | null
  parentResolver?: (id: string) => BreadcrumbItem | null
}

export interface BreadcrumbRoute {
  segments: RouteConfig[]
  basePath: string
}
