import { Bell, LogOut, Moon, Settings, Sun, User } from 'lucide-react-native'
import * as React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Text } from '~/components/ui/text'
import { useColorScheme } from '~/lib/useColorScheme'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function UserNav() {
  const insets = useSafeAreaInsets()
  const { isDarkColorScheme } = useColorScheme()

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  }
  const notifications = 3

  const avatarPicture = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces'

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 8 }}>
      <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-full">
        {isDarkColorScheme ? <Moon size={24} /> : <Sun size={24} />}
        <Text style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>Toggle theme</Text>
      </Button>

      <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-full group" onPress={() => {}}>
        <Bell size={20} />
        {notifications > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            <Text>{notifications}</Text>
          </Badge>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="relative h-8 w-8 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Avatar className="h-8 w-8" alt="User">
              <AvatarImage source={{ uri: avatarPicture }} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" insets={contentInsets} forceMount>
          <DropdownMenuLabel className="font-normal">
            <View className="flex flex-col space-y-1">
              <Text className="text-sm font-medium leading-none">Guest User</Text>
              <Text className="text-xs text-muted-foreground">guest@example.com</Text>
            </View>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Text>Option XXX</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Text>Option YYY</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Text>Settings</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button className="flex w-full items-center" onPress={() => {}}>
              <LogOut className="mr-2 h-4 w-4" />
              <Text>Sign out</Text>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
