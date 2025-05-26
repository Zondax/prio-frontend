'use client'

import { useSession } from '@zondax/auth-web'
import { Bell, Eye, Palette, Shield, User } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import { AccountSettings } from './components/account-settings'
import { DisplaySettings } from './components/display-settings'
import { NotificationsSettings } from './components/notifications-settings'
import { PrivacySettings } from './components/privacy-settings'
import { ProfileSettings } from './components/profile-settings'

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'display', label: 'Display', icon: Palette },
]

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const { data: session } = useSession()

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    toast({
      title: 'Settings saved',
      description: 'Your changes have been saved successfully.',
    })
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings saving={saving} onSave={handleSave} />
      case 'account':
        return <AccountSettings />
      case 'notifications':
        return <NotificationsSettings saving={saving} onSave={handleSave} />
      case 'privacy':
        return <PrivacySettings saving={saving} onSave={handleSave} />
      case 'display':
        return <DisplaySettings saving={saving} onSave={handleSave} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Separator />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 space-y-2">
          {settingsSections.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                'flex items-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                activeSection === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </aside>
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  )
}
