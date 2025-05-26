import { type Href, router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { Button, type ButtonProps } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface EmptyStateButtonProps {
  href?: Href
  onPress?: () => void
  icon?: React.ComponentType<{ className?: string }>
  label?: string
  variant?: ButtonProps['variant']
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: React.ReactNode
  button?: EmptyStateButtonProps
  className?: string
}

/**
 * EmptyState
 *
 * @param icon - Icon component (e.g. from lucide-react-native)
 * @param title - Title string
 * @param subtitle - Subtitle or description
 * @param button - Optional button config (onPress, icon, label, variant)
 * @param className - Optional extra className for root View
 */
export function EmptyState({ icon: Icon, title, subtitle, button, className = '' }: EmptyStateProps) {
  const ButtonIcon = button?.icon

  const handleButtonPress = () => {
    if (button?.href) {
      router.push(button.href)
    } else if (button?.onPress) {
      button.onPress()
    }
  }

  return (
    <View className={cn('items-center justify-center bg-background rounded-lg space-y-6 p-6', className)}>
      <View className="items-center space-y-2 max-w-md">
        <Icon className="mb-2 h-12 w-12 text-muted-foreground/50" />
        <Text className="text-lg font-semibold mt-4 text-center">{title}</Text>
        <Text className="text-muted-foreground text-center">{subtitle}</Text>
      </View>
      {button?.label && (
        <Button onPress={handleButtonPress} variant={button.variant || 'default'} className="flex-row items-center gap-2 px-4 py-3 mt-4">
          {ButtonIcon && <ButtonIcon className="mr-2 h-4 w-4" />}
          <Text>{button.label}</Text>
        </Button>
      )}
    </View>
  )
}
