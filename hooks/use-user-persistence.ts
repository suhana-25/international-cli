'use client'

import { useEffect, useCallback, useState } from 'react'
import { useCart } from '@/lib/context/cart-context'
import { getSession } from '@/lib/session'

export function useUserPersistence() {
  const [session, setSession] = useState<any>(null)
  const { state, clearCart } = useCart()
  const cartItems = state.items

  // Get session from localStorage
  useEffect(() => {
    const userSession = getSession()
    setSession(userSession ? { user: userSession } : null)
  }, [])

  // Load user data on sign in
  const loadUserData = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/user/data')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const userData = result.data

          // Restore cart if it exists and has items
          if (userData.cart?.items?.length > 0) {
            // For now, we'll just save this data to the backend
            // The cart context handles its own localStorage persistence
            console.log('User cart data available:', userData.cart.items)
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }, [session?.user?.id])

  // Save cart data when it changes
  const saveCartData = useCallback(async () => {
    if (!session?.user?.id || cartItems.length === 0) return

    try {
      await fetch('/api/user/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cart',
          data: {
            items: cartItems,
            updatedAt: new Date().toISOString()
          }
        })
      })
    } catch (error) {
      console.error('Error saving cart data:', error)
    }
  }, [session?.user?.id, cartItems])

  // Additional data saving functions can be added here

  // Load user data when user signs in
  useEffect(() => {
    if (session?.user?.id) {
      loadUserData()
    }
    // Don't clear cart automatically - causes infinite loop
  }, [session?.user?.id, loadUserData])

  // Save cart data when it changes (debounced)
  useEffect(() => {
    if (session?.user?.id && cartItems.length > 0) {
      const timeoutId = setTimeout(saveCartData, 1000) // Debounce for 1 second
      return () => clearTimeout(timeoutId)
    }
  }, [cartItems, saveCartData, session?.user?.id])

  return {
    loadUserData,
    saveCartData
  }
}
