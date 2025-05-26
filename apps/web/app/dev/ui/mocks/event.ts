// Mock Event Data (Updated to use any and simplified)
export const mockEvent: any = {
  id: 'mock-event-1',
  title: 'Awesome Tech Meetup',
  description:
    'Join us for an exciting meetup about the latest in web development, AI, and more! Featuring great speakers and networking opportunities.',
  date: '2024-07-29',
  time: '18:00',
  location: '123 Tech Street, Innovation City',
  imageUrl:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  sourceName: 'TechEvents.com',
  sourceUrl: 'https://techevents.com',
  // These are simplified/mocked gRPC style accessors if needed by extractEventData or EventCard directly
  // If EventCard or extractEventData directly calls these, they might need to be functions like () => 'value'
  getId: () => mockEvent.id,
  getTitle: () => mockEvent.title,
  getDescription: () => mockEvent.description,
  getDate: () => ({
    // New mock for GrpcEvent.Date
    getStart: () => ({
      // Mock for google.protobuf.Timestamp
      toDate: () => new Date(`${mockEvent.date}T${mockEvent.time}`), // Combine date and time string to create a valid Date
    }),
    getEnd: () => ({
      // Mock for google.protobuf.Timestamp (optional, but good to have)
      toDate: () => new Date(new Date(`${mockEvent.date}T${mockEvent.time}`).getTime() + 2 * 60 * 60 * 1000), // e.g., 2 hours later
    }),
    getLocalTimezone: () => 'America/New_York', // Example timezone
    // Add other methods of GrpcEvent.Date if needed by extractEventData, like hasStart(), hasEnd(), clearStart(), clearEnd(), setStart(), setEnd(), setLocalTimezone()
    // For now, only getStart and getLocalTimeZone are explicitly used by extractEventData based on error.
  }),
  getTime: () => mockEvent.time, // This might still be used by EventCard directly, or extractEventData might re-calculate it. For safety, keeping a basic mock.
  getLocation: () => ({
    // New mock for proto_api_v1_common_pb.Location
    getCoordinates: () => ({
      // Mock for proto_api_v1_common_pb.Coordinates
      getLatitude: () => 34.0522,
      getLongitude: () => -118.2437,
      // Add other methods of Coordinates if needed (e.g., setLatitude, setLongitude)
    }),
    getName: () => mockEvent.location, // Use the simple string location for the name part
    getType: () => 'physical_address', // Example type
    // Add other methods of Location if needed (e.g. setType, setName, setCoordinates, hasCoordinates, clearCoordinates)
    // For now, only getCoordinates is explicitly used by extractEventData based on error.
  }),
  getImage: () => mockEvent.imageUrl,
  getSourceName: () => mockEvent.sourceName, // This will be effectively replaced by getSource().getName()
  getSourceUrl: () => mockEvent.sourceUrl, // This will be effectively replaced by getSource().getUrl()
  getSource: () => ({
    // Added getSource method
    getName: () => mockEvent.sourceName,
    getUrl: () => mockEvent.sourceUrl,
    // Add other methods of Event.Source if needed by extractEventData or EventCard
  }),
  getLatLng: () => ({ lat: 34.0522, lng: -118.2437 }),
  getTagsList: () => ['tech', 'webdev', 'ai', 'networking'],
  getRawData: () => ({}),
  getGPlaceId: () => 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  getFormattedAddress: () => '123 Tech Street, Innovation City, CA 90210',
  getIsPhysical: () => true,
  getIsVirtual: () => false,
  getSentimentList: () => [],
  getCollectionsList: () => [],
  // Add other methods as needed by EventCard or extractEventData, returning default/mock values
  // For a proper gRPC Event, many more methods would be present.
  // Example of a missing method that might be called by extractEventData or EventCard:
  getStatus: () => 0, // Mocking EventStatus.EVENT_STATUS_NONE or similar
}
