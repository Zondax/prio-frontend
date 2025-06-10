import { create } from 'zustand'

interface WaitingUser {
  email: string
  joinedAt?: { seconds: number }
}

interface WaitingListData {
  totalCount: number
  usersList: WaitingUser[]
  toObject: () => { totalCount: number; usersList: WaitingUser[] }
}

interface WaitingUsersStore {
  isLoading: boolean
  error: string | null
  data: WaitingListData | null
  setParams: (params: any) => void
  setInput: (input: any) => void
  forceRefresh: () => void
  getData: () => WaitingListData | null
  clientReady: () => boolean
}

const mockData: WaitingListData = {
  totalCount: 3,
  usersList: [
    { email: 'user1@example.com', joinedAt: { seconds: Date.now() / 1000 } },
    { email: 'user2@example.com', joinedAt: { seconds: Date.now() / 1000 - 86400 } },
    { email: 'user3@example.com', joinedAt: { seconds: Date.now() / 1000 - 172800 } },
  ],
  toObject: function () {
    return {
      totalCount: this.totalCount,
      usersList: this.usersList,
    }
  },
}

export const useWaitingUsersStore = create<WaitingUsersStore>((set, get) => ({
  isLoading: false,
  error: null,
  data: mockData,
  setParams: (params: any) => {
    // Mock implementation
  },
  setInput: (input: any) => {
    // Mock implementation
  },
  forceRefresh: () => {
    set({ isLoading: true })
    // Simulate API call
    setTimeout(() => {
      set({ isLoading: false, data: mockData })
    }, 1000)
  },
  getData: () => get().data,
  clientReady: () => true,
}))
