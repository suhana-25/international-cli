'use client'

import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data || [])
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* 1. SHOP */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-900">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/catalog" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Collection</Link></li>
              <li><Link href="/catalog" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Categories</Link></li>
              <li><Link href="/new-carving" className="text-gray-900 hover:text-blue-600 text-sm font-medium">New Carving</Link></li>
            </ul>
          </div>

          {/* 2. SERVICES */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-900">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping-delivery" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Shipping | Delivery</Link></li>
              <li><Link href="/payment-policy" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Payment & Policy</Link></li>
              <li><Link href="/track-order" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Track Order</Link></li>
              <li><Link href="/terms" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Return/Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* 3. QUICK LINKS */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-900 hover:text-blue-600 text-sm font-medium">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Contact Us</Link></li>
              <li><Link href="/customer-order" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Customer Order</Link></li>
              <li><Link href="/blogs" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Blog</Link></li>
              <li><Link href="/gallery" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Gallery</Link></li>
              <li><Link href="/stores" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Stores</Link></li>
              <li><Link href="/services" className="text-gray-900 hover:text-blue-600 text-sm font-medium">Services</Link></li>
            </ul>
          </div>

          {/* 4. COMPANY LOGO & SOCIAL */}
          <div>
            {/* Company Logo */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{APP_NAME}</h3>
              <p className="text-sm text-gray-700">Art Statues & Handicrafts</p>
            </div>
            
            {/* Social Media Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Follow Us On</h4>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/n_i_t_e_s_v_e_r_m_a?igsh=aGw0dWRrYWNqbXl4" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/1EnESzNmzP/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-900 text-sm font-medium">© 2024 {APP_NAME}. All rights reserved.</p>
          
          {/* Payment Icons */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-gray-900 text-xs font-medium">We Accept:</span>
            <div className="flex space-x-2">
              <div className="w-12 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">PayPal</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
