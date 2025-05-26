'use client'

import { useSession } from '@zondax/auth-web'
import { Camera } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ProfileSettingsProps {
  saving: boolean
  onSave: () => void
}

export function ProfileSettings({ saving, onSave }: ProfileSettingsProps) {
  const { data: session } = useSession()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your photo and personal details here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>{session?.user?.name?.charAt(0) || ''}</AvatarFallback>
          </Avatar>
          <Button variant="secondary" className="gap-2">
            <Camera className="h-4 w-4" />
            Change Photo
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder={session?.user?.name || ''} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder={session?.user?.email || ''} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself" className="h-32 resize-none" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  )
}
