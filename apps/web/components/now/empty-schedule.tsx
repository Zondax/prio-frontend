'use client'

import { format } from 'date-fns'
import { CalendarIcon, SearchIcon } from 'lucide-react'

import { EmptyState } from '@/components/empty-state'

interface EmptyScheduleProps {
  selectedDate: Date
  className?: string
}

export function EmptySchedule({ selectedDate, className = '' }: EmptyScheduleProps) {
  // Format date string for URL and display
  const dateString = format(selectedDate, 'yyyy-MM-dd')
  const formattedDate = format(selectedDate, 'MMMM d, yyyy')

  return (
    <EmptyState
      icon={CalendarIcon}
      title="Your schedule is clear"
      subtitle={
        <>You don&apos;t have any activities planned for {formattedDate}. Would you like to discover events happening on this day?</>
      }
      button={{
        href: `/explore?startDate=${dateString}&endDate=${dateString}`,
        icon: SearchIcon,
        label: 'Find events on this date',
      }}
      className={className}
    />
  )
}
