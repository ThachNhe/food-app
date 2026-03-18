import { cn } from '@/lib/utils'
import { VIBE_TAGS } from '@/types/food.types'

interface VibeTagBadgeProps {
  tag: string
  size?: 'sm' | 'md'
  className?: string
}

const tagConfig: Record<string, { label: string; bg: string; text: string }> = {
  'dang-thu': {
    label: '🔥 Đáng thử',
    bg: 'bg-orange-500/15 dark:bg-orange-500/20',
    text: 'text-orange-700 dark:text-orange-300',
  },
  'gia-re': {
    label: '💰 Giá rẻ',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  'song-ao': {
    label: '📸 Sống ảo đẹp',
    bg: 'bg-violet-500/15 dark:bg-violet-500/20',
    text: 'text-violet-700 dark:text-violet-300',
  },
  overrated: {
    label: '😐 Overrated',
    bg: 'bg-gray-500/15 dark:bg-gray-500/20',
    text: 'text-gray-700 dark:text-gray-300',
  },
}

export function VibeTagBadge({ tag, size = 'sm', className }: VibeTagBadgeProps) {
  const config = tagConfig[tag]
  if (!config) {
    // Fallback: try to find from VIBE_TAGS
    const found = VIBE_TAGS.find((t) => t.value === tag)
    if (!found) return null
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-medium whitespace-nowrap',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-primary/10 text-primary',
          className,
        )}
      >
        {found.label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.bg,
        config.text,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

// ─── Selectable Vibe Tags (for ReviewForm) ────────────────────────────────

interface VibeTagSelectorProps {
  selected: string[]
  onToggle: (tag: string) => void
  className?: string
}

export function VibeTagSelector({
  selected,
  onToggle,
  className,
}: VibeTagSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {VIBE_TAGS.map((tag) => {
        const isSelected = selected.includes(tag.value)
        return (
          <button
            key={tag.value}
            type="button"
            onClick={() => onToggle(tag.value)}
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
              'border-2',
              isSelected
                ? 'border-primary bg-primary/15 text-primary scale-105 shadow-md'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            {tag.label}
          </button>
        )
      })}
    </div>
  )
}
