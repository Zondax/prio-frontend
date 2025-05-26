'use client'

import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { Calendar, Search } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Button } from '../ui/button'
import { Text } from '../ui/text'

interface EmptyScheduleProps {
  selectedDate: Date
  className?: string
}

export function EmptySchedule({ selectedDate, className = '' }: EmptyScheduleProps) {
  const router = useRouter()

  // Format date string for URL and display
  const dateString = format(selectedDate, 'yyyy-MM-dd')
  const formattedDate = format(selectedDate, 'MMMM d, yyyy')

  const handleFindEvents = () => {
    // Navigate to the explore tab with start and end date parameters
    // In expo-router, you can use the tab name directly for tabs navigation
    router.push({
      pathname: '/(protected)/(tabs)',
      params: {
        startDate: dateString,
        endDate: dateString,
      },
    })
  }

  return (
    <View style={[styles.container]} className={`bg-background border border-border rounded-lg ${className}`}>
      <View style={styles.content}>
        <Calendar size={64} className="text-muted-foreground/50 mx-auto" />
        <Text style={styles.title} className="font-semibold">
          Your schedule is clear
        </Text>
        <Text style={styles.description} className="text-muted-foreground text-center">
          You don't have any activities planned for {formattedDate}. Would you like to discover events happening on this day?
        </Text>
      </View>

      <Button className="flex-row items-center gap-2" onPress={handleFindEvents}>
        <Search size={16} />
        <Text>Find events on this date</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
  },
})
