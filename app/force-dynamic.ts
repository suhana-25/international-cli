// Force all pages to be dynamic - no static generation
// This file exports dynamic config that can be imported by all pages

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
