'use client'

import { Logo } from '@/components/topbar'
import { backgroundStyles } from '../../mocks/scenarios'

export default function LogosPage() {
  return (
    <div className="space-y-8">
      {backgroundStyles.map((style: (typeof backgroundStyles)[number]) => (
        <div key={style.name} className={`p-4 ${style.bg} ${style.position} rounded-md`}>
          <Logo />
        </div>
      ))}
    </div>
  )
}
