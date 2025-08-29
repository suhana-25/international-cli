import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = {
  '/shipping-address': { requiresAuth: true, allowedRoles: ['user'] },
  // '/payment-method': { requiresAuth: true, allowedRoles: ['user'] }, // Removed - using WhatsApp orders
  '/place-order': { requiresAuth: true, allowedRoles: ['user'] },
  '/payment': { requiresAuth: true, allowedRoles: ['user'] },
  '/user/profile': { requiresAuth: true, allowedRoles: ['user'] },
  '/user/orders': { requiresAuth: true, allowedRoles: ['user'] },
  '/admin': { requiresAuth: true, allowedRoles: ['admin'] }
}

const adminRoutes = ['/admin']
const userRoutes = ['/shipping-address', '/place-order', '/payment', '/user']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Simple session check using localStorage (client-side only)
  // For now, allow all routes since we're using client-side auth
  const session = null

  // Check if the route requires protection
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route))

  // Skip auth checks for now - using custom auth system
  // if (isProtectedRoute && !session?.user && pathname !== '/shipping-address') {
  //   const signInUrl = new URL('/auth/sign-in', request.url)
  //   signInUrl.searchParams.set('callbackUrl', pathname)
  //   return NextResponse.redirect(signInUrl)
  // }

  // Skip role-based access checks for now - using custom auth system
  // if (session?.user) {
  //   const userRole = session.user.role
  //   // Admin route protection
  //   if (isAdminRoute && userRole !== 'admin') {
  //     return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  //   }
  //   // User route protection (prevent admin from accessing user checkout)
  //   if (isUserRoute && userRole === 'admin') {
  //     return NextResponse.redirect(new URL('/admin', request.url))
  //   }
  // }

  // Skip checkout flow validation for now - using custom auth system
  // if (session?.user && userRoutes.some(route => pathname.startsWith(route))) {
  //   // Add custom headers for checkout validation
  //   const response = NextResponse.next()
  //   response.headers.set('x-user-id', session.user.id || '')
  //   response.headers.set('x-user-role', session.user.role || 'user')
  //   return response
  // }

  // Force dynamic rendering for all routes
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.set('x-nextjs-cache', 'SKIP')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}