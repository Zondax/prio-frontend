'use client'

import { CustomUserButton } from '@zondax/auth-web'
import { TeamsPage } from '@zondax/ui-common/client'
import { Users } from 'lucide-react'
import { useMemo } from 'react'
import { createMockTeamOperations } from './mocks'

export function TeamUserButton() {
  const operations = useMemo(() => createMockTeamOperations(), [])

  return (
    <CustomUserButton
      profilePages={[
        {
          label: 'Teams',
          url: 'teams',
          labelIcon: <Users className="w-4 h-4" />,
          children: <TeamsPage operations={operations} />,
        },
      ]}
    />
  )
}
