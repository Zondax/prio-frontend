import { refreshAccessToken } from '@zondax/auth-web'

import { auth, unstable_update, zitadelSettings } from '@/app/auth'

export async function POST(_: Request) {
  try {
    const session = await auth()

    const refreshToken = session?.token?.refresh_token
    if (!refreshToken) {
      return Response.json({ error: 'No token found' }, { status: 401 })
    }

    const newToken = await refreshAccessToken(refreshToken, zitadelSettings)

    await unstable_update({
      token: {
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token || '',
        expires_at: newToken.expires_at,
      },
    })

    return Response.json(newToken)
  } catch (error) {
    console.error(`Refresh token error: ${error}`)
    return Response.json({ error: 'Failed to refresh token' }, { status: 401 })
  }
}
