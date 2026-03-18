import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  const displayValue = hovered || value

  return (
    <div className={cn('flex gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn(
            'transition-all duration-150',
            readonly
              ? 'cursor-default'
              : 'cursor-pointer hover:scale-125 active:scale-95',
          )}
        >
          <Star
            className={cn(
              sizeMap[size],
              'transition-colors duration-150',
              star <= displayValue
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-muted-foreground/30',
            )}
          />
        </button>
      ))}
    </div>
  )
}
