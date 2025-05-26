import { Database, User } from 'lucide-react'

import { auth } from '@/app/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import CollectionsPage from './Collections'
import UserPreferencesPage from './UserPreferences'

export default async function GrpcPage() {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>GRPC Playground</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preferences" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                User Preferences
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Collections
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preferences" className="mt-4">
              <UserPreferencesPage />
            </TabsContent>
            <TabsContent value="collections" className="mt-4">
              <CollectionsPage />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
