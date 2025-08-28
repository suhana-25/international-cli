'use client'

import React, { useState, useCallback } from 'react'
import { Button, ButtonProps } from './button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InstantButtonProps extends ButtonProps {
  onClickAsync?: () => Promise<void>
  loadingText?: string
  successText?: string
  successDuration?: number
}

export function InstantButton({
  onClick,
  onClickAsync,
  loadingText = 'Loading...',
  successText,
  successDuration = 1000,
  children,
  disabled,
  className,
  ...props
}: InstantButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return

    // Handle synchronous click
    if (onClick) {
      onClick(e)
      return
    }

    // Handle asynchronous operations
    if (onClickAsync) {
      setIsLoading(true)
      
      try {
        await onClickAsync()
        
        // Show success state if configured
        if (successText) {
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), successDuration)
        }
      } catch (error) {
        console.error('Button action failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [
    onClick,
    onClickAsync,
    disabled,
    isLoading,
    successText,
    successDuration
  ])

  const buttonContent = showSuccess && successText 
    ? successText 
    : isLoading && loadingText 
    ? loadingText 
    : children

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        'transition-all duration-200 ease-out',
        'transform active:scale-95',
        'hover:shadow-md',
        isLoading && 'cursor-not-allowed',
        showSuccess && 'bg-green-500 hover:bg-green-600 text-white',
        className
      )}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {buttonContent}
    </Button>
  )
}

// Enhanced button for cart operations
interface InstantCartButtonProps extends InstantButtonProps {
  productId: string
  quantity?: number
  operation: 'add' | 'remove' | 'update'
}

export function InstantCartButton({
  productId,
  quantity = 1,
  operation,
  ...props
}: InstantCartButtonProps) {
  const handleCartOperation = useCallback(async () => {
    // Simulate instant cart update (optimistic)
    const cartEvent = new CustomEvent('cart-optimistic-update', {
      detail: { productId, quantity, operation }
    })
    window.dispatchEvent(cartEvent)

    // Perform actual cart operation
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, operation })
      })
      
      if (!response.ok) {
        throw new Error('Cart operation failed')
      }

      // Sync cart with server response
      const result = await response.json()
      const syncEvent = new CustomEvent('cart-sync', { detail: result })
      window.dispatchEvent(syncEvent)
    } catch (error) {
      // Revert optimistic update
      const revertEvent = new CustomEvent('cart-revert', {
        detail: { productId, quantity, operation }
      })
      window.dispatchEvent(revertEvent)
      throw error
    }
  }, [productId, quantity, operation])

  return (
    <InstantButton
      {...props}
      onClickAsync={handleCartOperation}
    />
  )
}

// Enhanced navigation button with prefetching
interface InstantNavButtonProps extends InstantButtonProps {
  href?: string
  prefetch?: boolean
  replace?: boolean
}

export function InstantNavButton({
  href,
  prefetch = true,
  replace = false,
  onClick,
  children,
  ...props
}: InstantNavButtonProps) {
  const handleNavigation = useCallback(() => {
    if (href) {
      // Use router for instant navigation
      import('next/navigation').then(({ useRouter }) => {
        const router = useRouter()
        if (replace) {
          router.replace(href)
        } else {
          router.push(href)
        }
      })
    }
    
    if (onClick) {
      onClick({} as React.MouseEvent<HTMLButtonElement>)
    }
  }, [href, replace, onClick])

  // Prefetch route on hover
  const handleMouseEnter = useCallback(() => {
    if (href && prefetch) {
      import('next/navigation').then(({ useRouter }) => {
        const router = useRouter()
        router.prefetch(href)
      })
    }
  }, [href, prefetch])

  return (
    <InstantButton
      {...props}
      onClick={handleNavigation}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'hover:transform hover:scale-105',
        'active:transform active:scale-95',
        props.className
      )}
    >
      {children}
    </InstantButton>
  )
}
