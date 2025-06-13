// Vitest stub for the react-native module used in unit tests running in jsdom
export const Platform = {
  OS: 'web',
  select: (obj: Record<string, any>) => obj?.web ?? obj?.default,
}

export default {
  Platform,
}
