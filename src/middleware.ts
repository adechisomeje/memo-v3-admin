import { NextResponse } from 'next/server'
import { auth } from './auth'
import { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const isAuthenticated = !!session

  const { pathname } = request.nextUrl

  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    // Redirect to the login page (root page in this case)
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // Continue with the request if authenticated or accessing public paths
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files (files with extensions like .jpg, .png, etc.)
     * - API routes that don't require authentication
     */
    '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
  ],
}
