import { auth } from '@/app/auth'
import DebugLayout from '@/components/debug/debug-layout'
import EndpointSelector from '@/components/debug/endpoint-selector'
import { FloatingSettingsPanel } from '@/components/debug/floating-settings-panel'
import { TopBar } from '@/components/topbar'
import { topBarItems } from './config'

export const metadata = {
  title: 'Dev Environment',
  description: 'Development and testing environment',
}

async function CustomNavigation() {
  const session = await auth()
  const isAuthenticated = !!session?.user

  if (!isAuthenticated) {
    return <></>
  }

  return <EndpointSelector />
}

export default async function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      <DebugLayout index={1}>
        <TopBar menuItems={topBarItems}>
          <CustomNavigation />
        </TopBar>

        <main className="flex-1 overflow-auto">
          {children}
          <FloatingSettingsPanel />
        </main>
      </DebugLayout>
    </div>
  )
}
