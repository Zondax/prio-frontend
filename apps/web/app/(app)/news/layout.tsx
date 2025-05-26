import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prio | News',
  description: 'Stay updated with the latest announcements and updates.',
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>
}
