// ─── Fake Map Data ──────────────────────────────────────
// Tất cả dữ liệu là fake, không gọi API thật
// Tọa độ được scale về viewport 800x600 của FakeMapCanvas

export interface RestaurantPin {
  id: string
  name: string
  address: string
  city: string
  category: RestaurantCategory
  realScore: number
  checkIns: number
  reviewCount: number
  // Tọa độ fake (0-100) để scale vào canvas
  x: number
  y: number
  // Tag nổi bật nhất
  topTag?: string
  emoji: string
  priceRange: 1 | 2 | 3
}

export type RestaurantCategory =
  | 'Phở & Bún'
  | 'Bánh mì'
  | 'Hải sản'
  | 'Tráng miệng'
  | 'Đặc sản HP'
  | 'Đồ uống'

export interface FoodMap {
  id: string
  title: string
  description: string
  author: string
  authorEmoji: string
  stops: FoodMapStop[]
  likes: number
  views: number
  isPublic: boolean
  createdAt: string
  totalDistance: string
  estimatedTime: string
  tags: string[]
}

export interface FoodMapStop {
  restaurantId: string
  order: number
  note: string
  estimatedMinutes: number
}

export interface FakeDirection {
  fromId: string
  toId: string
  steps: DirectionStep[]
  distanceKm: number
  walkMinutes: number
  bikeMinutes: number
}

export interface DirectionStep {
  instruction: string
  distance: string
  icon: 'straight' | 'left' | 'right' | 'arrive'
}

// ─── Restaurants ────────────────────────────────────────

