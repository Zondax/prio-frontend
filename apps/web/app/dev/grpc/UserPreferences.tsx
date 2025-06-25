'use client'

import { usePreferencesStore } from '@mono-state'
import { useEndpointStore } from '@mono-state/stores'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { Input, Label, Skeleton } from '@zondax/ui-common'
import { RefreshCcw } from 'lucide-react'
import { useId } from 'react'

export default function UserPreferencesPage() {
  const { internal, isLoading, error, setParams, clientReady, forceRefresh, getData, getConfirmedData, write } = usePreferencesStore()

  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  const displayNameInputId = useId()

  const handleDisplayNameChange = (newDisplayName: string) => {
    if (!write) return

    const oldData = getData()
    if (oldData === undefined) return

    const tmp = oldData.clone()
    tmp.setDisplayName(newDisplayName)
    write(tmp)
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
        <div className="mt-4">
          <Skeleton className="h-4 w-full sm:w-[200px]" />
        </div>
      ) : (
        (() => {
          const data = getData()
          const confirmedData = getConfirmedData()
          return (
            data &&
            confirmedData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3 sm:p-4 overflow-auto">
                    <h3 className="mb-2 text-sm font-semibold">User Preferences</h3>
                    <pre className="text-xs sm:text-sm overflow-x-auto">
                      <code>{JSON.stringify(data.toObject(), null, 2)}</code>
                    </pre>
                  </div>
                  <div className="rounded-lg bg-muted p-3 sm:p-4 overflow-auto">
                    <h3 className="mb-2 text-sm font-semibold">Internal State</h3>
                    <pre className="text-xs sm:text-sm overflow-x-auto">
                      <code>
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(internal)
                              .map(([key, value]) => {
                                if (key === 'currentTransaction') {
                                  const transaction = value as { optimisticData?: { toObject: () => any } }
                                  return [key, transaction?.optimisticData?.toObject()]
                                }
                                if (key === 'latestWriteData') return [key, '{...}']
                                if (key === 'data') return [key, '{...}']
                                if (key === 'params') return [key, '{...}']
                                return [key, value]
                              })
                              .filter(([_, value]) => value !== undefined)
                          ),
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

                <div className="mt-4 space-y-2">
                  1: <Label htmlFor="displayName1">{confirmedData.toObject().displayName}</Label>
                </div>
                <div className="mt-4 space-y-2">
                  2: <Label htmlFor="displayName2">{data.toObject().displayName}</Label>
                </div>
              </>
            )
          )
        })()
      )}
    </div>
  )
}
