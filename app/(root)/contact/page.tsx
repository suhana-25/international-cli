import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { APP_NAME } from '@/lib/constants'
import ContactPageClient from './contact-page-client'

export const metadata: Metadata = {
  title: `Contact Us - ${APP_NAME}`,
  description: 'Get in touch with us for any questions about our products, orders, or collaboration opportunities. We\'re here to help you every step of the way.',
  keywords: 'contact us, customer support, inquiry, phone, email, address, social media',
  openGraph: {
    title: `Contact Us - ${APP_NAME}`,
    description: 'Get in touch with us for any questions about our products, orders, or collaboration opportunities.',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
} 
