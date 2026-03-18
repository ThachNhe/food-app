import { supabase } from '@/lib/supabase'
import type {
  Review,
  ReviewWithRestaurant,
  CreateReviewPayload,
  Restaurant,
  CreateRestaurantPayload,
  RealScoreData,
} from '@/types/food.types'

// ─── Reviews ───────────────────────────────────────────────────────────────

export async function fetchReviews(limit = 20): Promise<ReviewWithRestaurant[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, restaurants(id, name, address, city)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data as ReviewWithRestaurant[]) ?? []
}

export async function fetchReviewsByRestaurant(
  restaurantId: string,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as Review[]) ?? []
}

export async function createReview(
  payload: CreateReviewPayload,
): Promise<Review> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Bạn cần đăng nhập để đăng review')

  const { data, error } = await supabase
    .from('reviews')
    .insert({ ...payload, user_id: user.id })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Review
}

// ─── Image Upload ──────────────────────────────────────────────────────────

export async function uploadReviewImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `reviews/${fileName}`

  const { error } = await supabase.storage
    .from('reviews-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(`Upload thất bại: ${error.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from('reviews-images').getPublicUrl(filePath)

  return publicUrl
}

// ─── Restaurants ───────────────────────────────────────────────────────────

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as Restaurant[]) ?? []
}

export async function fetchRestaurant(id: string): Promise<Restaurant> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Restaurant
}

export async function createRestaurant(
  payload: CreateRestaurantPayload,
): Promise<Restaurant> {
  const { data, error } = await supabase
    .from('restaurants')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Restaurant
}

// ─── Real Score (24h average) ──────────────────────────────────────────────

export async function getRealScore(
  restaurantId: string,
): Promise<RealScoreData> {
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000,
  ).toISOString()

  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', twentyFourHoursAgo)

  if (error) throw new Error(error.message)

  const reviews = data ?? []
  if (reviews.length === 0) {
    return { averageRating: 0, reviewCount: 0 }
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return {
    averageRating: Math.round((total / reviews.length) * 10) / 10,
    reviewCount: reviews.length,
  }
}
