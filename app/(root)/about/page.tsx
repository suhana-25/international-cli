import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import AboutPageClient from './about-page-client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `About Us - ${APP_NAME}`,
  description: 'Learn about our mission, vision, and commitment to authentic handcrafted products. Discover our journey from humble beginnings to industry leadership.',
  keywords: 'about us, handicraft, mission, vision, company history, team, values',
  openGraph: {
    title: `About Us - ${APP_NAME}`,
    description: 'Learn about our mission, vision, and commitment to authentic handcrafted products.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
} 
