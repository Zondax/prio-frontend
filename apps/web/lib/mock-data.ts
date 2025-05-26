// Mock data for events
export type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  category: string
  isImportant: boolean
  isPinned?: boolean
  imageUrl?: string
  location: string
  attendees: number
  tags: string[]
  likes: number
  source: {
    name: string
    url: string
  }
}

export const tagCategories = {
  type: ['conf', 'workshop', 'meetup', 'webinar', 'hackathon'],
  tech: ['frontend', 'backend', 'mobile', 'ai', 'data', 'cloud', 'security'],
  level: ['beginner', 'intermediate', 'advanced'],
  format: ['hybrid', 'in-person', 'remote'],
  status: ['@draft', '@live', '@ended', '@cancelled'],
  focus: ['networking', 'learning', 'collaboration', 'presentation'],
} as const

export const commonTagBundles = {
  'dev-conference': ['type/conf', 'tech/frontend', 'tech/backend', 'format/hybrid', 'focus/learning'],
  'ai-workshop': ['type/workshop', 'tech/ai', 'tech/data', 'level/intermediate', 'focus/learning'],
  'networking-event': ['type/meetup', 'format/in-person', 'focus/networking'],
  'coding-bootcamp': ['type/workshop', 'level/beginner', 'focus/learning', 'format/hybrid'],
} as const

export const categories = ['All', 'Conference', 'Workshop', 'Meetup', 'Webinar', 'Hackathon'] as const

const generateMockEvents = (count: number): Event[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${crypto.randomUUID()}`,
    title: [
      'Future of AI Conference',
      'Web Development Workshop',
      'Design Systems Meetup',
      'Startup Networking Event',
      'Tech Leadership Summit',
      'Product Strategy Workshop',
      'UX Research Symposium',
      'Mobile Development Bootcamp',
    ][i % 8],
    description:
      'Join us for an exciting event that brings together industry leaders and innovators to explore the latest trends and technologies.',
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    time: '10:00 AM',
    category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
    isImportant: i % 5 === 0,
    tags: [
      ...commonTagBundles['dev-conference,ai-workshop,networking-event,coding-bootcamp'.split(',')[i % 4] as keyof typeof commonTagBundles],
      `@${['live', 'draft'][i % 2]}`,
    ],
    imageUrl: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    ][i % 4],
    location: ['San Francisco, CA', 'New York, NY', 'London, UK', 'Tokyo, Japan'][i % 4],
    attendees: Math.floor(Math.random() * 200) + 50,
    likes: Math.floor(Math.random() * 100) + 10,
    source: {
      name: ['Luma', 'Eventbrite', 'Meetup', 'DevTo'][i % 4],
      url: ['https://lu.ma', 'https://eventbrite.com', 'https://meetup.com', 'https://dev.to'][i % 4],
    },
  }))
}

export const fetchMockEvents = async (page = 1, limit = 12): Promise<{ events: Event[]; hasMore: boolean }> => {
  const allEvents = generateMockEvents(50)
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedEvents = allEvents.slice(start, end)

  return {
    events: paginatedEvents,
    hasMore: end < allEvents.length,
  }
}
