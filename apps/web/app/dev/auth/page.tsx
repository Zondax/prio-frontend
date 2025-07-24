'use client'

import { useAuth, useUser } from '@zondax/auth-web'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CopyButton,
  EmptyState,
  Label,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@zondax/ui-web/client'
import { format } from 'date-fns'
import { Clock, KeyRound, Shield, User, UserCheck } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface TokenInfo {
  token: string
  expiresAt: Date | null
}

interface DataRowProps {
  label: string
  value: string | null
  copyable?: boolean
}

function DataRow({ label, value, copyable = false }: DataRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-muted-foreground w-32">{label}</TableCell>
      <TableCell className="font-mono text-sm">
        <div className="flex items-center justify-between">
          <span className="truncate">{value || 'Not set'}</span>
          {copyable && value && <CopyButton text={value} className="ml-2 flex-shrink-0" />}
        </div>
      </TableCell>
    </TableRow>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((cardId) => (
          <Card key={`auth-skeleton-card-${cardId}`}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((rowId) => (
                  <div key={`skeleton-row-${cardId}-${rowId}`} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AuthPage() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [_isLoadingToken, setIsLoadingToken] = useState(false)

  const fetchToken = useCallback(async () => {
    if (!user) return

    setIsLoadingToken(true)
    try {
      const token = await getToken()
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null
        setTokenInfo({ token, expiresAt })
      }
    } catch (error) {
      console.error('Failed to get token:', error)
    } finally {
      setIsLoadingToken(false)
    }
  }, [user, getToken])

  useEffect(() => {
    if (user) {
      fetchToken()
    }
  }, [user, fetchToken])

  if (!isLoaded) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return (
      <EmptyState
        icon={UserCheck}
        title="Authentication Required"
        subtitle="Please sign in to view your authentication information and manage your account details."
        button={{
          label: 'Sign In',
          href: '/sign-in',
        }}
      />
    )
  }

  const isEmailVerified = user.primaryEmailAddress?.verification?.status === 'verified'

  return (
    <div className="pt-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Authentication Details</h1>
          <p className="text-muted-foreground">View your account information and session details</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <DataRow label="User ID" value={user.id} copyable />
                <DataRow label="Email" value={user.primaryEmailAddress?.emailAddress || null} />
                <DataRow label="Full Name" value={user.fullName} />
                <DataRow label="Username" value={user.username} />
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">Email Status</TableCell>
                  <TableCell>
                    <Badge variant={isEmailVerified ? 'default' : 'secondary'} className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {isEmailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <DataRow label="Created" value={user.createdAt ? format(user.createdAt, 'MMM d, yyyy') : null} />
                <DataRow label="Last Sign In" value={user.lastSignInAt ? format(user.lastSignInAt, 'MMM d, yyyy') : null} />
                <DataRow label="Created Time" value={user.createdAt ? format(user.createdAt, 'h:mm a') : null} />
                <DataRow label="Last Sign In Time" value={user.lastSignInAt ? format(user.lastSignInAt, 'h:mm a') : null} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Token Information - Full Width */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Session Token
            </CardTitle>
            {tokenInfo && <CopyButton text={tokenInfo.token} variant="outline" />}
          </div>
        </CardHeader>
        <CardContent>
          {tokenInfo ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">JWT Token</Label>
                <div className="mt-1">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <code className="text-xs text-foreground break-all font-mono leading-relaxed">{tokenInfo.token}</code>
                  </div>
                </div>
              </div>

              {tokenInfo.expiresAt && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Token Expires</Label>
                    <span className="text-sm font-mono">{format(tokenInfo.expiresAt, 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <EmptyState
              icon={KeyRound}
              title="No Token Loaded"
              subtitle="Refresh the page to load your current session token information."
              className="py-8"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
