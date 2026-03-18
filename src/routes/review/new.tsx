import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { ReviewForm } from '@/components/ReviewForm'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

function NewReviewPage() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-foreground">
          ✍️ Đăng Review Mới
        </h1>
        <p className="text-muted-foreground mt-1">
          Chia sẻ trải nghiệm ẩm thực của bạn với cộng đồng
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl bg-card border border-border p-6 card-shadow animate-fade-in-up">
        <ReviewForm />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/review/new')({
  component: NewReviewPage,
})
