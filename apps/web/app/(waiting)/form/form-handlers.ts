import type { useWaitingListStore } from '@prio-state/stores/waiting-list'

import { waitlistSchema } from './schema'

const TURNSTILE_RESPONSE = 'cf-turnstile-response' as const

interface JoinWaitlistResult {
  success: boolean
  message?: string
}

export async function joinWaitlist(
  formData: FormData,
  waitingListStore: ReturnType<typeof useWaitingListStore>
): Promise<JoinWaitlistResult> {
  try {
    const validatedFields = waitlistSchema.safeParse({
      email: formData.get('email'),
      metadata: formData.get('metadata'),
      [TURNSTILE_RESPONSE]: formData.get(TURNSTILE_RESPONSE),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: validatedFields.error.flatten().fieldErrors.email?.[0] ?? 'Invalid input',
      }
    }

    const input = {
      email: validatedFields.data.email,
      metadata: validatedFields.data.metadata ? JSON.parse(validatedFields.data.metadata) : undefined,
      turnstile: validatedFields.data[TURNSTILE_RESPONSE],
    }

    waitingListStore.setInput(input)
    await waitingListStore.forceRefresh()

    if (waitingListStore.error) {
      return {
        success: false,
        message: waitingListStore.error,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to join waitlist',
    }
  }
}
