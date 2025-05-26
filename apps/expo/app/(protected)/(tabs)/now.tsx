'use client'

import type { Event } from '@prio-state'
import { addDays, format, subDays } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Modal, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Calendar from '~/components/calendar'
import { EventCard } from '~/components/explore/event-card'
import { EventDetails } from '~/components/explore/event-details'
import ActivityListView from '~/components/now/list-view/activity-list-view'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const DateSelector = React.memo(function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const formattedDate = useMemo(() => format(selectedDate, 'EEEE, MMMM d'), [selectedDate])

  const handlePrevDay = useCallback(() => {
    onDateChange(subDays(selectedDate, 1))
  }, [selectedDate, onDateChange])

  const handleNextDay = useCallback(() => {
    onDateChange(addDays(selectedDate, 1))
  }, [selectedDate, onDateChange])

  const handleToday = useCallback(() => {
    onDateChange(new Date())
  }, [onDateChange])

  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <View className="mb-4 px-4">
      <View className="flex-row items-center justify-between">
        <Card className="flex-row items-center justify-between">
          <Button variant="ghost" size="icon" onPress={handlePrevDay} accessibilityLabel="Previous day">
            <ChevronLeft size={16} />
          </Button>

          <Button
            variant="ghost"
            onPress={() => setShowCalendar(!showCalendar)}
            className="h-9 px-4 py-2 flex-row items-center justify-center"
          >
            <CalendarIcon size={16} className="text-foreground" />
            <Text className="font-medium text-sm ml-2 text-foreground">{formattedDate}</Text>
          </Button>

          <Button variant="ghost" size="icon" onPress={handleNextDay} accessibilityLabel="Next day">
            <ChevronRight size={16} />
          </Button>
        </Card>

        <Button variant="outline" onPress={handleToday} className="h-9 px-4" accessibilityLabel="Go to today">
          <Text className="font-medium text-foreground">Today</Text>
        </Button>
      </View>

      {showCalendar && (
        <Modal visible={showCalendar} transparent={true} animationType="fade" onRequestClose={() => setShowCalendar(false)}>
          <View className="flex-1 justify-center items-center bg-background/50">
            <View className="bg-card rounded-lg overflow-hidden shadow-lg m-4 w-11/12 max-w-md">
              <Calendar
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  onDateChange(date)
                  setShowCalendar(false)
                }}
              />
              <Button variant="ghost" onPress={() => setShowCalendar(false)} className="m-2">
                <Text className="text-foreground">Close</Text>
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
})

export default function NowScreen() {
  const insets = useSafeAreaInsets()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event)
  }, [])

  const renderActivityDetails = useCallback(
    (event: Event) => (
      <EventCard event={event} onEventClick={handleEventClick} isCompact={true} showExternalLink={true} showPinIcon={false} />
    ),
    [handleEventClick]
  )

  const handleSetDate = useCallback((date: Date) => {
    if (!date || Number.isNaN(date.getTime())) {
      setSelectedDate(new Date())
      return
    }
    setSelectedDate(date)
  }, [])

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-background">
      <View style={{ flex: 1 }}>
        <DateSelector selectedDate={selectedDate} onDateChange={handleSetDate} />
        <ActivityListView onEventClick={handleEventClick} renderActivityDetails={renderActivityDetails} selectedDate={selectedDate} />
      </View>

      {/* Event details dialog */}
      {selectedEvent && (
        <EventDetails eventDetailState={{ event: selectedEvent, isLoading: false }} onClose={() => setSelectedEvent(null)} />
      )}
    </View>
  )
}
