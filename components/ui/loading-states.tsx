'use client'

import React from 'react'
import { Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  )
}

// Skeleton Loading Component
interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-gray-200 rounded',
            className
          )}
        />
      ))}
    </>
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
      <Skeleton className="w-full h-48 rounded-md" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-4" />
      <Skeleton className="w-1/3 h-6" />
    </div>
  )
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
      <Skeleton className="w-full h-32 rounded-md" />
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-full h-4" count={2} />
      <Skeleton className="w-1/3 h-4" />
    </div>
  )
}

// Gallery Item Skeleton
export function GalleryItemSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 space-y-2">
      <Skeleton className="w-full h-32 rounded-md" />
      <Skeleton className="w-2/3 h-4" />
      <Skeleton className="w-1/2 h-3" />
    </div>
  )
}

// Loading Overlay Component
interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  className?: string
}

export function LoadingOverlay({ isVisible, text = 'Loading...', className }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

// Real-time Update Indicator
interface RealTimeUpdateProps {
  isUpdating: boolean
  lastUpdate?: Date
  className?: string
}

export function RealTimeUpdateIndicator({ isUpdating, lastUpdate, className }: RealTimeUpdateProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <div className={cn(
        'w-2 h-2 rounded-full transition-colors',
        isUpdating ? 'bg-blue-500' : 'bg-green-500'
      )} />
      
      <span className={cn(
        'transition-colors',
        isUpdating ? 'text-blue-600' : 'text-green-600'
      )}>
        {isUpdating ? 'Updating...' : 'Live'}
      </span>

      {lastUpdate && (
        <span className="text-gray-500 text-xs">
          Last: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

// Status Indicator Component
interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'idle'
  text?: string
  className?: string
}

export function StatusIndicator({ status, text, className }: StatusIndicatorProps) {
  const statusConfig = {
    loading: {
      icon: RefreshCw,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      text: text || 'Loading...'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      text: text || 'Success!'
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      text: text || 'Error occurred'
    },
    idle: {
      icon: CheckCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      text: text || 'Ready'
    }
  }

  const config = statusConfig[status]
  const IconComponent = config.icon

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg',
      config.bgColor,
      className
    )}>
      <IconComponent className={cn('w-4 h-4', config.color)} />
      <span className={cn('text-sm font-medium', config.color)}>
        {config.text}
      </span>
    </div>
  )
}

// Page Loading Component
interface PageLoadingProps {
  title?: string
  description?: string
  showProgress?: boolean
}

export function PageLoading({ 
  title = 'Loading Page', 
  description = 'Please wait while we prepare everything for you...',
  showProgress = false 
}: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto">
            <LoadingSpinner size="lg" />
          </div>
          {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 max-w-md mx-auto">{description}</p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Inline Loading Component
interface InlineLoadingProps {
  text?: string
  size?: 'sm' | 'md'
  className?: string
}

export function InlineLoading({ text, size = 'md', className }: InlineLoadingProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <LoadingSpinner size={size} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

// Table Loading Component
export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
          <Skeleton className="w-20 h-8 rounded" />
        </div>
      ))}
    </div>
  )
}
