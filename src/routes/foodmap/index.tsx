import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Flame, Map, BookOpen, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FoodMapCard } from '@/components/map/FoodMapCard'
import { FAKE_FOOD_MAPS, FAKE_MY_MAPS } from '@/data/fakeMapData'
import { useAuthStore } from '@/stores/useAuthStore'

function FoodMapIndexPage() {
  const { isAuthenticated } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'trending' | 'mine'>('trending')

  const filteredMaps = FAKE_FOOD_MAPS.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gradient-primary opacity-[0.04]" />
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                <Map className="h-3.5 w-3.5" />
                Custom Food Maps
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
                Bản đồ Foodtour
                <br />
                <span className="text-gradient">của cộng đồng</span>
              </h1>
              <p className="mt-2 text-muted-foreground max-w-md text-sm">
                Khám phá lộ trình ẩm thực do cộng đồng tạo ra, hoặc tự lên kế hoạch food tour của riêng bạn.
              </p>
            </div>

            {isAuthenticated && (
              <Link to="/foodmap/new">
                <Button className="gradient-primary text-white border-0 gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Plus className="h-4 w-4" />
                  Tạo bản đồ mới
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Search */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm bản đồ food tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'trending'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Flame className="h-4 w-4" />
            Trending
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('mine')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'mine'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Của tôi ({FAKE_MY_MAPS.length})
            </button>
          )}
        </div>

        {/* Trending maps */}
        {activeTab === 'trending' && (
          <div>
            {filteredMaps.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-muted-foreground">Không tìm thấy bản đồ phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMaps.map((map) => (
                  <FoodMapCard key={map.id} map={map} variant="grid" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My maps */}
        {activeTab === 'mine' && isAuthenticated && (
          <div className="space-y-4">
            {FAKE_MY_MAPS.map((map) => (
              <FoodMapCard key={map.id} map={map} variant="horizontal" />
            ))}
            <Link to="/foodmap/new">
              <div className="flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Tạo bản đồ mới</p>
                  <p className="text-xs text-muted-foreground">Lên kế hoạch food tour của riêng bạn</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Not logged in state */}
        {activeTab === 'mine' && !isAuthenticated && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔐</p>
            <h3 className="font-heading font-bold text-foreground mb-2">Đăng nhập để xem bản đồ của bạn</h3>
            <p className="text-sm text-muted-foreground mb-4">Tạo và lưu lộ trình food tour của riêng bạn</p>
            <Link to="/login">
              <Button className="gradient-primary text-white border-0">Đăng nhập</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/foodmap/')({
  component: FoodMapIndexPage,
})
