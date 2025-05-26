import { useEffect, useState } from 'react'

// This is a trick to detect if we are running client side
// Critically, useEffect does NOT run on the server.
// Effects are a client-side mechanism that runs after the component has been rendered to the DOM.
// so only client side this will be set to true
export function useIsClientSide() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
