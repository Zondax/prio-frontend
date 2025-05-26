import { User } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import WaitingListPage from './WaitingList'

export default async function GrpcPage() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Waiting List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WaitingListPage />
      </CardContent>
    </Card>
  )
}
