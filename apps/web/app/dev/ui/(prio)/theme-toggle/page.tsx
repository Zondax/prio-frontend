'use client'

import { ThemeSelector } from '@/components/theming/theme-selector'

const backgroundStyles = [
  { name: 'Light', bg: 'bg-white', position: 'text-black' },
  { name: 'Dark', bg: 'bg-black', position: 'text-white' },
  { name: 'Gray', bg: 'bg-gray-500', position: 'text-white' },
]

export default function ThemeTogglePage() {
  return (
    <div className="space-y-8">
      {backgroundStyles.map((style) => (
        <div key={style.name} className={`p-4 ${style.bg} ${style.position} rounded-md`}>
          <ThemeSelector />
        </div>
      ))}
    </div>
  )
}
