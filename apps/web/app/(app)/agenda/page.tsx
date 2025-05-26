'use client'

import { addDays, format, subDays } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'

import { ViewTypeProvider } from '@/components/now/list-view/view-type-context'
import TimelineScheduler from '@/components/now/timeline-scheduler'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EVENT_WIDTH, SHOW_SLOT_TIME, SLOT_DURATION_MINUTES, SLOT_HEIGHT } from '@/config/now'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const DateSelector = memo(function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  // Format date string once to avoid recalculating during renders
  const formattedDate = useMemo(() => (selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select date'), [selectedDate])

  const handlePrevDay = useCallback(() => {
    onDateChange(subDays(selectedDate, 1))
  }, [selectedDate, onDateChange])

  const handleNextDay = useCallback(() => {
    onDateChange(addDays(selectedDate, 1))
  }, [selectedDate, onDateChange])

  const handleToday = useCallback(() => {
    onDateChange(new Date())
  }, [onDateChange])

  return (
    <TooltipProvider>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center rounded-lg border bg-background shadow-xs overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevDay}
                className="h-9 w-9 rounded-none hover:bg-muted"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous day</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Previous day</p>
            </TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 px-4 py-2 font-normal flex items-center gap-2 min-w-[220px] justify-center rounded-none transition-colors hover:bg-muted focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{formattedDate}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                initialFocus
                className="rounded-md border-0"
              />
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextDay}
                className="h-9 w-9 rounded-none hover:bg-muted"
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next day</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Next day</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="font-medium h-9 px-4 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 border shadow-xs transition-colors"
              onClick={handleToday}
              aria-label="Go to today"
            >
              Today
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Go to today</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
})

function AgendaContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleSetDate = useCallback((date: Date) => {
    if (!date || Number.isNaN(date.getTime())) {
      // If invalid date, use current date as fallback
      setSelectedDate(new Date())
      return
    }
    setSelectedDate(date)
  }, [])

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="px-4 pt-4">
        <DateSelector selectedDate={selectedDate} onDateChange={handleSetDate} />
      </div>
      <div className="h-full w-full overflow-y-auto">
        <TimelineScheduler
          slotDurationMinutes={SLOT_DURATION_MINUTES}
          showSlotTime={SHOW_SLOT_TIME}
          slotHeight={SLOT_HEIGHT}
          eventWidth={EVENT_WIDTH}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  )
}

export default function AgendaPage() {
  return (
    <ViewTypeProvider>
      <AgendaContent />
    </ViewTypeProvider>
  )
}
