import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus, Flame, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReviewCard, ReviewCardSkeleton } from '@/components/ReviewCard'
import { useReviews, useRealtimeReviews } from '@/hooks/useReviews'
import { useAuthStore } from '@/stores/useAuthStore'

function HomePage() {
  const { data: reviews, isLoading, error } = useReviews()
  const { isAuthenticated } = useAuthStore()

  // Enable real-time updates
  useRealtimeReviews()

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 animate-fade-in-up">
              <Flame className="h-3.5 w-3.5" />
              Real-time food reviews
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Ăn gì hôm nay?
              <br />
              <span className="text-gradient">Phút Thật</span> trả lời!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Khám phá review ẩm thực real-time từ cộng đồng. Chia sẻ trải nghiệm, tìm quán ngon, check{' '}
              <span className="font-semibold text-foreground">Real Score</span> trước khi ăn!
            </p>
            {isAuthenticated && (
              <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <Link to="/review/new">
                  <Button
                    size="lg"
                    className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2 text-base font-semibold h-12 px-8"
                  >
                    <Plus className="h-5 w-5" />
                    Đăng review ngay!
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Utensils className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground">
            Review mới nhất
          </h2>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">⚠️ Lỗi tải dữ liệu: {error.message}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && reviews?.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍜</div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">
              Chưa có review nào!
            </h3>
            <p className="text-muted-foreground mb-6">
              Hãy là người đầu tiên chia sẻ trải nghiệm ẩm thực
            </p>
            {isAuthenticated && (
              <Link to="/review/new">
                <Button className="gradient-primary text-white border-0 gap-2">
                  <Plus className="h-4 w-4" />
                  Đăng review đầu tiên
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Review Grid */}
        {reviews && reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* FAB — Mobile */}
      {isAuthenticated && (
        <Link to="/review/new" className="fixed bottom-6 right-6 md:hidden z-40">
          <button className="h-14 w-14 rounded-full gradient-primary text-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center animate-float">
            <Plus className="h-6 w-6" />
          </button>
        </Link>
      )}
    </div>
  )
}

export const Route = createFileRoute('/')(  {
  component: HomePage,
})