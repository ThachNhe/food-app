import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  initialize: () => Promise<void>
  setSession: (session: Session | null) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      initialize: async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          set(
            {
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session?.user,
              isLoading: false,
            },
            false,
            'auth/initialize',
          )

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set(
              {
                session,
                user: session?.user ?? null,
                isAuthenticated: !!session?.user,
                isLoading: false,
              },
              false,
              'auth/stateChange',
            )
          })
        } catch {
          set({ isLoading: false }, false, 'auth/initError')
        }
      },

      setSession: (session) =>
        set(
          {
            session,
            user: session?.user ?? null,
            isAuthenticated: !!session?.user,
          },
          false,
          'auth/setSession',
        ),

      logout: async () => {
        await supabase.auth.signOut()
        set(
          {
            user: null,
            session: null,
            isAuthenticated: false,
          },
          false,
          'auth/logout',
        )
      },
    }),
    { name: 'AuthStore' },
  ),
)
