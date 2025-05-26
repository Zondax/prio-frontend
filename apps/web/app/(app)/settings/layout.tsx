import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prio | Settings',
  description: 'Manage your account settings and preferences.',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1">{children}</div>
}
