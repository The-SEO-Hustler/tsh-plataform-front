// middleware.ts
import { NextResponse } from 'next/server'

export function middleware() {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // If it’s not the homepage, but _does_ end with a slash,
  // redirect to the same path without that trailing slash.
  if (pathname !== '/' && pathname.endsWith('/')) {
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 308)  // or 301 if you prefer
  }

  // otherwise leave it alone (homepage stays with slash)
  return NextResponse.next()
}

// apply to all non‐static routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
