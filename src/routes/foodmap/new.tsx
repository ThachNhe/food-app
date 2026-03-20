import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Search, Map, Clock, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FakeMapCanvas } from '@/components/map/FakeMapCanvas'
import { FAKE_RESTAURANTS, getRestaurantById } from '@/data/fakeMapData'

interface Stop {
  restaurantId: string
  note: string
}

function NewFoodMapPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stops, setStops] = useState<Stop[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [step, setStep] = useState<'info' | 'stops' | 'preview'>('info')
  const [saved, setSaved] = useState(false)

  const filteredRestaurants = FAKE_RESTAURANTS.filter(
    (r) =>
      !stops.some((s) => s.restaurantId === r.id) &&
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const addStop = (id: string) => {
    setStops((prev) => [...prev, { restaurantId: id, note: '' }])
    setSearchQuery('')
  }

  const removeStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index))
  }

  const updateNote = (index: number, note: string) => {
    setStops((prev) => prev.map((s, i) => (i === index ? { ...s, note } : s)))
  }

  const moveStop = (index: number, dir: 1 | -1) => {
    const newStops = [...stops]
    const target = index + dir
    if (target < 0 || target >= newStops.length) return
    ;[newStops[index], newStops[target]] = [newStops[target], newStops[index]]
    setStops(newStops)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => navigate({ to: '/foodmap' }), 1500)
  }

  const highlightedIds = stops.map((s) => s.restaurantId)
  const totalTime = stops.reduce((acc) => acc + 35, 0)

  if (saved) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Đã lưu bản đồ!</h2>
          <p className="text-muted-foreground">Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/foodmap">
          <Button variant="ghost" size="sm" className="-ml-2 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground">Tạo bản đồ mới</h1>
          <p className="text-sm text-muted-foreground">Lên kế hoạch food tour của bạn</p>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-0 border border-border rounded-xl overflow-hidden mb-8">
        {(['info', 'stops', 'preview'] as const).map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              step === s
                ? 'gradient-primary text-white'
                : 'bg-card text-muted-foreground hover:bg-accent'
            }`}
          >
            {i + 1}. {s === 'info' ? 'Thông tin' : s === 'stops' ? 'Địa điểm' : 'Xem trước'}
          </button>
        ))}
      </div>

      {/* Step 1: Info */}
      {step === 'info' && (
        <div className="max-w-lg space-y-5 animate-fade-in-up">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Tên bản đồ *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Food Tour Hải Phòng 1 buổi tối 🔥"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả ngắn về lộ trình, phù hợp với ai, ngân sách dự kiến..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
            />
          </div>
          <Button
            onClick={() => setStep('stops')}
            disabled={!title.trim()}
            className="gradient-primary text-white border-0 gap-2"
          >
            Tiếp theo: Thêm địa điểm
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>
      )}

      {/* Step 2: Stops */}
      {step === 'stops' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Left: search & add */}
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-heading font-bold text-foreground mb-3">
                Thêm địa điểm vào lộ trình
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm quán ăn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredRestaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => addStop(r.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.address}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </button>
              ))}
              {filteredRestaurants.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {stops.length === FAKE_RESTAURANTS.length ? 'Đã thêm tất cả quán!' : 'Không tìm thấy quán'}
                </p>
              )}
            </div>
          </div>

          {/* Right: stops list */}
          <div>
            <h2 className="text-base font-heading font-bold text-foreground mb-3 flex items-center gap-2">
              Lộ trình của bạn
              <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                {stops.length} điểm
              </span>
            </h2>

            {stops.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-2xl text-center">
                <Map className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Chưa có địa điểm nào</p>
                <p className="text-xs text-muted-foreground mt-1">Tìm và thêm quán ăn bên trái</p>
              </div>
            ) : (
              <div className="space-y-2">
                {stops.map((stop, i) => {
                  const r = getRestaurantById(stop.restaurantId)
                  if (!r) return null
                  return (
                    <div
                      key={stop.restaurantId}
                      className="flex gap-2 p-3 rounded-xl border border-border bg-card"
                    >
                      {/* Drag handle placeholder */}
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <div className="w-6 h-6 rounded-full gradient-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveStop(i, -1)}
                            disabled={i === 0}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs leading-none"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveStop(i, 1)}
                            disabled={i === stops.length - 1}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs leading-none"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{r.emoji}</span>
                          <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                        </div>
                        <input
                          type="text"
                          placeholder="Ghi chú (tùy chọn)..."
                          value={stop.note}
                          onChange={(e) => updateNote(i, e.target.value)}
                          className="mt-1.5 w-full px-2 py-1 text-xs rounded-lg border border-border bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>

                      <button
                        onClick={() => removeStop(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}

                {/* ETA */}
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Ước tính: ~{Math.floor(totalTime / 60) > 0 ? `${Math.floor(totalTime / 60)} tiếng ` : ''}{totalTime % 60} phút
                </div>
              </div>
            )}

            {stops.length >= 2 && (
              <Button
                onClick={() => setStep('preview')}
                className="mt-4 gradient-primary text-white border-0 gap-2 w-full"
              >
                <Navigation className="h-4 w-4" />
                Xem trước lộ trình
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="rounded-2xl border border-border overflow-hidden">
            <FakeMapCanvas
              highlightedIds={highlightedIds}
              showCategoryFilter={false}
              height="380px"
            />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-heading font-extrabold text-foreground">{stops.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">địa điểm</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border text-center">
              <p className="text-2xl font-heading font-extrabold text-primary">
                ~{Math.floor(totalTime / 60) > 0 ? `${Math.floor(totalTime / 60)}h` : ''}{totalTime % 60}m
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">thời gian</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border text-center col-span-2">
              <p className="text-sm font-semibold text-foreground truncate">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description || 'Không có mô tả'}</p>
            </div>
          </div>

          {/* Stops list */}
          <div className="space-y-2">
            {stops.map((stop, i) => {
              const r = getRestaurantById(stop.restaurantId)
              if (!r) return null
              return (
                <div key={stop.restaurantId} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <div className="w-7 h-7 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-xl">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    {stop.note && <p className="text-xs text-muted-foreground mt-0.5">{stop.note}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('stops')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Chỉnh sửa
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 gradient-primary text-white border-0 gap-2"
            >
              🎉 Lưu bản đồ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/foodmap/new')({
  component: NewFoodMapPage,
})
