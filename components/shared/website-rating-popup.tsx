'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Star } from 'lucide-react'

export default function WebsiteRatingPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Our Website Rating
            </h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              4.8 ★
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on customer reviews
            </p>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thank you for choosing us! We're committed to providing the best shopping experience.
          </p>
          
          <Button
            onClick={() => setIsVisible(false)}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
} 
