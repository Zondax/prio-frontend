'use client'

import { Bell, Mail, Smartphone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface NotificationsSettingsProps {
  saving: boolean
  onSave: () => void
}

export function NotificationsSettings({ saving, onSave }: NotificationsSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <Label>Email Notifications</Label>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <Label>Push Notifications</Label>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <Label>Mobile Notifications</Label>
          </div>
          <Switch />
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Categories</h4>
          <div className="grid gap-4">
            {['Security Alerts', 'News Updates', 'Product Changes', 'Marketing'].map((category) => (
              <div key={category} className="flex items-center justify-between">
                <Label>{category}</Label>
                <Switch defaultChecked={category === 'Security Alerts'} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  )
}
