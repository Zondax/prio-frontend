'use client'

import { useEndpointStore } from '@mono-state'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Extracted EndpointSelector component
export default function EndpointSelector() {
  const { endpoints, selectedEndpoint, setSelectedEndpoint } = useEndpointStore()

  return (
    <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
      <SelectTrigger className="truncate">
        <SelectValue placeholder="Select endpoint" />
      </SelectTrigger>
      <SelectContent className="">
        {endpoints.map((url) => (
          <SelectItem key={url} value={url}>
            {url}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
