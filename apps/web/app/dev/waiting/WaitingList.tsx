'use client'

import { Construction } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WaitingListPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <Construction className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-xl">Waiting List</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">This page needs to be implemented.</p>
          <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
