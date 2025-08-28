import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter } from './core'
import { NextResponse } from 'next/server'

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

// Add CORS headers for preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-uploadthing-package, x-uploadthing-version',
    },
  })
}

