import { Suspense } from 'react'
import { DevTopMenu } from './menu-top' // Import the new component

export default function DevUILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col flex-1">
        <DevTopMenu /> {/* Use the imported component here */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<div className="p-2">Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
