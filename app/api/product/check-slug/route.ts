import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import db from '@/db/drizzle'
import { products } from '@/db/schema'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ exists: false, error: 'Slug parameter is required' })
    }

    const existingProduct = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    })

    return NextResponse.json({ exists: !!existingProduct })
  } catch (error) {
    console.error('Error checking slug:', error)
    return NextResponse.json({ exists: false, error: 'Failed to check slug' })
  }
} 