export const FAKE_RESTAURANTS: RestaurantPin[] = [
  {
    id: 'r1',
    name: 'Bánh Đa Cua Bà Cụ',
    address: '45 Lạch Tray, Ngô Quyền',
    city: 'Hải Phòng',
    category: 'Đặc sản HP',
    realScore: 4.8,
    checkIns: 234,
    reviewCount: 89,
    x: 28,
    y: 38,
    topTag: '🔥 Đáng thử',
    emoji: '🦀',
    priceRange: 2,
  },
  {
    id: 'r2',
    name: 'Nem Cua Bể Cô Lan',
    address: '12 Đinh Tiên Hoàng, Hồng Bàng',
    city: 'Hải Phòng',
    category: 'Đặc sản HP',
    realScore: 4.6,
    checkIns: 178,
    reviewCount: 67,
    x: 45,
    y: 30,
    topTag: '🔥 Đáng thử',
    emoji: '🥟',
    priceRange: 2,
  },
  {
    id: 'r3',
    name: 'Dừa Dầm Thanh Hương',
    address: '89 Cầu Đất, Ngô Quyền',
    city: 'Hải Phòng',
    category: 'Tráng miệng',
    realScore: 4.4,
    checkIns: 312,
    reviewCount: 145,
    x: 35,
    y: 58,
    topTag: '📸 Sống ảo đẹp',
    emoji: '🥥',
    priceRange: 1,
  },
  {
    id: 'r4',
    name: 'Hải Sản Tươi Sống Biển Đông',
    address: 'Chợ Tam Bạc, Hồng Bàng',
    city: 'Hải Phòng',
    category: 'Hải sản',
    realScore: 4.5,
    checkIns: 198,
    reviewCount: 72,
    x: 60,
    y: 42,
    topTag: '🔥 Đáng thử',
    emoji: '🦞',
    priceRange: 3,
  },
  {
    id: 'r5',
    name: 'Phở Bò Anh Tùng',
    address: '7 Trần Phú, Hồng Bàng',
    city: 'Hải Phòng',
    category: 'Phở & Bún',
    realScore: 4.7,
    checkIns: 421,
    reviewCount: 203,
    x: 52,
    y: 55,
    topTag: '💰 Giá rẻ',
    emoji: '🍜',
    priceRange: 1,
  },
  {
    id: 'r6',
    name: 'Bánh Mì Que Hải Phòng',
    address: '23 Nguyễn Đức Cảnh, Lê Chân',
    city: 'Hải Phòng',
    category: 'Bánh mì',
    realScore: 4.3,
    checkIns: 567,
    reviewCount: 289,
    x: 72,
    y: 65,
    topTag: '💰 Giá rẻ',
    emoji: '🥖',
    priceRange: 1,
  },
  {
    id: 'r7',
    name: 'Bún Cá Chợ Hàng',
    address: 'Chợ Hàng, Lê Chân',
    city: 'Hải Phòng',
    category: 'Phở & Bún',
    realScore: 4.5,
    checkIns: 189,
    reviewCount: 98,
    x: 65,
    y: 30,
    topTag: '🔥 Đáng thử',
    emoji: '🐟',
    priceRange: 2,
  },
  {
    id: 'r8',
    name: 'Trà Sữa Mấy Tầng',
    address: '101 Điện Biên Phủ, Lê Chân',
    city: 'Hải Phòng',
    category: 'Đồ uống',
    realScore: 4.1,
    checkIns: 678,
    reviewCount: 312,
    x: 80,
    y: 48,
    topTag: '📸 Sống ảo đẹp',
    emoji: '🧋',
    priceRange: 2,
  },
  {
    id: 'r9',
    name: 'Cá Kho Làng Vân',
    address: '56 Minh Khai, Hồng Bàng',
    city: 'Hải Phòng',
    category: 'Đặc sản HP',
    realScore: 4.6,
    checkIns: 142,
    reviewCount: 56,
    x: 40,
    y: 70,
    topTag: '🔥 Đáng thử',
    emoji: '🐟',
    priceRange: 2,
  },
  {
    id: 'r10',
    name: 'Bánh Cuốn Chả Mực',
    address: '34 Phan Bội Châu, Ngô Quyền',
    city: 'Hải Phòng',
    category: 'Đặc sản HP',
    realScore: 4.4,
    checkIns: 267,
    reviewCount: 134,
    x: 22,
    y: 52,
    topTag: '🔥 Đáng thử',
    emoji: '🥟',
    priceRange: 2,
  },
  {
    id: 'r11',
    name: 'Lẩu Cua Đồng Nhà Quê',
    address: '78 Lê Hồng Phong, An Dương',
    city: 'Hải Phòng',
    category: 'Hải sản',
    realScore: 4.7,
    checkIns: 156,
    reviewCount: 81,
    x: 15,
    y: 72,
    topTag: '😐 Overrated',
    emoji: '🦀',
    priceRange: 3,
  },
  {
    id: 'r12',
    name: 'Ốc Hồ Tây 24h',
    address: '90 Hồ Sen, Lê Chân',
    city: 'Hải Phòng',
    category: 'Hải sản',
    realScore: 4.2,
    checkIns: 489,
    reviewCount: 221,
    x: 82,
    y: 72,
    topTag: '💰 Giá rẻ',
    emoji: '🐚',
    priceRange: 2,
  },
  {
    id: 'r13',
    name: 'Cà Phê Bến Bính',
    address: 'Bến phà Bính, Hồng Bàng',
    city: 'Hải Phòng',
    category: 'Đồ uống',
    realScore: 4.5,
    checkIns: 334,
    reviewCount: 167,
    x: 20,
    y: 25,
    topTag: '📸 Sống ảo đẹp',
    emoji: '☕',
    priceRange: 2,
  },
  {
    id: 'r14',
    name: 'Bún Bò Huế Mệ Ngoại',
    address: '5 Quang Trung, Hồng Bàng',
    city: 'Hải Phòng',
    category: 'Phở & Bún',
    realScore: 4.4,
    checkIns: 198,
    reviewCount: 93,
    x: 55,
    y: 20,
    topTag: '💰 Giá rẻ',
    emoji: '🍲',
    priceRange: 1,
  },
  {
    id: 'r15',
    name: 'Chả Cá Sà Phân',
    address: '67 Nguyễn Tri Phương, Lê Chân',
    city: 'Hải Phòng',
    category: 'Đặc sản HP',
    realScore: 4.9,
    checkIns: 123,
    reviewCount: 45,
    x: 38,
    y: 42,
    topTag: '🔥 Đáng thử',
    emoji: '🐠',
    priceRange: 3,
  },
]

// ─── Food Maps ─────────────────────────────────────────

