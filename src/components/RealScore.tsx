import { Star, TrendingUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RealScoreData } from '@/types/food.types'

interface RealScoreProps {
  data: RealScoreData
  className?: string
}

export function RealScore({ data, className }: RealScoreProps) {
  const { averageRating, reviewCount } = data

  const getScoreColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-500'
    if (rating >= 3.5) return 'text-amber-500'
    if (rating >= 2.5) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreLabel = (rating: number) => {
    if (rating >= 4.5) return 'Xuất sắc!'
    if (rating >= 3.5) return 'Khá tốt'
    if (rating >= 2.5) return 'Tạm ổn'
    if (rating > 0) return 'Chưa ổn'
    return 'Chưa có đánh giá'
  }

  return (
    <div
      className={cn(
        'rounded-2xl bg-card border border-border p-6 card-shadow',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground">Real Score</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Trung bình trong 24 giờ qua
          </p>
        </div>
      </div>

      <div className="flex items-end gap-3">
        {/* Big Score */}
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-5xl font-heading font-extrabold tabular-nums',
              getScoreColor(averageRating),
            )}
          >
            {averageRating > 0 ? averageRating.toFixed(1) : '—'}
          </span>
          <span className="text-lg text-muted-foreground">/5</span>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 mb-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'h-4 w-4',
                star <= Math.round(averageRating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-muted-foreground/30',
              )}
            />
          ))}
        </div>
      </div>

      {/* Label & Count */}
      <div className="mt-3 flex items-center justify-between">
        <span className={cn('text-sm font-semibold', getScoreColor(averageRating))}>
          {getScoreLabel(averageRating)}
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {reviewCount} review hôm nay
        </span>
      </div>

      {/* Score Bar */}
      {averageRating > 0 && (
        <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-700 ease-out"
            style={{ width: `${(averageRating / 5) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}
