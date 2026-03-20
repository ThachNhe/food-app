import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, X, Star, Users, Navigation } from 'lucide-react'
import type { RestaurantPin, RestaurantCategory } from '@/data/fakeMapData'
import { FAKE_RESTAURANTS, CATEGORIES } from '@/data/fakeMapData'

interface FakeMapCanvasProps {
  selectedId?: string
  onSelect?: (restaurant: RestaurantPin) => void
  highlightedIds?: string[]
  showCategoryFilter?: boolean
  mini?: boolean
  height?: string
}

// Fake street paths for background
const FAKE_STREETS = [
  // horizontal
  { x1: 0, y1: 25, x2: 100, y2: 25 },
  { x1: 0, y1: 42, x2: 100, y2: 42 },
  { x1: 0, y1: 58, x2: 100, y2: 58 },
  { x1: 0, y1: 72, x2: 100, y2: 72 },
  // vertical
  { x1: 20, y1: 0, x2: 20, y2: 100 },
  { x1: 38, y1: 0, x2: 38, y2: 100 },
  { x1: 55, y1: 0, x2: 55, y2: 100 },
  { x1: 72, y1: 0, x2: 72, y2: 100 },
  // diagonal shortcuts
  { x1: 20, y1: 25, x2: 38, y2: 42 },
  { x1: 55, y1: 42, x2: 72, y2: 58 },
]

const BLOCKS = [
  { x: 21, y: 26, w: 16, h: 15 },
  { x: 39, y: 26, w: 15, h: 15 },
  { x: 56, y: 26, w: 15, h: 15 },
  { x: 73, y: 26, w: 26, h: 15 },
  { x: 0, y: 43, w: 19, h: 14 },
  { x: 21, y: 43, w: 16, h: 14 },
  { x: 39, y: 43, w: 15, h: 14 },
  { x: 56, y: 43, w: 15, h: 14 },
  { x: 73, y: 43, w: 26, h: 14 },
  { x: 0, y: 59, w: 19, h: 12 },
  { x: 21, y: 59, w: 16, h: 12 },
  { x: 39, y: 59, w: 15, h: 12 },
  { x: 56, y: 59, w: 15, h: 12 },
  { x: 73, y: 59, w: 26, h: 12 },
]

const CATEGORY_COLORS: Record<RestaurantCategory, string> = {
  'Phở & Bún': '#EF4444',
  'Bánh mì': '#F97316',
  'Hải sản': '#3B82F6',
  'Tráng miệng': '#EC4899',
  'Đặc sản HP': '#FF6B35',
  'Đồ uống': '#8B5CF6',
}

