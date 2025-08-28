export const APP_NAME = 'Nitesh Handicraft'

export const PAGE_SIZE = 12

export const PAYMENT_METHODS = [
  'whatsapp',
] as const

export const DEFAULT_PAYMENT_METHOD = 'whatsapp'

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export const signInDefaultValues = {
  email: '',
  password: '',
}

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const shippingAddressDefaultValues = {
  fullName: '',
  email: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
  lat: undefined,
  lng: undefined,
  phone: '', // Ensure phone is always defined
}

export const productDefaultValues = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  weight: 0,
  images: [],
  bannerImages: [],
  categoryId: '',
  brand: '',
  isFeatured: false,
  isBanner: false,
}

export const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}
