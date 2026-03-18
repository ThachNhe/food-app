// ─── App ───────────────────────────────────────────────────────────────────

export const APP_NAME = 'Foodtour – Phút Thật'
export const APP_VERSION = '1.0.0'
export const APP_ENV = import.meta.env.MODE
export const IS_DEV = APP_ENV === 'development'

// ─── Routes ────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REVIEW_NEW: '/review/new',
  RESTAURANT_DETAIL: (id: string) => `/restaurant/${id}`,
} as const

// ─── Pagination ────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const

// ─── Local Storage Keys ────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  THEME: 'theme',
} as const
