import { create } from 'zustand'

// Base state structure for the endpoint store
type State = {
  // List of available API endpoints
  endpoints: string[]
  // Currently selected endpoint
  selectedEndpoint: string
  // Token for the currently selected endpoint
  token: string | undefined
}

// Actions available to modify the endpoint store
type Actions = {
  // Update the list of available endpoints
  setEndpoints: (endpoints: string[]) => void

  // Update the currently selected endpoint
  setSelectedEndpoint: (endpoint: string) => void

  // Update the token for the currently selected endpoint
  setToken: (token: string) => void
}

// Combined type for the complete store
type EndpointStore = State & Actions

// Get the default server from environment variables, supporting both Next.js and Expo
const getDefaultServer = (): string => {
  return process.env.NEXT_PUBLIC_GRPC_SERVER || process.env.EXPO_PUBLIC_GRPC_SERVER || ''
}

// Default list of endpoints from environment variables
// Filters out empty strings from the array
const defaultEndpoints = [getDefaultServer(), 'http://localhost:9080'].filter(Boolean)

// Initial state for the endpoint store
const defaultState: State = {
  endpoints: defaultEndpoints,
  selectedEndpoint: defaultEndpoints[0],
  token: undefined,
}

// Store for managing API endpoints
// Handles the list of available endpoints and the currently selected endpoint
export const useEndpointStore = create<EndpointStore>((set, get) => ({
  ...defaultState,

  setEndpoints: (endpoints) => set({ endpoints }),

  setSelectedEndpoint: (selectedEndpoint) => {
    set({ selectedEndpoint })
    console.log(`changed to selectedEndpoint: ${selectedEndpoint}`)
  },

  setToken: (token) => {
    if (get().token !== token) {
      set({ token })
    }
  },
}))

// Simplified hooks for accessing store values
export const useSelectedEndpoint = () => useEndpointStore((state) => state.selectedEndpoint)
export const useEndpoints = () => useEndpointStore((state) => state.endpoints)
