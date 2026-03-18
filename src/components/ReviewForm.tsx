import { useState, useRef, type ChangeEvent } from 'react'
import { useRouter } from '@tanstack/react-router'
import { ImagePlus, Loader2, Send, X, Plus, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StarRating } from './StarRating'
import { VibeTagSelector } from './VibeTagBadge'
import {
  useCreateReview,
  useUploadImage,
  useRestaurants,
  useCreateRestaurant,
} from '@/hooks/useReviews'

export function ReviewForm() {
  const router = useRouter()

  // Form state
  const [restaurantId, setRestaurantId] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [vibeTags, setVibeTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // New restaurant modal state
  const [showNewRestaurant, setShowNewRestaurant] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newCity, setNewCity] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const { data: restaurants = [] } = useRestaurants()
  const uploadImage = useUploadImage()
  const createReview = useCreateReview()
  const createRestaurant = useCreateRestaurant()

  const isPending =
    uploadImage.isPending || createReview.isPending || createRestaurant.isPending

  // Image handling
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh không được vượt quá 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleVibeToggle = (tag: string) => {
    setVibeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!restaurantId) {
      setError('Vui lòng chọn quán ăn')
      return
    }
    if (!imageFile) {
      setError('Vui lòng chọn ảnh món ăn')
      return
    }
    if (!content.trim()) {
      setError('Vui lòng viết cảm nhận của bạn')
      return
    }
    if (rating === 0) {
      setError('Vui lòng chấm điểm từ 1 đến 5 sao')
      return
    }

    try {
      // 1. Upload image
      const imageUrl = await uploadImage.mutateAsync(imageFile)

      // 2. Create review
      await createReview.mutateAsync({
        restaurant_id: restaurantId,
        content: content.trim(),
        image_url: imageUrl,
        rating,
        vibe_tags: vibeTags,
      })

      // 3. Redirect to homepage
      router.navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi, thử lại nhé!')
    }
  }

  // Create new restaurant
  const handleCreateRestaurant = async () => {
    if (!newName.trim() || !newAddress.trim() || !newCity.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin quán')
      return
    }
    try {
      const restaurant = await createRestaurant.mutateAsync({
        name: newName.trim(),
        address: newAddress.trim(),
        city: newCity.trim(),
      })
      setRestaurantId(restaurant.id)
      setShowNewRestaurant(false)
      setNewName('')
      setNewAddress('')
      setNewCity('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo quán mới')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── Image Upload ─── */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          📸 Ảnh món ăn
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {imagePreview ? (
          <div className="relative group rounded-2xl overflow-hidden aspect-video border border-border">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-3 group"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground/80">
                Bấm để chọn ảnh
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG, WebP • Tối đa 5MB
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ─── Restaurant Selection ─── */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          🏪 Quán ăn
        </Label>
        <div className="flex gap-2">
          <select
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            className="flex-1 h-10 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">— Chọn quán ăn —</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} – {r.city}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowNewRestaurant(!showNewRestaurant)}
            title="Thêm quán mới"
          >
            {showNewRestaurant ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* New restaurant form */}
        {showNewRestaurant && (
          <div className="mt-3 p-4 rounded-xl bg-muted/50 border border-border space-y-3 animate-scale-in">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Store className="h-4 w-4" />
              Thêm quán mới
            </div>
            <Input
              placeholder="Tên quán"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="Địa chỉ"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Input
              placeholder="Thành phố"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
            <Button
              type="button"
              size="sm"
              onClick={handleCreateRestaurant}
              disabled={createRestaurant.isPending}
              className="gradient-primary text-white border-0 w-full"
            >
              {createRestaurant.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Tạo quán
            </Button>
          </div>
        )}
      </div>

      {/* ─── Star Rating ─── */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          ⭐ Chấm điểm
        </Label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {rating === 1 && '😞 Tệ lắm'}
            {rating === 2 && '😕 Chưa ổn'}
            {rating === 3 && '😐 Bình thường'}
            {rating === 4 && '😊 Khá ngon'}
            {rating === 5 && '🤩 Xuất sắc!'}
          </p>
        )}
      </div>

      {/* ─── Vibe Tags ─── */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          🏷️ Food Vibe
        </Label>
        <VibeTagSelector selected={vibeTags} onToggle={handleVibeToggle} />
      </div>

      {/* ─── Content ─── */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          ✍️ Cảm nhận của bạn
        </Label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ trải nghiệm ăn uống của bạn..."
          rows={4}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {content.length}/500
        </p>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive animate-scale-in">
          {error}
        </div>
      )}

      {/* ─── Submit ─── */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 text-base font-semibold gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Đang đăng review...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Đăng review ngay!
          </>
        )}
      </Button>
    </form>
  )
}
