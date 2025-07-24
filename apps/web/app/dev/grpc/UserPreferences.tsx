'use client'

import { usePreferencesStore } from '@mono-state'
import { useEndpointStore } from '@mono-state/stores'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { Input, Label, Skeleton } from '@zondax/ui-web/client'
import { RefreshCcw } from 'lucide-react'
import { useId } from 'react'

export default function UserPreferencesPage() {
  const { setParams, refresh, getData, write, isLoading, getError } = usePreferencesStore()

  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  const displayNameInputId = useId()

  const handleDisplayNameChange = (newDisplayName: string) => {
    if (!write) return

    const oldData = getData()
    if (oldData === undefined || oldData === null) return

    const tmp = oldData.clone()
    tmp.setDisplayName(newDisplayName)
    write(tmp)
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={refresh}
          className="rounded-lg border p-2 w-full sm:w-32 flex items-center justify-center gap-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 mb-2"
          disabled={isLoading('read')}
        >
          Refresh
          <RefreshCcw className={`h-4 w-4 ${isLoading('read') ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {getError('read') && <div className="mt-4 text-red-500">{getError('read')?.message || String(getError('read'))}</div>}

      {isLoading('read') ? (
        <div className="mt-4">
          <Skeleton className="h-4 w-full sm:w-[200px]" />
        </div>
      ) : (
        (() => {
          const data = getData()
          return (
            data && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3 sm:p-4 overflow-auto">
                    <h3 className="mb-2 text-sm font-semibold">User Preferences</h3>
                    <pre className="text-xs sm:text-sm overflow-x-auto">
                      <code>{JSON.stringify(data.toObject(), null, 2)}</code>
                    </pre>
                  </div>
                  <div className="rounded-lg bg-muted p-3 sm:p-4 overflow-auto">
                    <h3 className="mb-2 text-sm font-semibold">Store State</h3>
                    <pre className="text-xs sm:text-sm overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          {
                            isLoading: isLoading('read'),
                            error: getError('read'),
                            lastUpdated: data ? 'Available' : 'None',
                          },
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor={displayNameInputId}>Display Name</Label>
                  <Input
                    id={displayNameInputId}
                    value={data.toObject().displayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    className="w-full max-w-[400px]"
                  />
                </div>
              </>
            )
          )
        })()
      )}
    </div>
  )
}
