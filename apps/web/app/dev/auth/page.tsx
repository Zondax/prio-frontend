'use client'

import { useAuth, useUser } from '@zondax/auth-web'
import { format } from 'date-fns'
import { Clock, KeyRound, Shield, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

import { CopyButton } from './copy-button'

interface TokenInfo {
  token: string
  expiresAt: Date | null
}

export default function WhoAmIPage() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [isLoadingToken, setIsLoadingToken] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      if (!user) return

      setIsLoadingToken(true)
      try {
        const token = await getToken()
        if (token) {
          // Decode JWT to get expiration
          const payload = JSON.parse(atob(token.split('.')[1]))
          const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null

          setTokenInfo({ token, expiresAt })
        }
      } catch (error) {
        console.error('Failed to get token:', error)
      } finally {
        setIsLoadingToken(false)
      }
    }

    if (user) {
      fetchToken()
    }
  }, [user, getToken])

  if (!isLoaded) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please sign in to view your authentication information.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
          Who Am I
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* User Information */}
          <section className="space-y-4">
            <div>
              <Label>User ID:</Label>
              <div className="flex items-center gap-2">
                <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto flex-1">{user.id}</pre>
                <CopyButton text={user.id} />
              </div>
            </div>

            <div>
              <Label>Email:</Label>
              <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">
                {user.primaryEmailAddress?.emailAddress || 'No email set'}
              </pre>
            </div>

            <div>
              <Label>Full Name:</Label>
              <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">{user.fullName || 'No name set'}</pre>
            </div>

            <div>
              <Label>Username:</Label>
              <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">{user.username || 'No username set'}</pre>
            </div>
          </section>

          {/* Account Information */}
          <section className="space-y-4">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Account Information:
            </Label>

            <div>
              <Label>Account Created:</Label>
              <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">
                {user.createdAt ? format(user.createdAt, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
              </pre>
            </div>

            <div>
              <Label>Last Sign In:</Label>
              <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">
                {user.lastSignInAt ? format(user.lastSignInAt, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
              </pre>
            </div>

            <div>
              <Label>Email Verified:</Label>
              <div className="bg-muted p-2 rounded-lg">
                <Badge variant={user.primaryEmailAddress?.verification?.status === 'verified' ? 'default' : 'secondary'}>
                  {user.primaryEmailAddress?.verification?.status || 'unverified'}
                </Badge>
              </div>
            </div>
          </section>

          {/* Token Information */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Session Token:
              </Label>
            </div>

            {tokenInfo ? (
              <>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>JWT Token:</Label>
                    <CopyButton text={tokenInfo.token} />
                  </div>
                  <pre className="bg-muted p-2 rounded-lg overflow-x-auto">
                    <code className="text-xs sm:text-sm text-foreground break-all">{tokenInfo.token}</code>
                  </pre>
                </div>

                {tokenInfo.expiresAt && (
                  <div>
                    <Label>Token Expires At:</Label>
                    <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">
                      {format(tokenInfo.expiresAt, 'yyyy-MM-dd HH:mm:ss')}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Click "Refresh Token" to load session token information.</p>
              </div>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  )
}
