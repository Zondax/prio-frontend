import DebugLayout from '@/components/debug/debug-layout'

export const metadata = {
  title: 'Collections',
  description: 'Manage your saved event collections',
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-full">
      <DebugLayout index={3}>{children}</DebugLayout>
    </div>
  )
}
