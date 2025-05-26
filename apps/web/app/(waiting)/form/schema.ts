import { z } from 'zod'

export const waitlistSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  metadata: z.string().optional(),
  'cf-turnstile-response': z.string().min(1, 'Please complete the Turnstile challenge'),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>
