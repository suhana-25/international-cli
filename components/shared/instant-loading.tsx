'use client'

import { Suspense, Component } from 'react'
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Loading skeletons for different content types
export function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 border rounded-lg">
      <div className="bg-gray-200 h-48 rounded-lg"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 h-4 rounded"></div>
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-6 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="animate-pulse flex items-center space-x-3 p-3 border rounded-lg">
      <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="bg-gray-200 h-4 rounded"></div>
        <div className="bg-gray-200 h-3 rounded w-2/3"></div>
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="animate-pulse flex items-center space-x-4 p-4 border-b">
      <div className="bg-gray-200 h-16 w-16 rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="bg-gray-200 h-4 rounded"></div>
        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
      </div>
      <div className="bg-gray-200 h-8 w-20 rounded"></div>
    </div>
  )
}

export function HeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-16 w-full"></div>
      <div className="bg-gray-100 h-10 w-full"></div>
    </div>
  )
}

// Enhanced loading component with status
interface InstantLoadingProps {
  type?: 'spinner' | 'skeleton' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  showProgress?: boolean
  progress?: number
}

export function InstantLoading({
  type = 'spinner',
  size = 'md',
  text = 'Loading...',
  className,
  showProgress = false,
  progress = 0,
}: InstantLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  if (type === 'pulse') {
    return (
      <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
    )
  }

  if (type === 'skeleton') {
    return (
      <div className={cn('animate-pulse space-y-2', className)}>
        <div className="bg-gray-200 h-4 rounded"></div>
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && (
        <span className="text-sm text-gray-600 font-medium">{text}</span>
      )}
      {showProgress && (
        <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Error boundary component
interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  retry?: () => void
}

export function ErrorFallback({ error, resetError, retry }: ErrorFallbackProps) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
        {isNetworkError ? (
          <WifiOff className="w-8 h-8 text-red-600" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-600" />
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {isNetworkError ? 'Connection Error' : 'Something went wrong'}
        </h3>
        <p className="text-sm text-gray-600 max-w-md">
          {isNetworkError 
            ? 'Unable to connect to the server. Please check your internet connection.'
            : 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      
      <div className="flex space-x-3">
        <Button onClick={retry || resetError} variant="default" size="sm">
          <Wifi className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button onClick={resetError} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </div>
  )
}

// Custom Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<
  { children: React.ReactNode; onError?: (error: Error) => void; fallback?: React.ComponentType<ErrorFallbackProps> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

// Suspense wrapper with enhanced loading states
interface InstantSuspenseProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<ErrorFallbackProps>
  loadingText?: string
  retryFunction?: () => void
}

export function InstantSuspense({
  children,
  fallback,
  errorFallback: ErrorComponent = ErrorFallback,
  loadingText = 'Loading...',
  retryFunction,
}: InstantSuspenseProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px]">
      <InstantLoading text={loadingText} />
    </div>
  )

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorComponent {...props} retry={retryFunction} />}
      onError={(error) => console.error('Suspense Error:', error)}
    >
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// Network status indicator
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowStatus(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showStatus && isOnline) return null

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 p-3 text-center text-sm font-medium transition-all duration-300',
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      )}
    >
      <div className="flex items-center justify-center space-x-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Back online!</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>You're offline. Some features may not work.</span>
          </>
        )}
      </div>
    </div>
  )
}

// Progressive loading component
interface ProgressiveLoadingProps {
  stages: Array<{
    text: string
    duration: number
  }>
  onComplete?: () => void
}

export function ProgressiveLoading({ stages, onComplete }: ProgressiveLoadingProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStage >= stages.length) {
      onComplete?.()
      return
    }

    const stage = stages[currentStage]
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (stage.duration / 50))
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setCurrentStage(prev => prev + 1)
            setProgress(0)
          }, 100)
        }
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [currentStage, stages, onComplete])

  if (currentStage >= stages.length) return null

  return (
    <div className="flex flex-col items-center space-y-4 p-8">
      <InstantLoading
        text={stages[currentStage]?.text}
        showProgress
        progress={progress}
      />
    </div>
  )
}

// Import missing React hooks
import { useState, useEffect } from 'react'
