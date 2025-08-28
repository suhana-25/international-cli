import db from '@/db/drizzle'
import { categories } from '@/db/schema'
import HeaderClient from './header-client'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default async function Header({ isSignedIn, session }: { isSignedIn: boolean; session?: any }) {
  let initialCategories: Category[] = []
  
  try {
    // Use category store instead of direct DB call for speed
    const { getCategories } = await import('@/lib/category-store')
    initialCategories = getCategories()
  } catch (error) {
    console.error('Error fetching categories in header:', error)
    // Fallback to empty array
    initialCategories = []
  }

  return <HeaderClient isSignedIn={isSignedIn} initialCategories={initialCategories} session={session} />
}