export function FakeMapCanvas({
  selectedId,
  onSelect,
  highlightedIds,
  showCategoryFilter = true,
  mini = false,
  height = '500px',
}: FakeMapCanvasProps) {
  const [activeFilter, setActiveFilter] = useState<RestaurantCategory | 'Tất cả'>('Tất cả')
  const [popup, setPopup] = useState<RestaurantPin | null>(null)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const filteredRestaurants = FAKE_RESTAURANTS.filter(
    (r) =>
      (activeFilter === 'Tất cả' || r.category === activeFilter) &&
      (!highlightedIds || highlightedIds.length === 0 || highlightedIds.includes(r.id)),
  )

  const handleMarkerClick = useCallback(
    (r: RestaurantPin) => {
      if (mini) return
      setPopup(r)
      onSelect?.(r)
    },
    [mini, onSelect],
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mini) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setMapOffset({
      x: Math.max(-80, Math.min(80, e.clientX - dragStart.x)),
      y: Math.max(-80, Math.min(80, e.clientY - dragStart.y)),
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  // Pulse animation for selected marker
  useEffect(() => {
    if (selectedId) {
      const r = FAKE_RESTAURANTS.find((x) => x.id === selectedId)
      if (r) setPopup(r)
    }
  }, [selectedId])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border" style={{ height }}>
      {/* Category Filter */}
      {showCategoryFilter && !mini && (
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveFilter('Tất cả')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm ${
              activeFilter === 'Tất cả'
                ? 'bg-primary text-white border-primary'
                : 'bg-card/90 text-foreground/80 border-border hover:bg-accent'
            }`}
          >
            Tất cả
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(activeFilter === cat ? 'Tất cả' : cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm ${
                activeFilter === cat
                  ? 'text-white border-transparent'
                  : 'bg-card/90 text-foreground/80 border-border hover:bg-accent'
              }`}
              style={activeFilter === cat ? { background: CATEGORY_COLORS[cat] } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      {!mini && (
        <div className="absolute bottom-3 left-3 z-20 bg-card/90 backdrop-blur-sm rounded-xl border border-border p-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Khu vực: Hải Phòng</p>
          <p>📍 {filteredRestaurants.length} địa điểm</p>
          <p className="mt-1 text-[10px]">Kéo để di chuyển bản đồ</p>
        </div>
      )}

      {/* Zoom indicator */}
      {!mini && (
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1">
          <button
            className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-lg font-bold text-foreground hover:bg-accent transition-colors"
            title="Zoom in (decorative)"
          >
            +
          </button>
          <button
            className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-lg font-bold text-foreground hover:bg-accent transition-colors"
            title="Zoom out (decorative)"
          >
            −
          </button>
        </div>
      )}

      {/* SVG Map */}
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className={`w-full h-full ${!mini ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ transform: `translate(${mapOffset.x * 0.05}%, ${mapOffset.y * 0.05}%)` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <rect width="100" height="100" fill="#f0ede8" />

        {/* Water feature (fake river) */}
        <path
          d="M 0,10 Q 15,8 25,12 Q 35,16 40,11 Q 50,6 60,10 Q 70,14 80,9 Q 90,4 100,8 L 100,0 L 0,0 Z"
          fill="#93c5fd"
          opacity="0.6"
        />
        <text x="35" y="6" fontSize="2.5" fill="#3b82f6" opacity="0.7" fontWeight="bold">
          Sông Cấm
        </text>

        {/* City blocks */}
        {BLOCKS.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={i % 3 === 0 ? '#e8e0d5' : i % 3 === 1 ? '#ddd5c8' : '#e2d9cc'}
            rx="0.5"
          />
        ))}

        {/* Green spaces */}
        <ellipse cx="50" cy="50" rx="4" ry="3" fill="#86efac" opacity="0.8" />
        <text x="48.5" y="51.2" fontSize="2" fill="#16a34a">
          🌳
        </text>
        <rect x="0" y="0" width="19" height="24" fill="#d1fae5" opacity="0.5" rx="0.5" />
        <text x="7" y="14" fontSize="2.5" fill="#15803d">
          Công viên
        </text>

        {/* Streets */}
        {FAKE_STREETS.map((s, i) => (
          <line
            key={i}
            x1={`${s.x1}%`}
            y1={`${s.y1}%`}
            x2={`${s.x2}%`}
            y2={`${s.y2}%`}
            stroke="white"
            strokeWidth={i < 8 ? 1.2 : 0.7}
            strokeLinecap="round"
          />
        ))}

        {/* Street names */}
        <text x="1" y="24.2" fontSize="1.8" fill="#9ca3af">Lạch Tray</text>
        <text x="1" y="41.2" fontSize="1.8" fill="#9ca3af">Đinh Tiên Hoàng</text>
        <text x="1" y="57.2" fontSize="1.8" fill="#9ca3af">Trần Phú</text>
        <text x="19.5" y="99" fontSize="1.8" fill="#9ca3af" transform="rotate(-90 19.5 99)">Nguyễn Đức Cảnh</text>
        <text x="37.5" y="99" fontSize="1.8" fill="#9ca3af" transform="rotate(-90 37.5 99)">Minh Khai</text>

        {/* Route lines for highlighted restaurants */}
        {highlightedIds && highlightedIds.length > 1 &&
          highlightedIds.slice(0, -1).map((id, i) => {
            const from = FAKE_RESTAURANTS.find((r) => r.id === id)
            const to = FAKE_RESTAURANTS.find((r) => r.id === highlightedIds[i + 1])
            if (!from || !to) return null
            return (
              <g key={`route-${i}`}>
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="#FF6B35"
                  strokeWidth="0.8"
                  strokeDasharray="2 1"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                {/* Order number on midpoint */}
                <circle
                  cx={(from.x + to.x) / 2}
                  cy={(from.y + to.y) / 2}
                  r="1.5"
                  fill="#FF6B35"
                  opacity="0.6"
                />
              </g>
            )
          })}

        {/* Restaurant Markers */}
        {filteredRestaurants.map((r) => {
          const isSelected = r.id === selectedId || r.id === popup?.id
          const isHighlighted = highlightedIds?.includes(r.id)
          const color = CATEGORY_COLORS[r.category]
          const stopIndex = highlightedIds?.indexOf(r.id)

          return (
            <g
              key={r.id}
              onClick={() => handleMarkerClick(r)}
              className={!mini ? 'cursor-pointer' : ''}
              transform={`translate(${r.x}, ${r.y})`}
            >
              {/* Pulse ring for selected */}
              {isSelected && (
                <circle r="4" fill={color} opacity="0.2">
                  <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Pin shadow */}
              <ellipse cx="0" cy="3.5" rx="2" ry="0.6" fill="black" opacity="0.15" />

              {/* Pin body */}
              <path
                d="M 0,-4 C -2.2,-4 -2.2,-1 -2.2,0 C -2.2,2 0,4 0,4 C 0,4 2.2,2 2.2,0 C 2.2,-1 2.2,-4 0,-4 Z"
                fill={isSelected ? '#FF6B35' : isHighlighted ? color : color}
                stroke="white"
                strokeWidth={isSelected ? 0.5 : 0.4}
                opacity={isHighlighted || activeFilter === 'Tất cả' || r.category === activeFilter ? 1 : 0.3}
              />

              {/* Emoji inside pin */}
              <text
                x="0"
                y="-0.5"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={mini ? '2' : '2.2'}
              >
                {r.emoji}
              </text>

              {/* Stop order badge */}
              {isHighlighted && stopIndex !== undefined && stopIndex >= 0 && (
                <circle cx="2.5" cy="-3.5" r="1.5" fill="#1f2937" className="pointer-events-none" />
              )}
              {isHighlighted && stopIndex !== undefined && stopIndex >= 0 && (
                <text
                  x="2.5"
                  y="-3.5"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="1.5"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {stopIndex + 1}
                </text>
              )}

              {/* Hover label */}
              {!mini && isSelected && (
                <g transform="translate(-12, -10)">
                  <rect x="0" y="0" width="24" height="5" rx="1" fill="#1f2937" opacity="0.9" />
                  <text x="12" y="3.5" textAnchor="middle" fontSize="2" fill="white">
                    {r.name.length > 16 ? r.name.slice(0, 16) + '…' : r.name}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Current location dot */}
        {!mini && (
          <g transform="translate(50, 50)">
            <circle r="2" fill="#3b82f6">
              <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r="1.2" fill="white" />
            <circle r="0.6" fill="#3b82f6" />
            <circle r="5" fill="#3b82f6" opacity="0.1">
              <animate attributeName="r" values="3;8;3" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>

      {/* Popup */}
      {popup && !mini && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-card border border-border rounded-2xl shadow-xl p-4 w-72 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setPopup(null)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="text-3xl">{popup.emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-foreground text-sm leading-tight">{popup.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{popup.address}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-foreground">{popup.realScore}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {popup.checkIns} check-in
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {popup.category}
                </span>
              </div>
              {popup.topTag && (
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-medium">
                  {popup.topTag}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onSelect?.(popup)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              <Navigation className="h-3.5 w-3.5" />
              Chỉ đường
            </button>
            <a
              href={`/restaurant/${popup.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl gradient-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <MapPin className="h-3.5 w-3.5" />
              Xem quán
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
