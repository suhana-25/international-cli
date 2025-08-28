'use client'
import Image from 'next/image'
import * as React from 'react'
import { cn } from '@/lib/utils'


export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = React.useState(0)

  return (
    <div className="space-y-4">
      <div className="relative min-h-[300px] overflow-hidden rounded-lg">
        <Image
          src={images[current]}
          alt="product image"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              'border-2 rounded-lg cursor-pointer hover:border-orange-600 transition-colors flex-shrink-0',
              current === index ? 'border-orange-500' : 'border-gray-200'
            )}
            onClick={() => setCurrent(index)}
          >
            <Image 
              src={image} 
              alt={`product image ${index + 1}`} 
              width={80} 
              height={80}
              className="rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
