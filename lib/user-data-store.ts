import fs from 'fs'
import path from 'path'

export interface UserData {
  userId: string
  cart: {
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
      image?: string
      slug: string
    }>
    updatedAt: string
  }
  shippingAddress?: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod?: string
  preferences?: {
    language?: string
    currency?: string
    notifications?: boolean
  }
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const USER_DATA_FILE = path.join(DATA_DIR, 'user-data.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Load user data from file
export function loadUserData(): UserData[] {
  try {
    if (!fs.existsSync(USER_DATA_FILE)) {
      return []
    }
    const data = fs.readFileSync(USER_DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading user data:', error)
    return []
  }
}

// Save user data to file
export function saveUserData(userData: UserData[]): void {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

// Get user data by ID
export function getUserData(userId: string): UserData | null {
  const userData = loadUserData()
  return userData.find(user => user.userId === userId) || null
}

// Create or update user data
export function saveUserInfo(userId: string, data: Partial<UserData>): UserData {
  const userData = loadUserData()
  const existingIndex = userData.findIndex(user => user.userId === userId)
  
  const now = new Date().toISOString()
  
  if (existingIndex >= 0) {
    // Update existing user data
    userData[existingIndex] = {
      ...userData[existingIndex],
      ...data,
      userId,
      updatedAt: now
    }
  } else {
    // Create new user data
    const newUserData: UserData = {
      userId,
      cart: { items: [], updatedAt: now },
      createdAt: now,
      updatedAt: now,
      ...data
    }
    userData.push(newUserData)
  }
  
  saveUserData(userData)
  return userData[existingIndex >= 0 ? existingIndex : userData.length - 1]
}

// Save user cart
export function saveUserCart(userId: string, cart: UserData['cart']): void {
  const userData = loadUserData()
  const existingIndex = userData.findIndex(user => user.userId === userId)
  
  const now = new Date().toISOString()
  
  if (existingIndex >= 0) {
    userData[existingIndex].cart = {
      ...cart,
      updatedAt: now
    }
    userData[existingIndex].updatedAt = now
  } else {
    // Create new user data with cart
    const newUserData: UserData = {
      userId,
      cart: {
        ...cart,
        updatedAt: now
      },
      createdAt: now,
      updatedAt: now
    }
    userData.push(newUserData)
  }
  
  saveUserData(userData)
}

// Get user cart
export function getUserCart(userId: string): UserData['cart'] | null {
  const user = getUserData(userId)
  return user?.cart || null
}

// Save user shipping address
export function saveUserShippingAddress(userId: string, address: UserData['shippingAddress']): void {
  const data = getUserData(userId) || {} as Partial<UserData>
  saveUserInfo(userId, { 
    ...data, 
    shippingAddress: address 
  })
}

// Get user shipping address
export function getUserShippingAddress(userId: string): UserData['shippingAddress'] | null {
  const user = getUserData(userId)
  return user?.shippingAddress || null
}

// Save user payment method
export function saveUserPaymentMethod(userId: string, paymentMethod: string): void {
  const data = getUserData(userId) || {} as Partial<UserData>
  saveUserInfo(userId, { 
    ...data, 
    paymentMethod 
  })
}

// Get user payment method
export function getUserPaymentMethod(userId: string): string | null {
  const user = getUserData(userId)
  return user?.paymentMethod || null
}

// Clear user cart
export function clearUserCart(userId: string): void {
  saveUserCart(userId, { 
    items: [], 
    updatedAt: new Date().toISOString() 
  })
}