export const FAKE_FOOD_MAPS: FoodMap[] = [
  {
    id: 'fm1',
    title: '🔥 Food Tour Hải Phòng 200k',
    description: 'Một buổi tối đầy đủ ẩm thực Hải Phòng chỉ với 200k. Từ bánh đa cua đến dừa dầm, tất cả đều ngon và rẻ!',
    author: 'foodie_hp',
    authorEmoji: '👨‍🍳',
    stops: [
      { restaurantId: 'r1', order: 1, note: 'Order bánh đa cua tô lớn, ăn cả cua nguyên con', estimatedMinutes: 45 },
      { restaurantId: 'r2', order: 2, note: 'Mỗi người 10 cái nem là đủ', estimatedMinutes: 30 },
      { restaurantId: 'r5', order: 3, note: 'Ăn nhẹ thêm bát phở bò', estimatedMinutes: 30 },
      { restaurantId: 'r3', order: 4, note: 'Tráng miệng dừa dầm, chụp ảnh IG cực đẹp', estimatedMinutes: 30 },
    ],
    likes: 1240,
    views: 8930,
    isPublic: true,
    createdAt: '2026-03-15T10:00:00Z',
    totalDistance: '3.2 km',
    estimatedTime: '2.5 tiếng',
    tags: ['giá rẻ', 'đặc sản', 'phải thử'],
  },
  {
    id: 'fm2',
    title: '🌊 5 Quán Hải Sản Ngon Nhất HP',
    description: 'Dành cho những ai mê hải sản tươi sống. 5 địa chỉ không thể bỏ qua khi đến Hải Phòng.',
    author: 'seafood_lover',
    authorEmoji: '🦞',
    stops: [
      { restaurantId: 'r4', order: 1, note: 'Tôm hùm 500k/con, ghẹ luộc 150k/kg', estimatedMinutes: 90 },
      { restaurantId: 'r11', order: 2, note: 'Lẩu cua đồng độc đáo, khác hẳn cua biển', estimatedMinutes: 60 },
      { restaurantId: 'r12', order: 3, note: 'Ốc đêm, ngồi vỉa hè thư giãn', estimatedMinutes: 60 },
    ],
    likes: 876,
    views: 5420,
    isPublic: true,
    createdAt: '2026-03-18T14:00:00Z',
    totalDistance: '5.1 km',
    estimatedTime: '3.5 tiếng',
    tags: ['hải sản', 'sang chảnh', 'nhóm bạn'],
  },
  {
    id: 'fm3',
    title: '⚡ Hải Phòng Ăn Trong 1 Buổi Tối',
    description: 'Chỉ có 3 tiếng? Đây là lộ trình ăn nhanh nhất mà vẫn đủ các món đặc trưng HP.',
    author: 'hp_quick_tour',
    authorEmoji: '⚡',
    stops: [
      { restaurantId: 'r6', order: 1, note: 'Bánh mì que ăn nhanh 15 phút', estimatedMinutes: 15 },
      { restaurantId: 'r10', order: 2, note: 'Bánh cuốn chả mực - must try', estimatedMinutes: 30 },
      { restaurantId: 'r1', order: 3, note: 'Bánh đa cua - đặc sản số 1', estimatedMinutes: 45 },
      { restaurantId: 'r3', order: 4, note: 'Dừa dầm tráng miệng', estimatedMinutes: 20 },
      { restaurantId: 'r8', order: 5, note: 'Trà sữa trước khi về', estimatedMinutes: 20 },
    ],
    likes: 2100,
    views: 15680,
    isPublic: true,
    createdAt: '2026-03-10T08:00:00Z',
    totalDistance: '4.7 km',
    estimatedTime: '2 tiếng',
    tags: ['nhanh gọn', 'tiết kiệm', 'phổ biến'],
  },
  {
    id: 'fm4',
    title: '📸 Food Tour Sống Ảo Hải Phòng',
    description: 'Vừa ăn ngon, vừa chụp ảnh đẹp. Tất cả địa điểm đều cực kỳ photogenic!',
    author: 'insta_foodie',
    authorEmoji: '📸',
    stops: [
      { restaurantId: 'r13', order: 1, note: 'Cà phê view sông, golden hour 5h chiều', estimatedMinutes: 60 },
      { restaurantId: 'r3', order: 2, note: 'Dừa dầm màu sắc rực rỡ', estimatedMinutes: 30 },
      { restaurantId: 'r8', order: 3, note: 'Trà sữa unique tầng tầng lớp lớp', estimatedMinutes: 30 },
    ],
    likes: 645,
    views: 3210,
    isPublic: true,
    createdAt: '2026-03-19T16:00:00Z',
    totalDistance: '2.8 km',
    estimatedTime: '2 tiếng',
    tags: ['sống ảo', 'ảnh đẹp', 'couple'],
  },
  {
    id: 'fm5',
    title: '🌙 Phở Bún Đêm Khuya Hải Phòng',
    description: 'Sau 10 giờ tối vẫn muốn ăn? Đây là các quán mở đêm khuya ngon nhất.',
    author: 'night_owl_hp',
    authorEmoji: '🦉',
    stops: [
      { restaurantId: 'r5', order: 1, note: 'Phở bò mở đến 2h sáng', estimatedMinutes: 30 },
      { restaurantId: 'r12', order: 2, note: 'Ốc 24/7', estimatedMinutes: 60 },
      { restaurantId: 'r7', order: 3, note: 'Bún cá mở sớm từ 5h sáng', estimatedMinutes: 30 },
    ],
    likes: 432,
    views: 2890,
    isPublic: true,
    createdAt: '2026-03-17T22:00:00Z',
    totalDistance: '3.9 km',
    estimatedTime: '2 tiếng',
    tags: ['đêm khuya', 'mở muộn', 'ăn đêm'],
  },
]

