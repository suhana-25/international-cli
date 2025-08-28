// import { auth } from '@/lib/auth' // Removed - using custom auth
import { redirect } from 'next/navigation'

export async function adminOnly() {
  // const session = await auth() // Skip auth check - using custom auth
  // if (!session?.user?.id) {
  //   redirect('/auth/sign-in?error=Please sign in to access admin panel')
  // }
  // if (session.user.role !== 'admin') {
  //   redirect('/auth/sign-in?error=Admin access required')
  // }
  // return session
  return null // Skip admin check for now
}

export async function userOnly() {
  // const session = await auth() // Skip auth check - using custom auth
  // if (!session?.user?.id) {
  //   redirect('/auth/sign-in?error=Please sign in to access this page')
  // }
  // return session
  return null // Skip user check for now
}

export async function getCurrentUser() {
  // const session = await auth() // Skip auth check - using custom auth
  // return session?.user
  return null // Skip get current user for now
}
