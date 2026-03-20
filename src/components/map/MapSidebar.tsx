import { useState, useEffect } from 'react'
import { Search, Star, Users, Navigation, ChevronRight, MapPin } from 'lucide-react'
import type { RestaurantPin, RestaurantCategory } from '@/data/fakeMapData'
import { FAKE_RESTAURANTS, CATEGORIES } from '@/data/fakeMapData'

interface MapSidebarProps {
  selectedId?: string
  onSelect: (restaurant: RestaurantPin) => void
  onDirections: (restaurant: RestaurantPin) => void
}

const CATEGORY_ICONS: Record<RestaurantCategory | 'Tất cả', string> = {
  'Tất cả': '🍽️',
  'Phở & Bún': '🍜',
  'Bánh mì': '🥖',
  'Hải sản': '🦞',
  'Tráng miệng': '🥥',
  'Đặc sản HP': '🦀',
  'Đồ uống': '🧋',
}

const PRICE_LABELS: Record<1 | 2 | 3, string> = {
  1: '₫',
  2: '₫₫',
  3: '₫₫₫',
}

export function MapSidebar({ selectedId, onSelect, onDirections }: MapSidebarProps) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<RestaurantCategory | 'Tất cả'>('Tất cả')
  const [sortBy, setSortBy] = useState<'score' | 'checkins'>('score')

  const filtered = FAKE_RESTAURANTS.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.address.toLowerCase().includes(query.toLowerCase())
    const matchCat = categoryFilter === 'Tất cả' || r.category === categoryFilter
    return matchSearch && matchCat
  }).sort((a, b) =>
    sortBy === 'score' ? b.realScore - a.realScore : b.checkIns - a.checkIns,
  )

  // Scroll selected into view
  useEffect(() => {
    if (selectedId) {
      const el = document.getElementById(`sidebar-item-${selectedId}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedId])

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-bold text-foreground">Tìm quán ăn</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên, địa chỉ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Category scroll */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {(['Tất cả', ...CATEGORIES] as (RestaurantCategory | 'Tất cả')[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Sắp theo:</span>
          <button
            onClick={() => setSortBy('score')}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${sortBy === 'score' ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            ⭐ RealScore
          </button>
          <button
            onClick={() => setSortBy('checkins')}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${sortBy === 'checkins' ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            📍 Check-in
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/30 border-b border-border">
        {filtered.length} địa điểm trong khu vực Hải Phòng
      </div>

      {/* Restaurant List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-muted-foreground">Không tìm thấy quán phù hợp</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div
              id={`sidebar-item-${r.id}`}
              key={r.id}
              onClick={() => onSelect(r)}
              className={`group p-3 cursor-pointer transition-all hover:bg-accent/50 ${
                selectedId === r.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Emoji avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 flex items-center justify-center text-xl flex-shrink-0">
                  {r.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
                    {r.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.address}</p>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {/* RealScore */}
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-foreground">{r.realScore}</span>
                    </div>

                    {/* Check-ins */}
                    <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{r.checkIns}</span>
                    </div>

                    {/* Price */}
                    <span className="text-xs text-green-600 font-medium">{PRICE_LABELS[r.priceRange]}</span>

                    {/* Top Tag */}
                    {r.topTag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                        {r.topTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDirections(r)
                    }}
                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    title="Chỉ đường"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                  </button>
                  <div className="p-1.5 rounded-lg text-muted-foreground group-hover:text-foreground transition-colors">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground">
          📍 Dữ liệu demo · Khu vực Hải Phòng
        </p>
      </div>
    </div>
  )
}
