// User types for the enhanced user store

export interface User {
  id: string
  email: string
  name: string | null
  password: string | null
  role: 'admin' | 'user'
  image: string | null
  address: string | null
  paymentMethod: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  name?: string
  password: string
  role?: 'admin' | 'user'
  isActive?: boolean
}

export interface UpdateUserInput {
  email?: string
  name?: string
  password?: string
  role?: 'admin' | 'user'
  isActive?: boolean
  lastSignIn?: Date
}