// My personal maps (user-created)
export const FAKE_MY_MAPS: FoodMap[] = [
  {
    id: 'my1',
    title: 'Lộ trình tuần này của mình',
    description: 'Mấy quán mình đang muốn thử, lên kế hoạch dần',
    author: 'me',
    authorEmoji: '😊',
    stops: [
      { restaurantId: 'r15', order: 1, note: 'Nghe nói chả cá ở đây ngon lắm', estimatedMinutes: 45 },
      { restaurantId: 'r9', order: 2, note: 'Thử cá kho kiểu làng Vân', estimatedMinutes: 40 },
    ],
    likes: 0,
    views: 0,
    isPublic: false,
    createdAt: '2026-03-20T10:00:00Z',
    totalDistance: '1.8 km',
    estimatedTime: '1.5 tiếng',
    tags: ['kế hoạch', 'cá nhân'],
  },
]

// ─── Fake Directions ────────────────────────────────────

export const FAKE_DIRECTIONS: FakeDirection[] = [
  {
    fromId: 'r1',
    toId: 'r2',
    steps: [
      { instruction: 'Đi thẳng trên Lạch Tray', distance: '350m', icon: 'straight' },
      { instruction: 'Rẽ phải vào Đinh Tiên Hoàng', distance: '120m', icon: 'right' },
      { instruction: 'Đến nơi - Nem Cua Bể Cô Lan bên tay trái', distance: '', icon: 'arrive' },
    ],
    distanceKm: 0.47,
    walkMinutes: 6,
    bikeMinutes: 2,
  },
  {
    fromId: 'r2',
    toId: 'r5',
    steps: [
      { instruction: 'Ra khỏi Đinh Tiên Hoàng, rẽ trái', distance: '200m', icon: 'left' },
      { instruction: 'Đi thẳng đến ngã tư Trần Phú', distance: '450m', icon: 'straight' },
      { instruction: 'Rẽ phải vào Trần Phú', distance: '80m', icon: 'right' },
      { instruction: 'Đến nơi - Phở Bò Anh Tùng bên phải', distance: '', icon: 'arrive' },
    ],
    distanceKm: 0.73,
    walkMinutes: 9,
    bikeMinutes: 3,
  },
]

// ─── Helper ─────────────────────────────────────────────

export function getRestaurantById(id: string): RestaurantPin | undefined {
  return FAKE_RESTAURANTS.find((r) => r.id === id)
}

export function getFoodMapById(id: string): FoodMap | undefined {
  return [...FAKE_FOOD_MAPS, ...FAKE_MY_MAPS].find((m) => m.id === id)
}

export function getDirections(fromId: string, toId: string): FakeDirection | undefined {
  return FAKE_DIRECTIONS.find((d) => d.fromId === fromId && d.toId === toId)
    || FAKE_DIRECTIONS.find((d) => d.fromId === toId && d.toId === fromId)
    || {
      fromId,
      toId,
      steps: [
        { instruction: 'Đi về hướng trung tâm thành phố', distance: '300m', icon: 'straight' as const },
        { instruction: 'Rẽ trái tại ngã tư đầu tiên', distance: '200m', icon: 'left' as const },
        { instruction: 'Đi thẳng 400m', distance: '400m', icon: 'straight' as const },
        { instruction: 'Rẽ phải, đến nơi bên tay trái', distance: '150m', icon: 'right' as const },
        { instruction: 'Bạn đã đến nơi! 🎉', distance: '', icon: 'arrive' as const },
      ],
      distanceKm: Math.round((Math.random() * 2 + 0.5) * 10) / 10,
      walkMinutes: Math.floor(Math.random() * 15 + 5),
      bikeMinutes: Math.floor(Math.random() * 5 + 2),
    }
}

export const CATEGORIES: RestaurantCategory[] = [
  'Phở & Bún',
  'Bánh mì',
  'Hải sản',
  'Tráng miệng',
  'Đặc sản HP',
  'Đồ uống',
]
