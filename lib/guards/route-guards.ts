// import { auth } from '@/lib/auth' // Removed - using custom auth
import { redirect } from 'next/navigation'
import { getUserById } from '@/lib/actions/user.actions'

export async function checkAuthGuard() {
  // const session = await auth() // Skip auth check - using custom auth
  // if (!session?.user?.id) {
  //   redirect('/auth/sign-in')
  // }
  // return session
  return null // Skip auth guard for now
}

export async function checkShippingAddressGuard() {
  const session = await checkAuthGuard()
  
  // Skip guard checks for now - using custom auth
  return { session: null, user: null, address: null }
}

export async function checkPaymentMethodGuard() {
  const { session, user } = await checkShippingAddressGuard()
  
  // Skip guard checks for now - using custom auth
  return { session: null, user: null }
}

export async function checkPlaceOrderGuard() {
  const { session, user } = await checkPaymentMethodGuard()
  
  // Skip guard checks for now - using custom auth
  return { session: null, user: null }
} 
