import fs from 'fs'
import path from 'path'

export interface Order {
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }>
  total: number
  shippingAddress: {
    fullName: string
    streetAddress: string
    city: string
    country: string
    postalCode: string
    phone?: string
  }
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  createdAt: string
  updatedAt?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2))
}

export function loadOrders(): Order[] {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading orders:', error)
    return []
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    console.log('Saving orders to file:', ORDERS_FILE)
    console.log('Orders to save:', orders.length)
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2))
    console.log('Orders saved successfully to file')
  } catch (error) {
    console.error('Error saving orders:', error)
  }
}

export function getOrders(): Order[] {
  return loadOrders()
}

export function getOrderById(id: string): Order | null {
  const orders = loadOrders()
  return orders.find(order => order.id === id) || null
}

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'isPaid' | 'isDelivered'>): Order {
  const orders = loadOrders()
  
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const newOrder: Order = {
    id: orderId,
    ...orderData,
    status: 'pending',
    isPaid: false,
    isDelivered: false,
    createdAt: new Date().toISOString()
  }
  
  console.log('Creating new order:', newOrder)
  
  orders.push(newOrder)
  saveOrders(orders)
  
  console.log('Order saved. Total orders in system:', orders.length)
  
  return newOrder
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const orders = loadOrders()
  const orderIndex = orders.findIndex(order => order.id === id)
  
  if (orderIndex === -1) {
    return null
  }
  
  orders[orderIndex] = { 
    ...orders[orderIndex], 
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  saveOrders(orders)
  return orders[orderIndex]
}

export function deleteOrder(id: string): boolean {
  const orders = loadOrders()
  const initialLength = orders.length
  const filteredOrders = orders.filter(order => order.id !== id)
  
  if (filteredOrders.length === initialLength) {
    return false // Order not found
  }
  
  saveOrders(filteredOrders)
  return true
}

export function markOrderAsPaid(id: string): Order | null {
  return updateOrder(id, {
    isPaid: true,
    paidAt: new Date().toISOString(),
    status: 'confirmed'
  })
}

export function markOrderAsDelivered(id: string): Order | null {
  return updateOrder(id, {
    isDelivered: true,
    deliveredAt: new Date().toISOString(),
    status: 'delivered'
  })
}

export function getOrdersByUserId(userId: string): Order[] {
  const orders = loadOrders()
  return orders.filter(order => order.userId === userId)
}
