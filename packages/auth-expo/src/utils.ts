import Constants from 'expo-constants'

export function getGrpcUrl(url: string) {
  const { expoGoConfig } = Constants

  if (!url) {
    throw new Error('URL parameter is not provided')
  }

  if (url.includes('localhost')) {
    const port = url.split(':').pop()
    return `http://${expoGoConfig.debuggerHost.split(':').shift()}:${port}`
  }

  return url
}
