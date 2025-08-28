import { Suspense } from 'react'
import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import TermsPageClient from './terms-page-client'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: `Terms & Conditions - ${APP_NAME}`,
  description: 'Terms and conditions for all customers of Nitesh Handicraft. Read our policies, rules, and conditions before placing an order.',
  keywords: 'terms and conditions, policies, rules, customer agreement, nitesh handicraft',
  openGraph: {
    title: `Terms & Conditions - ${APP_NAME}`,
    description: 'Terms and conditions for all customers of Nitesh Handicraft.',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TermsPageClient />
    </Suspense>
  )
}
