import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RealScore } from '@/components/RealScore'
import { StarRating } from '@/components/StarRating'
import { VibeTagBadge } from '@/components/VibeTagBadge'
import {
  useRestaurantDetail,
  useReviewsByRestaurant,
  useRealScore,
} from '@/hooks/useReviews'
import { FakeMapCanvas } from '@/components/map/FakeMapCanvas'
import { FAKE_RESTAURANTS } from '@/data/fakeMapData'

function RestaurantDetailPage() {
  const { id } = Route.useParams()
  const { data: restaurant, isLoading: loadingRestaurant } = useRestaurantDetail(id)
  const { data: reviews, isLoading: loadingReviews } = useReviewsByRestaurant(id)
  const { data: realScore } = useRealScore(id)

  if (loadingRestaurant) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-heading font-bold mb-2">Không tìm thấy quán</h2>
        <p className="text-muted-foreground mb-6">Quán ăn này không tồn tại hoặc đã bị xóa</p>
        <Link to="/">
          <Button className="gradient-primary text-white border-0">Về trang chủ</Button>
        </Link>
      </div>
    )
  }

  // Calculate overall stats from all reviews (not just 24h)
  const allRatings = reviews?.map((r) => r.rating) ?? []
  const overallAvg =
    allRatings.length > 0
      ? Math.round((allRatings.reduce((s, r) => s + r, 0) / allRatings.length) * 10) / 10
      : 0

  // Count vibe tags
  const vibeCount: Record<string, number> = {}
  reviews?.forEach((r) => {
    r.vibe_tags?.forEach((tag) => {
      vibeCount[tag] = (vibeCount[tag] ?? 0) + 1
    })
  })
  const sortedVibes = Object.entries(vibeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </Link>

      {/* Restaurant Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground">
          {restaurant.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground">
          <span className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" />
            {restaurant.address}, {restaurant.city}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            {new Date(restaurant.created_at).toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border">
            <StarRating value={Math.round(overallAvg)} readonly size="sm" />
            <span className="text-sm font-semibold">{overallAvg > 0 ? overallAvg : '—'}</span>
            <span className="text-xs text-muted-foreground">
              ({allRatings.length} reviews)
            </span>
          </div>
          {sortedVibes.map(([tag, count]) => (
            <div key={tag} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border">
              <VibeTagBadge tag={tag} size="sm" />
              <span className="text-xs text-muted-foreground">×{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Real Score + Mini Map */}
        <div className="lg:col-span-1 order-first space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {realScore && <RealScore data={realScore} />}

          {/* Mini Map */}
          {(() => {
            const pin = FAKE_RESTAURANTS.find((r) => r.id === id) ?? FAKE_RESTAURANTS[Math.abs(id.charCodeAt(0) % FAKE_RESTAURANTS.length)]
            return (
              <div className="rounded-2xl bg-card border border-border overflow-hidden card-shadow">
                <div className="px-4 pt-4 pb-2">
                  <h3 className="text-sm font-heading font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    Vị trí trên bản đồ
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{restaurant.address}</p>
                </div>
                <FakeMapCanvas
                  selectedId={pin.id}
                  showCategoryFilter={false}
                  mini={true}
                  height="180px"
                />
                <div className="p-3">
                  <Link to="/map">
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl gradient-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                      <Navigation className="h-3.5 w-3.5" />
                      Mở bản đồ & Chỉ đường
                    </button>
                  </Link>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-heading font-bold text-foreground mb-4">
            📝 Tất cả review ({reviews?.length ?? 0})
          </h2>

          {loadingReviews && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          )}

          {!loadingReviews && reviews?.length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-card border border-border card-shadow">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-muted-foreground">Chưa có review cho quán này</p>
            </div>
          )}

          {reviews && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className="rounded-2xl bg-card border border-border p-5 card-shadow animate-fade-in-up"
                  style={{ animationDelay: `${(i + 1) * 80}ms` }}
                >
                  {/* Image */}
                  {review.image_url && (
                    <img
                      src={review.image_url}
                      alt="Review"
                      className="w-full aspect-[16/9] object-cover rounded-xl mb-4"
                      loading="lazy"
                    />
                  )}

                  {/* Content */}
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">
                    {review.content}
                  </p>

                  {/* Rating + Tags */}
                  <div className="flex flex-wrap items-center gap-3">
                    <StarRating value={review.rating} readonly size="sm" />
                    {review.vibe_tags?.map((tag) => (
                      <VibeTagBadge key={tag} tag={tag} size="sm" />
                    ))}
                  </div>

                  {/* Time */}
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(review.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/restaurant/$id')({
  component: RestaurantDetailPage,
})
