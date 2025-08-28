'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  Check
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  slug: string
}

interface ShareButtonProps {
  product: Product
  className?: string
}

export default function ShareButton({ product, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Get current URL
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://yourstore.com/product/${product.slug}`

  const shareData = {
    title: product.name,
    text: `Check out this amazing product: ${product.name} - $${product.price.toFixed(2)}`,
    url: currentUrl,
  }

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast({
          description: "Shared successfully!",
          className: "bg-slate-800 border-slate-700 text-slate-200",
        })
      } catch (error) {
        // User cancelled share - don't show error
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copy URL
      handleCopyLink()
    }
  }

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast({
        description: "Link copied to clipboard!",
        className: "bg-slate-800 border-slate-700 text-slate-200",
      })
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      setCopied(true)
      toast({
        description: "Link copied to clipboard!",
        className: "bg-slate-800 border-slate-700 text-slate-200",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Social media sharing
  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareData.text}\n${currentUrl}`)
    const url = `https://twitter.com/intent/tweet?text=${text}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareData.text}\n${currentUrl}`)
    const url = `https://wa.me/?text=${text}`
    window.open(url, '_blank')
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out: ${product.name}`)
    const body = encodeURIComponent(`${shareData.text}\n\n${currentUrl}`)
    const url = `mailto:?subject=${subject}&body=${body}`
    window.location.href = url
  }

  // Check if native share is available (mobile devices)
  const hasNativeShare = typeof navigator !== 'undefined' && navigator.share

  return (
    <div className={className}>
      {/* Mobile: Use native share if available, else dropdown */}
      {hasNativeShare ? (
        <Button
          variant="ghost"
          onClick={handleNativeShare}
          className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      ) : (
        /* Desktop: Dropdown with share options */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-slate-900 border-slate-700"
          >
            {/* Copy Link */}
            <DropdownMenuItem 
              onClick={handleCopyLink}
              className="focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  <span>Copy Link</span>
                </>
              )}
            </DropdownMenuItem>

            {/* Facebook */}
            <DropdownMenuItem 
              onClick={handleFacebookShare}
              className="focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
            >
              <Facebook className="h-4 w-4 mr-2" />
              <span>Facebook</span>
            </DropdownMenuItem>

            {/* Twitter */}
            <DropdownMenuItem 
              onClick={handleTwitterShare}
              className="focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
            >
              <Twitter className="h-4 w-4 mr-2" />
              <span>Twitter</span>
            </DropdownMenuItem>

            {/* WhatsApp */}
            <DropdownMenuItem 
              onClick={handleWhatsAppShare}
              className="focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>WhatsApp</span>
            </DropdownMenuItem>

            {/* Email */}
            <DropdownMenuItem 
              onClick={handleEmailShare}
              className="focus:bg-slate-800 focus:text-slate-100 cursor-pointer"
            >
              <Mail className="h-4 w-4 mr-2" />
              <span>Email</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
