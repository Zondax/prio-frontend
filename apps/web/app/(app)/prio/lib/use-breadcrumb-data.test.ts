import { renderHook } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBreadcrumbData } from './use-breadcrumb-data'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

// Mock data functions
vi.mock('@/app/(app)/prio/store/prio-mock-data', () => ({
  MISSIONS: {
    'mission-1': { name: 'Test Mission 1' },
    'mission-2': { name: 'Test Mission 2' },
  },
  getObjectiveDetail: vi.fn((id: string) => {
    if (id === 'obj-1') {
      return { title: 'Test Objective', missionId: 'mission-1', missionName: 'Test Mission 1' }
    }
    return null
  }),
  getChatInfo: vi.fn((id: string) => {
    if (id === 'chat-1') {
      return { name: 'Test Chat', missionId: 'mission-1', missionName: 'Test Mission 1' }
    }
    return null
  }),
}))

describe('useBreadcrumbData', () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return only home breadcrumb for base path', () => {
    mockUsePathname.mockReturnValue('/prio')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({
      label: 'Home',
      href: '/prio',
    })
    expect(result.current[0].icon).toBeTruthy()
  })

  it('should handle missions list page', () => {
    mockUsePathname.mockReturnValue('/prio/missions')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Missions', href: '/prio/missions' })
  })

  it('should handle specific mission page', () => {
    mockUsePathname.mockReturnValue('/prio/missions/mission-1')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Test Mission 1', href: '/prio/missions/mission-1' })
  })

  it('should handle objectives with parent mission', () => {
    mockUsePathname.mockReturnValue('/prio/objectives/obj-1')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(3)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Test Mission 1', href: '/prio/missions/mission-1' })
    expect(result.current[2]).toMatchObject({ label: 'Test Objective', href: '/prio/objectives/obj-1' })
  })

  it('should handle chats with parent mission', () => {
    mockUsePathname.mockReturnValue('/prio/chats/chat-1')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(3)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Test Mission 1', href: '/prio/missions/mission-1' })
    expect(result.current[2]).toMatchObject({ label: 'Test Chat', href: '/prio/chats/chat-1' })
  })

  it('should handle documents page', () => {
    mockUsePathname.mockReturnValue('/prio/documents')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Documents', href: '/prio/documents' })
  })

  it('should handle unknown mission ID gracefully', () => {
    mockUsePathname.mockReturnValue('/prio/missions/unknown-mission')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Missions', href: '/prio/missions' })
  })

  it('should handle unknown objective ID gracefully', () => {
    mockUsePathname.mockReturnValue('/prio/objectives/unknown-obj')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Objectives', href: '/prio/objectives' })
  })

  it('should handle unknown chat ID gracefully', () => {
    mockUsePathname.mockReturnValue('/prio/chats/unknown-chat')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(2)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
    expect(result.current[1]).toMatchObject({ label: 'Chats', href: '/prio/chats' })
  })

  it('should handle unknown segments gracefully', () => {
    mockUsePathname.mockReturnValue('/prio/unknown-segment')

    const { result } = renderHook(() => useBreadcrumbData())

    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toMatchObject({ label: 'Home', href: '/prio' })
  })
})
