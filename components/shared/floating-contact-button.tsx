'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

export default function FloatingContactButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: 'https://wa.me/919876543210?text=Hello, I am interested in your handicraft products.',
      bgColor: 'bg-green-500 hover:bg-green-600',
      ariaLabel: 'Contact us on WhatsApp'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      href: 'https://instagram.com/niteshhandicraft',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      ariaLabel: 'Follow us on Instagram'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Social Media Icons */}
      <div 
        className={`flex flex-col gap-3 mb-3 transition-all duration-500 ease-out ${
          isExpanded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        {socialLinks.map((social, index) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            className={`
              w-12 h-12 rounded-full shadow-lg flex items-center justify-center
              transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-xl
              ${social.bgColor} text-white
              animate-in slide-in-from-bottom-2 fade-in-0
            `}
            style={{
              animationDelay: `${index * 150}ms`,
              animationDuration: '300ms'
            }}
          >
            <social.icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Main Contact Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out
          ${isExpanded ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}
          transform hover:scale-105 hover:shadow-xl
          animate-in zoom-in-0
        `}
        aria-label={isExpanded ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-white transition-transform duration-200" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white transition-transform duration-200" />
        )}
      </Button>
    </div>
  )
} 
