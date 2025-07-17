'use client'

import { useEndpointStore } from '@mono-state'
import { useUser } from '@zondax/auth-web'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@zondax/ui-common/client'

function EndpointSelector() {
  const { endpoints, selectedEndpoint, setSelectedEndpoint } = useEndpointStore()

  return (
    <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
      <SelectTrigger className="truncate">
        <SelectValue placeholder="Select endpoint" />
      </SelectTrigger>
      <SelectContent>
        {endpoints.map((url) => (
          <SelectItem key={url} value={url}>
            {url}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function EndpointSelectorItem({ showWhenAuthenticated = true }: { showWhenAuthenticated?: boolean }) {
  const { user, isLoaded } = useUser()

  if (showWhenAuthenticated && (!isLoaded || !user)) return null

  return <EndpointSelector />
}
