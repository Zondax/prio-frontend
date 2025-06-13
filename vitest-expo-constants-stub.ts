// Minimal stub for Expo Constants used in unit tests.
// Provides only the properties accessed in codebase (expoGoConfig.debuggerHost).

const Constants = {
  expoGoConfig: {
    // Typical host:port string when running Expo Go
    debuggerHost: '127.0.0.1:19000',
  },
} as const

export default Constants
