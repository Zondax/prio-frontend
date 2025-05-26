'use client'

import { ThemeSelector } from '@/components/theming/theme-selector'
import { backgroundStyles } from '../../mocks/scenarios'

export default function ThemeTogglePage() {
  return (
    <div className="space-y-8">
      {backgroundStyles.map((style: (typeof backgroundStyles)[number]) => (
        <div key={style.name} className={`p-4 ${style.bg} ${style.position} rounded-md`}>
          <ThemeSelector />
        </div>
      ))}
    </div>
  )
}
