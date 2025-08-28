'use client'

import { useState, useCallback, useEffect, useRef, useTransition } from 'react'
import { useSWRConfig } from 'swr'

interface OptimisticUpdate<T> {
  key: string
  updater: (data: T) => T
  revert?: (data: T) => T
}

interface UseInstantUIOptions {
  enableOptimistic?: boolean
  debounceMs?: number
  prefetchRoutes?: string[]
}

export function useInstantUI<T>(
  swrKey: string,
  options: UseInstantUIOptions = {}
) {
  const { enableOptimistic = true, debounceMs = 100, prefetchRoutes = [] } = options
  const { mutate, cache } = useSWRConfig()
  const [isPending, startTransition] = useTransition()
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, any>>(new Map())
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Optimistic update function
  const optimisticUpdate = useCallback(async <T>(
    key: string,
    updater: (data: T) => T,
    serverAction?: () => Promise<void>
  ) => {
    if (!enableOptimistic) {
      if (serverAction) {
        await serverAction()
      }
      return
    }

    // Apply optimistic update immediately
    startTransition(() => {
      mutate(
        key,
        (currentData: T | undefined) => {
          if (!currentData) return currentData
          
          const updated = updater(currentData)
          
          // Store optimistic update for potential revert
          setOptimisticUpdates(prev => new Map(prev.set(key, { original: currentData, updated })))
          
          return updated
        },
        { revalidate: false }
      )
    })

    // Perform server action
    if (serverAction) {
      try {
        await serverAction()
        
        // Clear optimistic update on success
        setOptimisticUpdates(prev => {
          const newMap = new Map(prev)
          newMap.delete(key)
          return newMap
        })
        
        // Revalidate to sync with server
        await mutate(key)
      } catch (error) {
        // Revert optimistic update on error
        const optimisticUpdate = optimisticUpdates.get(key)
        if (optimisticUpdate) {
          mutate(key, optimisticUpdate.original, { revalidate: false })
          setOptimisticUpdates(prev => {
            const newMap = new Map(prev)
            newMap.delete(key)
            return newMap
          })
        }
        throw error
      }
    }
  }, [mutate, enableOptimistic, optimisticUpdates])

  // Debounced update function
  const debouncedUpdate = useCallback((
    updateFn: () => void | Promise<void>
  ) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        await updateFn()
      } catch (error) {
        console.error('Debounced update failed:', error)
      }
    }, debounceMs)
  }, [debounceMs])

  // Instant navigation with prefetching
  const instantNavigate = useCallback(async (href: string, replace = false) => {
    // Dynamic import to avoid SSR issues
    const { useRouter } = await import('next/navigation')
    
    startTransition(() => {
      // This will be handled by the navigation component
      const event = new CustomEvent('instant-navigate', {
        detail: { href, replace }
      })
      window.dispatchEvent(event)
    })
  }, [])

  // Prefetch routes on component mount
  useEffect(() => {
    if (prefetchRoutes.length > 0) {
      // Prefetch all specified routes
      Promise.all(
        prefetchRoutes.map(async route => {
          try {
            const { useRouter } = await import('next/navigation')
            // This will be handled by the router context
            const event = new CustomEvent('prefetch-route', {
              detail: { route }
            })
            window.dispatchEvent(event)
          } catch (error) {
            console.error('Failed to prefetch route:', route, error)
          }
        })
      )
    }
  }, [prefetchRoutes])

  // Background sync function
  const backgroundSync = useCallback(async (keys: string[]) => {
    // Sync multiple keys in the background without blocking UI
    setTimeout(async () => {
      try {
        await Promise.all(keys.map(key => mutate(key)))
      } catch (error) {
        console.error('Background sync failed:', error)
      }
    }, 0)
  }, [mutate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    optimisticUpdate,
    debouncedUpdate,
    instantNavigate,
    backgroundSync,
    isPending,
    hasOptimisticUpdates: optimisticUpdates.size > 0,
  }
}

// Cart-specific instant UI hook
export function useInstantCart() {
  const { optimisticUpdate, isPending } = useInstantUI('cart-items')

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    await optimisticUpdate(
      'cart-items',
      (cartItems: any[]) => {
        const existingItem = cartItems.find(item => item.productId === productId)
        if (existingItem) {
          return cartItems.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        }
        return [...cartItems, { productId, quantity, id: Date.now() }]
      },
      async () => {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity, action: 'add' })
        })
        if (!response.ok) throw new Error('Failed to add to cart')
      }
    )
  }, [optimisticUpdate])

  const removeFromCart = useCallback(async (productId: string) => {
    await optimisticUpdate(
      'cart-items',
      (cartItems: any[]) => cartItems.filter(item => item.productId !== productId),
      async () => {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        if (!response.ok) throw new Error('Failed to remove from cart')
      }
    )
  }, [optimisticUpdate])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    await optimisticUpdate(
      'cart-items',
      (cartItems: any[]) => cartItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ),
      async () => {
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity })
        })
        if (!response.ok) throw new Error('Failed to update quantity')
      }
    )
  }, [optimisticUpdate])

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    isPending,
  }
}

// Product interaction hook for instant feedback
export function useInstantProductActions() {
  const { optimisticUpdate, isPending } = useInstantUI('products')

  const toggleWishlist = useCallback(async (productId: string) => {
    await optimisticUpdate(
      `product-${productId}`,
      (product: any) => ({
        ...product,
        isWishlisted: !product.isWishlisted
      }),
      async () => {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        if (!response.ok) throw new Error('Failed to toggle wishlist')
      }
    )
  }, [optimisticUpdate])

  const likeProduct = useCallback(async (productId: string) => {
    await optimisticUpdate(
      `product-${productId}`,
      (product: any) => ({
        ...product,
        likes: (product.likes || 0) + 1,
        isLiked: true
      }),
      async () => {
        const response = await fetch('/api/products/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        if (!response.ok) throw new Error('Failed to like product')
      }
    )
  }, [optimisticUpdate])

  return {
    toggleWishlist,
    likeProduct,
    isPending,
  }
}
