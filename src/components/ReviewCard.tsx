import { Link } from '@tanstack/react-router'
import { MapPin, Clock } from 'lucide-react'
import { StarRating } from './StarRating'
import { VibeTagBadge } from './VibeTagBadge'
import type { ReviewWithRestaurant } from '@/types/food.types'

interface ReviewCardProps {
  review: ReviewWithRestaurant
  index?: number
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const past = new Date(dateStr).getTime()
  const diff = Math.floor((now - past) / 1000)

  if (diff < 60) return 'Vừa xong'
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <article
      className="group rounded-2xl bg-card border border-border overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={review.image_url}
          alt={`Review ${review.restaurants?.name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Restaurant Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link
            to="/restaurant/$id"
            params={{ id: review.restaurant_id }}
            className="inline-block"
          >
            <h3 className="text-white font-heading font-bold text-lg leading-tight hover:text-primary transition-colors">
              {review.restaurants?.name ?? 'Quán ăn'}
            </h3>
          </Link>
          {review.restaurants?.address && (
            <p className="flex items-center gap-1 text-white/70 text-xs mt-1">
              <MapPin className="h-3 w-3" />
              {review.restaurants.address}
              {review.restaurants.city && `, ${review.restaurants.city}`}
            </p>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 border border-white/10">
            <StarRating value={review.rating} readonly size="sm" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Review Text */}
        <p className="text-sm text-foreground/85 leading-relaxed line-clamp-3 mb-3">
          {review.content}
        </p>

        {/* Vibe Tags */}
        {review.vibe_tags && review.vibe_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {review.vibe_tags.map((tag) => (
              <VibeTagBadge key={tag} tag={tag} size="sm" />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeAgo(review.created_at)}
          </span>
        </div>
      </div>
    </article>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

export function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden card-shadow animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-full" />
        <div className="h-3 bg-muted rounded-full w-2/3" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-14 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  )
}
