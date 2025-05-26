import type { Role } from '@zondax/auth-web'
import { format, formatDuration, fromUnixTime, intervalToDuration } from 'date-fns'
import { KeyRound, Shield, User } from 'lucide-react'

import { auth } from '@/app/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CopyButton } from './copy-button'

export default async function WhoAmIPage() {
  const session = await auth()
  const user = session?.user

  // Get expiration date using date-fns
  const expirationDate = session?.token?.expires_at ? fromUnixTime(session.token.expires_at) : undefined

  // Create a duration object with the time remaining
  const duration = intervalToDuration({
    start: new Date(),
    end: expirationDate || new Date(),
  })

  // Prepare roles data for display
  const rolesArray: Role[] = session?.roles || []

  return user ? (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
          Who Am I
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Username:</Label>
            <pre className="bg-muted p-2 rounded-lg text-xs sm:text-sm overflow-x-auto">{user.email}</pre>
          </div>
          {session?.token && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Token:
              </Label>
              <div className="relative">
                <div className="flex justify-between items-center">
                  <Label>Access Token:</Label>
                  <CopyButton text={session.token.access_token} />
                </div>
                <pre className="bg-muted p-2 rounded-lg overflow-x-auto">
                  <code className="text-xs sm:text-sm text-foreground break-all">{session.token.access_token}</code>
                </pre>
              </div>
              <div className="relative">
                <Label>Refresh Token:</Label>
                <pre className="bg-muted p-2 rounded-lg overflow-x-auto">
                  <code className="text-xs sm:text-sm text-foreground break-all">{session.token.refresh_token}</code>
                </pre>
              </div>
              {/* Expires At Section */}
              <Label className="flex items-center">
                Expires At: {session?.token?.expires_at && <span className="text-xs text-gray-400 ml-2">{session.token.expires_at}</span>}
              </Label>
              <pre className="bg-muted p-2 rounded-lg overflow-x-auto">
                <code className="text-xs sm:text-sm text-foreground">
                  {expirationDate ? format(expirationDate, 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                </code>
              </pre>
              {/* Optionally show raw value for debugging/clarity */}
            </div>
          )}
          {session?.roles && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Roles:
              </Label>
              <div className="max-w-3xl overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Organization ID</TableHead>
                      <TableHead>Organization URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rolesArray.map((role) => (
                      <TableRow key={`${role.org_id}-${role.role}`}>
                        <TableCell>{role.role}</TableCell>
                        <TableCell>{role.org_id}</TableCell>
                        <TableCell>
                          {role.org_url ? (
                            <a href={role.org_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {role.org_url}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  ) : (
    <p>Please sign in to view your authentication information.</p>
  )
}
