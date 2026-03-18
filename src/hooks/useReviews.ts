import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  fetchReviews,
  fetchReviewsByRestaurant,
  createReview,
  uploadReviewImage,
  fetchRestaurants,
  fetchRestaurant,
  createRestaurant,
  getRealScore,
} from '@/services/reviewService'
import type { CreateReviewPayload, CreateRestaurantPayload } from '@/types/food.types'

// ─── Query Keys ────────────────────────────────────────────────────────────

export const REVIEW_KEYS = {
  all: ['reviews'] as const,
  feed: () => [...REVIEW_KEYS.all, 'feed'] as const,
  byRestaurant: (id: string) => [...REVIEW_KEYS.all, 'restaurant', id] as const,
}

export const RESTAURANT_KEYS = {
  all: ['restaurants'] as const,
  list: () => [...RESTAURANT_KEYS.all, 'list'] as const,
  detail: (id: string) => [...RESTAURANT_KEYS.all, 'detail', id] as const,
  realScore: (id: string) => [...RESTAURANT_KEYS.all, 'realScore', id] as const,
}

// ─── Review Hooks ──────────────────────────────────────────────────────────

export function useReviews(limit = 20) {
  return useQuery({
    queryKey: REVIEW_KEYS.feed(),
    queryFn: () => fetchReviews(limit),
  })
}

export function useReviewsByRestaurant(restaurantId: string) {
  return useQuery({
    queryKey: REVIEW_KEYS.byRestaurant(restaurantId),
    queryFn: () => fetchReviewsByRestaurant(restaurantId),
    enabled: !!restaurantId,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      return createReview(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all })
    },
  })
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadReviewImage(file),
  })
}

// ─── Restaurant Hooks ──────────────────────────────────────────────────────

export function useRestaurants() {
  return useQuery({
    queryKey: RESTAURANT_KEYS.list(),
    queryFn: fetchRestaurants,
  })
}

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: RESTAURANT_KEYS.detail(id),
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  })
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRestaurantPayload) => createRestaurant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.all })
    },
  })
}

// ─── Real Score ────────────────────────────────────────────────────────────

export function useRealScore(restaurantId: string) {
  return useQuery({
    queryKey: RESTAURANT_KEYS.realScore(restaurantId),
    queryFn: () => getRealScore(restaurantId),
    enabled: !!restaurantId,
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// ─── Real-time Subscription ───────────────────────────────────────────────

export function useRealtimeReviews() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('reviews-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reviews' },
        () => {
          queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
