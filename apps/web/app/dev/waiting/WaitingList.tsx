'use client'

import { useWaitingUsersStore } from '@prio-state'
import { useEndpointStore } from '@prio-state/stores'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function WaitingListPage() {
  const { setParams, setInput, forceRefresh, getData, isLoading, error, clientReady } = useWaitingUsersStore()

  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  // Initialize input once
  useEffect(() => {
    setInput({
      emailFilter: '',
      pageSize: 10,
      page: 1,
    })
  }, [setInput])

  // Format timestamp from seconds to readable date
  const formatDate = (seconds: number) => {
    if (!seconds) return 'N/A'
    return new Date(seconds * 1000).toLocaleString()
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={forceRefresh}
          className="rounded-lg border p-2 w-full sm:w-32 flex items-center justify-center gap-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 mb-2"
          disabled={isLoading || !clientReady()}
        >
          Refresh
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <div className="mt-4 text-red-500">{error}</div>}

      {isLoading ? (
        <div className="mt-4 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        (() => {
          const data = getData()
          return (
            data && (
              <div className="mt-4 space-y-6">
                {/* Summary Card */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Inscriptions:</span>
                      <span className="text-lg font-bold">{data.toObject().totalCount || 0}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Waiting List Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead className="w-[180px]">Joined At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.toObject().usersList?.map((user) => (
                          <TableRow key={user.email}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              {user.joinedAt?.seconds ? formatDate(user.joinedAt?.seconds) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )
          )
        })()
      )}
    </div>
  )
}
