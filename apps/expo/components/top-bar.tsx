'use client'

import { DrawerActions, useNavigation } from '@react-navigation/native'
import { Menu } from 'lucide-react-native'
import * as React from 'react'
import { View } from 'react-native'
import { Button } from '~/components/ui/button'
import { UserNav } from '~/components/user-nav'

export function TopBar() {
  const navigation = useNavigation()

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}
    >
      <Button variant="ghost" size="icon" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Menu size={24} />
      </Button>
      <UserNav />
    </View>
  )
}
