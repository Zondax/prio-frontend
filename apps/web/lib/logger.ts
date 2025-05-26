/**
 * Simple logger that only logs when debug is enabled
 */
export function createLogger(enabled: boolean, componentId: string) {
  const logPrefix = `[VirtualizedGrid:${componentId}]`

  return {
    info: (message: string, ...args: any[]) => {
      if (enabled) {
        console.info(`${logPrefix} ${message}`, ...args)
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (enabled) {
        console.warn(`${logPrefix} ${message}`, ...args)
      }
    },
    error: (message: string, ...args: any[]) => {
      if (enabled) {
        console.error(`${logPrefix} ${message}`, ...args)
      }
    },
    // Custom logger for tagged information
    custom: (tag: string, message: string, ...args: any[]) => {
      if (enabled) {
        console.info(`${logPrefix} %c[${tag}]%c ${message}`, 'color: #4f46e5; font-weight: bold;', '', ...args)
      }
    },
  }
}
