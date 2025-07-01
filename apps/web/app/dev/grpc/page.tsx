'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@zondax/ui-common/client'
import { User } from 'lucide-react'

import UserPreferencesPage from './UserPreferences'

export default function GrpcPage() {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>GRPC Playground</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4" />
              <h3 className="text-lg font-semibold">User Preferences</h3>
            </div>
            <UserPreferencesPage />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
