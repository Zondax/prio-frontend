'use client'

import { DebugGrid } from '@/components/debug/debug-grid'
import DebugLayout from '@/components/debug/debug-layout'
// DebugScenarioWrapper is no longer needed as we are creating multiple direct grid scenarios
import { EventCard } from '@/components/explore/event-card'
import type { FormattedEventData } from '@prio-state/feature/events'

export default function EventCardPage() {
  const eventItems: Omit<FormattedEventData, 'isPinned'>[] = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      description: 'An annual conference discussing the latest in technology and innovation.',
      eventDate: new Date('2024-10-15T09:00:00'),
      date: '2024-10-15',
      time: '09:00 AM',
      coordinates: { latitude: 37.7837, longitude: -122.4013 }, // Moscone Center coordinates
      location: 'Moscone Center, San Francisco',
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c7da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      sourceName: 'Tech Events Inc.',
      sourceUrl: 'https://example.com/tech-conference',
      event: {} as any, // Placeholder for actual Event gRPC object
    },
    {
      id: '2',
      title: 'Art & Design Expo',
      description: 'Explore contemporary art and design from upcoming artists.',
      eventDate: new Date('2024-11-05T10:00:00'),
      date: '2024-11-05',
      time: '10:00 AM',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Downtown LA coordinates (example)
      location: 'Art Gallery Downtown',
      imageUrl:
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      sourceName: 'Creative Hub',
      sourceUrl: 'https://example.com/art-expo',
      event: {} as any,
    },
    {
      id: '3',
      title: 'Music Festival Weekend',
      description: 'Three days of live music across multiple stages.',
      eventDate: new Date('2025-01-20T12:00:00'),
      date: '2025-01-20',
      time: '12:00 PM',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Placeholder
      location: 'City Park Amphitheater',
      imageUrl:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      sourceName: 'Festivals Co.',
      sourceUrl: 'https://example.com/music-fest',
      event: {} as any,
    },
    {
      id: '4',
      title: 'Startup Pitch Night',
      description: 'Entrepreneurs pitch their innovative ideas to investors.',
      eventDate: new Date('2024-09-25T18:00:00'),
      date: '2024-09-25',
      time: '06:00 PM',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Placeholder
      location: 'Innovation Hub',
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
      sourceName: 'Startup Link',
      sourceUrl: 'https://example.com/pitch-night',
      event: {} as any,
    },
    {
      id: '5',
      title: 'Food Truck Rally',
      description: 'A variety of food trucks offering delicious street food.',
      eventDate: new Date('2024-10-02T17:00:00'),
      date: '2024-10-02',
      time: '05:00 PM',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Placeholder
      location: 'Downtown Square',
      imageUrl:
        'https://images.unsplash.com/photo-1576647684801-061057384379?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      sourceName: 'Street Foodies',
      sourceUrl: 'https://example.com/food-rally',
      event: {} as any,
    },
    {
      id: '6',
      title: 'Indie Film Screening',
      description: 'Showcasing independent films from around the world.',
      eventDate: new Date('2024-12-01T19:00:00'),
      date: '2024-12-01',
      time: '07:00 PM',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Placeholder
      location: 'Art House Cinema',
      imageUrl:
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      sourceName: 'Film Buffs Society',
      sourceUrl: 'https://example.com/film-screening',
      event: {} as any,
    },
  ]

  const handleEventClick = (clickedEventData: FormattedEventData) => {
    // eslint-disable-next-line no-console
    console.log('Event clicked:', clickedEventData)
  }

  return (
    <DebugLayout index={2}>
      <h1 className="text-2xl font-bold mb-6">Event Card Grid Configurations</h1>

      <DebugGrid title="3 Columns, default colSpan=1" numCols={3} childColSpan={1}>
        {eventItems.slice(0, 3).map((item, index) => (
          <EventCard key={item.id} eventData={item} onEventClick={handleEventClick} isPinned={index === 1} />
        ))}
      </DebugGrid>

      <DebugGrid title="4 Columns, default colSpan=1, one item colSpan=2" numCols={4} childColSpan={1}>
        {eventItems.slice(0, 3).map((item) => (
          <EventCard key={item.id} eventData={item} onEventClick={handleEventClick} />
        ))}
        <EventCard key={eventItems[3].id} eventData={eventItems[3]} onEventClick={handleEventClick} colSpan={2} isPinned />
      </DebugGrid>

      <DebugGrid title="2 Columns, default colSpan=1" numCols={2} childColSpan={1}>
        {eventItems.map((item) => (
          <EventCard key={item.id} eventData={item} onEventClick={handleEventClick} />
        ))}
      </DebugGrid>

      <DebugGrid title="6 Columns, varying explicit colSpans" numCols={6} childColSpan={1}>
        <EventCard key={eventItems[0].id} eventData={eventItems[0]} onEventClick={handleEventClick} colSpan={2} />
        <EventCard key={eventItems[1].id} eventData={eventItems[1]} onEventClick={handleEventClick} colSpan={1} isPinned />
        <EventCard key={eventItems[2].id} eventData={eventItems[2]} onEventClick={handleEventClick} colSpan={3} />
        <EventCard key={eventItems[3].id} eventData={eventItems[3]} onEventClick={handleEventClick} colSpan={1} />
        <EventCard key={eventItems[4].id} eventData={eventItems[4]} onEventClick={handleEventClick} colSpan={5} isPinned />
      </DebugGrid>

      {/* --- New Test Cases --- */}

      <DebugGrid title="Grid: 3 cols, Children default: colSpan=2 (causes wrapping/overflow)" numCols={3} childColSpan={2}>
        {eventItems.slice(0, 2).map((item) => (
          <EventCard key={item.id} eventData={item} onEventClick={handleEventClick} />
        ))}
      </DebugGrid>

      <DebugGrid title="Grid: 5 cols, Children default: colSpan=1 (many items)" numCols={5} childColSpan={1}>
        {eventItems.map((item, index) => (
          <EventCard key={item.id} eventData={item} onEventClick={handleEventClick} isPinned={index % 2 === 0} />
        ))}
      </DebugGrid>

      <DebugGrid title="Grid: 4 cols, Single child: explicit colSpan=4" numCols={4} childColSpan={1}>
        <EventCard key={eventItems[0].id} eventData={eventItems[0]} onEventClick={handleEventClick} colSpan={4} isPinned />
      </DebugGrid>

      <DebugGrid title="Grid: 6 cols, Mixed: default colSpan=1, some explicit (complex layout)" numCols={6} childColSpan={1}>
        <EventCard key={eventItems[0].id} eventData={eventItems[0]} onEventClick={handleEventClick} />
        <EventCard key={eventItems[1].id} eventData={eventItems[1]} onEventClick={handleEventClick} colSpan={2} isPinned />
        <EventCard key={eventItems[2].id} eventData={eventItems[2]} onEventClick={handleEventClick} />
        <EventCard key={eventItems[3].id} eventData={eventItems[3]} onEventClick={handleEventClick} colSpan={3} />
        <EventCard key={eventItems[4].id} eventData={eventItems[4]} onEventClick={handleEventClick} isPinned />
      </DebugGrid>

      <DebugGrid title="Grid: 2 cols, Children default: colSpan=2" numCols={2} childColSpan={2}>
        {eventItems.slice(0, 3).map((item, index) => (
          <EventCard key={item.id} eventData={item} onEventClick={handleEventClick} isPinned={index === 0} />
        ))}
      </DebugGrid>
    </DebugLayout>
  )
}
