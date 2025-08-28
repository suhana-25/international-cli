// Order types for the enhanced order store

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: number
  shippingAddress: string | null // JSON string in database
  paymentStatus: 'pending' | 'confirmed' | 'failed'
  paymentMethod: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderInput {
  userId: string
  orderNumber: string
  totalAmount: number
  shippingAddress?: string // JSON string
  paymentMethod?: string
}

export interface UpdateOrderInput {
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount?: number
  shippingAddress?: string // JSON string
  paymentStatus?: 'pending' | 'confirmed' | 'failed'
  paymentMethod?: string
}
