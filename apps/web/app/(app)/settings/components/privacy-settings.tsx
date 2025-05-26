'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface PrivacySettingsProps {
  saving: boolean
  onSave: () => void
}

export function PrivacySettings({ saving, onSave }: PrivacySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control your privacy and data sharing preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Choose who can see your profile</p>
            </div>
            <Select defaultValue="authenticated">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="authenticated">Authenticated Users</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Data Sharing</h4>
            {['Allow usage data collection', 'Share analytics with partners', 'Personalized recommendations'].map((setting) => (
              <div key={setting} className="flex items-center justify-between">
                <Label>{setting}</Label>
                <Switch defaultChecked={setting === 'Allow usage data collection'} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Update Privacy Settings'}
        </Button>
      </CardFooter>
    </Card>
  )
}
