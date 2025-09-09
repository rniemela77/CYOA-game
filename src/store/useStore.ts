import { create } from 'zustand'

// Define the types for our store
export interface User {
  id: number
  name: string
  email: string
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface AppState {
  // State
  users: User[]
  posts: Post[]
  loading: boolean
  error: string | null
  selectedUser: User | null

  // Actions
  setUsers: (users: User[]) => void
  setPosts: (posts: Post[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSelectedUser: (user: User | null) => void
  addPost: (post: Post) => void
  clearError: () => void
}

// Create the store
export const useStore = create<AppState>((set) => ({
  // Initial state
  users: [],
  posts: [],
  loading: false,
  error: null,
  selectedUser: null,

  // Actions
  setUsers: (users) => set({ users }),
  setPosts: (posts) => set({ posts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  clearError: () => set({ error: null }),
}))
