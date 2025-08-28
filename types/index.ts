export interface Cart {
  items: CartItem[]
  total: number
}

export interface CartItem {
  id: string
  cartId?: string
  productId: string
  quantity: number
  product?: {
    name: string
    price: number
    image: string
  }
}

export interface ShippingAddress {
  fullName: string
  email: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  weight: number | null
  stock: number
  images: string[] | null
  bannerImages: string[] | null

  
  categoryId: string | null
  brand: string | null
  isFeatured: boolean
  isBanner: boolean
  rating: number | null
  numReviews: number | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: string
  totalAmount: number
  itemsPrice?: number
  taxPrice?: number
  shippingPrice?: number
  totalPrice?: number
  shippingAddress?: ShippingAddress
  paymentStatus: string
  paymentMethod?: string
  createdAt: string
  updatedAt: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  price: number
  createdAt: string
}
