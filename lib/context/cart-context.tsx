'use client'

import { createContext, useContext, useReducer, useEffect, useState } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  weight: number
  stock?: number // Add stock information to cart item
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  cartItemCount: number
  addToCart: (item: CartItem) => Promise<{ success: boolean; message?: string }>
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => { success: boolean; message?: string }
  clearCart: () => void
  isLoading: boolean
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        // Check if new quantity would exceed stock
        const newQuantity = existingItem.quantity + action.payload.quantity
        const maxQuantity = action.payload.stock || existingItem.stock || newQuantity
        const finalQuantity = Math.min(newQuantity, maxQuantity)
        
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: finalQuantity, stock: action.payload.stock || item.stock }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
      } else {
        // For new items, ensure quantity doesn't exceed stock
        const maxQuantity = action.payload.stock || action.payload.quantity
        const finalQuantity = Math.min(action.payload.quantity, maxQuantity)
        const newItem = { ...action.payload, quantity: finalQuantity }
        const newItems = [...state.items, newItem]
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => {
        if (item.id === action.payload.id) {
          // Ensure quantity doesn't exceed stock
          const maxQuantity = item.stock || action.payload.quantity
          const finalQuantity = Math.min(action.payload.quantity, maxQuantity)
          return { ...item, quantity: finalQuantity }
        }
        return item
      })
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      }
    
    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Calculate total item count
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          if (Array.isArray(cartItems)) {
            dispatch({ type: 'LOAD_CART', payload: cartItems })
            console.log('Cart loaded from localStorage:', cartItems)
          } else {
            console.warn('Invalid cart data in localStorage, clearing...')
            localStorage.removeItem('cart')
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('cart')
      } finally {
        setIsLoading(false)
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      loadCart()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items))
        console.log('Cart saved to localStorage:', state.items)
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [state.items, isLoading])

  const addToCart = async (item: CartItem): Promise<{ success: boolean; message?: string }> => {
    // Check if product is out of stock
    if (item.stock !== undefined && item.stock <= 0) {
      return { success: false, message: "This product is out of stock" }
    }

    const existingItem = state.items.find(cartItem => cartItem.id === item.id)
    
    if (existingItem && item.stock !== undefined) {
      const newQuantity = existingItem.quantity + item.quantity
      if (newQuantity > item.stock) {
        const availableQuantity = item.stock - existingItem.quantity
        if (availableQuantity <= 0) {
          return { success: false, message: "No more stock available for this product" }
        }
        // Add only what's available
        dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: availableQuantity } })
        return { success: true, message: `Only ${availableQuantity} items were added (limited by stock)` }
      }
    }

    dispatch({ type: 'ADD_ITEM', payload: item })
    return { success: true }
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(id)
      return { success: true }
    }

    const existingItem = state.items.find(item => item.id === id)
    if (existingItem && existingItem.stock !== undefined && quantity > existingItem.stock) {
      // Set to max available stock
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: existingItem.stock } })
      return { success: true, message: `Quantity set to maximum available stock (${existingItem.stock})` }
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    return { success: true }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      cartItemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 
