import { Feather } from '@expo/vector-icons'
import {
  addMonths,
  format,
  getDate,
  getDay,
  getDaysInMonth,
  isBefore,
  isSameDay,
  isToday,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { Button } from '~/components/ui/button'

type CalendarProps = {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  rangeSelection?: boolean
  selectedStartDate?: Date
  selectedEndDate?: Date
  onRangeChange?: (startDate: Date, endDate: Date) => void
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const Calendar = ({
  selectedDate = new Date(),
  onDateChange,
  rangeSelection = false,
  selectedStartDate,
  selectedEndDate,
  onRangeChange,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [internalStartDate, setInternalStartDate] = useState<Date | null>(selectedStartDate || null)
  const [internalEndDate, setInternalEndDate] = useState<Date | null>(selectedEndDate || null)

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1))
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))
  }, [])

  const handleDateSelect = useCallback(
    (day: Date) => {
      if (!rangeSelection) {
        onDateChange?.(day)
        return
      }

      // Range selection logic
      if (!internalStartDate || (internalStartDate && internalEndDate)) {
        // Start a new range
        setInternalStartDate(day)
        setInternalEndDate(null)
        onRangeChange?.(day, day)
      } else {
        // Complete the range
        if (isBefore(day, internalStartDate)) {
          // If selected date is before start date, swap them
          setInternalEndDate(internalStartDate)
          setInternalStartDate(day)
          onRangeChange?.(day, internalStartDate)
        } else {
          setInternalEndDate(day)
          onRangeChange?.(internalStartDate, day)
        }
      }
    },
    [rangeSelection, internalStartDate, internalEndDate, onDateChange, onRangeChange]
  )

  const renderDays = useMemo(() => {
    return DAYS_OF_WEEK.map((day) => (
      <Text key={day} className="flex-1 text-center text-xs font-semibold text-muted-foreground">
        {day}
      </Text>
    ))
  }, [])

  const renderDates = useCallback(() => {
    const monthStart = startOfMonth(currentMonth)
    const daysInMonth = getDaysInMonth(monthStart)
    const startDay = getDay(monthStart)

    const blanks = Array(startDay).fill(null)
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
      return date
    })

    const allCells = [...blanks, ...days]

    return allCells.map((date, i) => {
      if (!date) {
        return (
          <View
            key={`blank-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${i}`}
            className="w-[14.28%] aspect-square justify-center items-center p-0 m-0"
          />
        )
      }

      const isSelected = !rangeSelection && selectedDate && isSameDay(date, selectedDate)
      const isTodayDate = isToday(date)

      let isInRange = false
      let isRangeStart = false
      let isRangeEnd = false

      if (rangeSelection && internalStartDate) {
        isRangeStart = isSameDay(date, internalStartDate)

        if (internalEndDate) {
          isRangeEnd = isSameDay(date, internalEndDate)
          isInRange = isWithinInterval(date, {
            start: internalStartDate,
            end: internalEndDate,
          })
        }
      }

      return (
        <Button
          key={date.toString()}
          size="icon"
          variant={isSelected || isRangeStart || isRangeEnd ? 'default' : isInRange ? 'secondary' : 'ghost'}
          className={`w-[14.28%] aspect-square justify-center items-center p-0 m-0 ${
            isInRange && !isRangeStart && !isRangeEnd ? 'bg-primary/15' : ''
          } ${isTodayDate && !isSelected && !isRangeStart && !isRangeEnd ? 'bg-muted' : ''}`}
          onPress={() => handleDateSelect(date)}
        >
          <Text
            className={`text-sm ${
              isSelected || isRangeStart || isRangeEnd ? 'text-primary-foreground font-semibold' : 'text-foreground'
            } ${isInRange && !isRangeStart && !isRangeEnd ? 'text-primary' : ''} ${isTodayDate ? 'font-bold' : ''}`}
          >
            {getDate(date)}
          </Text>
        </Button>
      )
    })
  }, [currentMonth, selectedDate, rangeSelection, internalStartDate, internalEndDate, handleDateSelect])

  return (
    <View className="bg-card rounded-xl p-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onPress={goToPreviousMonth}>
          <Feather name="chevron-left" size={24} color="currentColor" />
        </Button>

        <Text className="text-lg font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy')}</Text>

        <Button variant="ghost" size="icon" onPress={goToNextMonth}>
          <Feather name="chevron-right" size={24} color="currentColor" />
        </Button>
      </View>

      <View className="flex-row justify-around mb-2">{renderDays}</View>

      <View className="flex-row flex-wrap">{renderDates()}</View>
    </View>
  )
}

export default Calendar
