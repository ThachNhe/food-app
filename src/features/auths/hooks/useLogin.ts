import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { authService } from '../services/auth.service'

// ─── useLogin ──────────────────────────────────────────────────────────────

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),

    onSuccess: () => {
      router.navigate({ to: '/' })
    },

    onError: (error: Error) => {
      console.error('Login failed:', error.message)
    },
  })
}

// ─── useRegister ───────────────────────────────────────────────────────────

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signUp(email, password),

    onSuccess: () => {
      router.navigate({ to: '/login' })
    },

    onError: (error: Error) => {
      console.error('Register failed:', error.message)
    },
  })
}

// ─── useLogout ─────────────────────────────────────────────────────────────

export function useLogout() {
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.signOut(),

    onSettled: () => {
      router.navigate({ to: '/login' })
    },
  })
}
