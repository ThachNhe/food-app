import { Heart, Eye, Clock, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { FoodMap } from '@/data/fakeMapData'
import { getRestaurantById } from '@/data/fakeMapData'

interface FoodMapCardProps {
  map: FoodMap
  variant?: 'grid' | 'horizontal' | 'trending'
}

export function FoodMapCard({ map, variant = 'grid' }: FoodMapCardProps) {
  const previewRestaurants = map.stops.slice(0, 3).map((s) => getRestaurantById(s.restaurantId)).filter(Boolean)
  const timeAgo = getTimeAgo(map.createdAt)

  if (variant === 'trending') {
    return (
      <Link to="/foodmap/$id" params={{ id: map.id }}>
        <div className="group relative flex items-center gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer card-shadow">
          {/* Mini preview */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5 p-0.5">
              {previewRestaurants.slice(0, 4).map((r, i) => (
                <span key={i} className="text-lg leading-none">{r?.emoji}</span>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
              {map.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {map.stops.length} điểm
              </span>
              <span className="flex items-center gap-0.5">
                <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                {map.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {map.estimatedTime}
              </span>
            </div>
          </div>

          <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link to="/foodmap/$id" params={{ id: map.id }}>
        <div className="group flex gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer card-shadow">
          {/* Visual preview */}
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1 p-1">
              {previewRestaurants.slice(0, 4).map((r, i) => (
                <span key={i} className="text-2xl leading-none">{r?.emoji}</span>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-orange-200/20" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
              {map.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{map.description}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {map.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {map.authorEmoji} {map.author}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {map.stops.length} điểm · {map.totalDistance}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                {map.likes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid variant (default)
  return (
    <Link to="/foodmap/$id" params={{ id: map.id }}>
      <div className="group flex flex-col rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer card-shadow overflow-hidden">
        {/* Map thumbnail preview */}
        <div className="relative h-36 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-b border-border">
          {/* Mini fake map background */}
          <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-30">
            <rect width="100" height="60" fill="#f5f0e8" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeWidth="2" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeWidth="2" />
            <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="2" />
            <line x1="65" y1="0" x2="65" y2="60" stroke="white" strokeWidth="2" />
          </svg>

          {/* Route pins */}
          {map.stops.slice(0, 5).map((stop, i) => {
            const r = getRestaurantById(stop.restaurantId)
            if (!r) return null
            const px = 10 + (r.x / 100) * 80
            const py = 5 + (r.y / 100) * 50
            return (
              <div
                key={stop.restaurantId}
                className="absolute flex flex-col items-center"
                style={{ left: `${px}%`, top: `${py}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-7 h-7 rounded-full bg-white border-2 border-primary shadow-md flex items-center justify-center text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <span className="text-base mt-0.5">{r.emoji}</span>
              </div>
            )
          })}

          {/* Route line connecting stops */}
          <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full pointer-events-none">
            {map.stops.slice(0, -1).map((stop, i) => {
              const from = getRestaurantById(stop.restaurantId)
              const to = getRestaurantById(map.stops[i + 1].restaurantId)
              if (!from || !to) return null
              const fx = 10 + (from.x / 100) * 80
              const fy = 5 + (from.y / 100) * 50
              const tx = 10 + (to.x / 100) * 80
              const ty = 5 + (to.y / 100) * 50
              return (
                <line
                  key={i}
                  x1={fx}
                  y1={fy}
                  x2={tx}
                  y2={ty}
                  stroke="#FF6B35"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  opacity="0.6"
                />
              )
            })}
          </svg>

          {/* Likes badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-xs font-semibold text-rose-500">
            <Heart className="h-3 w-3 fill-rose-500" />
            {map.likes >= 1000 ? `${(map.likes / 1000).toFixed(1)}k` : map.likes}
          </div>

          {/* Views badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            {map.views >= 1000 ? `${(map.views / 1000).toFixed(1)}k` : map.views}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-heading font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
            {map.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{map.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {map.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-1 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="text-base">{map.authorEmoji}</span>
              <span>{map.author}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {map.stops.length} điểm
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {map.estimatedTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date('2026-03-20T19:21:34+07:00')
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`
  return `${Math.floor(diffDays / 7)} tuần trước`
}
