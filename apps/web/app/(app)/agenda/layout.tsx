import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prio | Agenda',
  description: 'See your schedule',
}

export default function AgendaLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>
}
