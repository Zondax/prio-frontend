'use client'

import { AlertTriangle } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Button } from '../ui/button'
import { Text } from '../ui/text'

interface ErrorScheduleProps {
  error: Error | string | unknown
  onRetry?: () => void
  className?: string
}

export function ErrorSchedule({ error, onRetry }: ErrorScheduleProps) {
  // Format the error message
  const errorMessage = error instanceof Error ? error.message : String(error).replace(/\[.*?\]/g, '')

  return (
    <View style={styles.container} className="bg-background border border-border rounded-lg">
      <View style={styles.content}>
        <AlertTriangle size={64} className="text-destructive mx-auto" />
        <Text style={styles.title} className="font-semibold">
          Unable to load activities
        </Text>
        <Text style={styles.description} className="text-muted-foreground text-center">
          We encountered an error while trying to load your activities.
        </Text>
        <View style={styles.errorContainer} className="bg-destructive/10 border border-destructive/20 rounded-md">
          <Text style={styles.errorText} className="text-destructive font-medium">
            {errorMessage}
          </Text>
        </View>
      </View>

      {onRetry && (
        <Button className="flex-row items-center gap-2" onPress={onRetry}>
          <Text>Try again</Text>
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    gap: 24,
  },
  content: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 8,
  },
  errorContainer: {
    padding: 12,
    width: '100%',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
  },
})
