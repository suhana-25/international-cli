import CartForm from './cart-form'
import { APP_NAME } from '@/lib/constants'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata = {
  title: `Shopping Cart - ${APP_NAME}`,
}

export default function CartPage() {
  return <CartForm />
}
