import { Card, CardContent, CardHeader, CardTitle } from '@zondax/ui-common'
import { User } from 'lucide-react'

import UserPreferencesPage from './UserPreferences'

export default async function GrpcPage() {
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
