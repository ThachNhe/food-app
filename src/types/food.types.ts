// ─── Restaurant ────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  created_at: string
}

// ─── Vibe Tags ─────────────────────────────────────────────────────────────

export const VIBE_TAGS = [
  { value: 'dang-thu', label: '🔥 Đáng thử', color: '#FF6B35' },
  { value: 'gia-re', label: '💰 Giá rẻ', color: '#10B981' },
  { value: 'song-ao', label: '📸 Sống ảo đẹp', color: '#8B5CF6' },
  { value: 'overrated', label: '😐 Overrated', color: '#6B7280' },
] as const

export type VibeTagValue = (typeof VIBE_TAGS)[number]['value']

// ─── Review ────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  user_id: string
  restaurant_id: string
  content: string
  image_url: string
  rating: number
  vibe_tags: string[]
  created_at: string
}

export interface ReviewWithRestaurant extends Review {
  restaurants: Pick<Restaurant, 'id' | 'name' | 'address' | 'city'>
}

// ─── Form Values ───────────────────────────────────────────────────────────

export interface CreateReviewPayload {
  restaurant_id: string
  content: string
  image_url: string
  rating: number
  vibe_tags: string[]
}

export interface CreateRestaurantPayload {
  name: string
  address: string
  city: string
}

// ─── Real Score ────────────────────────────────────────────────────────────

export interface RealScoreData {
  averageRating: number
  reviewCount: number
}
