import { Suspense } from 'react'
import CartForm from './cart-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { APP_NAME } from '@/lib/constants'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: `Shopping Cart - ${APP_NAME}`,
}

export default function CartPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CartForm />
    </Suspense>
  )
}
