import type { Router } from 'expo-router'

export const navigate = (router: Router, route: string) => {
  try {
    router.push(route as any)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

export const replace = (router: Router, route: string) => {
  try {
    router.replace(route as any)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}
