'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RefreshProducts() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only start refresh after component is mounted to prevent hydration issues
    if (mounted) {
      // Auto refresh every 30 seconds to show new products
      const interval = setInterval(() => {
        router.refresh()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [router, mounted])

  // Return null during SSR to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return null
}

