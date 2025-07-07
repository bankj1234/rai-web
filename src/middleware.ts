//import { getToken } from 'next-auth/jwt'
//import { withAuth } from 'next-auth/middleware'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

//import { PUBLIC_PATHS, SIGNIN_PATH } from './constants/auth.constants'

//const unauthenicatedPaths: string[] = [SIGNIN_PATH]

//const authMiddleware = withAuth({
//callbacks: {
//authorized: ({ req, token }) => {
//if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
//return true
//}

//if (!token?.accessToken) return false

//const tokenExpiry = token.expiresAt as number
//const currentTime = Math.floor(Date.now() / 1000)

//return tokenExpiry > currentTime
//},
//},
//pages: {
//signIn: SIGNIN_PATH,
//},
//})

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  console.info('Middleware triggered for:', req.nextUrl.pathname, event)
  // Uncomment the following lines to enable authentication checks
  /*const token = await getToken({ req })
  const pathname = req.nextUrl.pathname

  // Check both token existence and expiration
  const tokenExpiry = token?.expiresAt as number
  const currentTime = Math.floor(Date.now() / 1000)
  const isTokenExpired = tokenExpiry ? currentTime >= tokenExpiry : true
  const isAuthenticated = !!token?.accessToken && !isTokenExpired

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && unauthenicatedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (token?.accessToken && isTokenExpired) {
    const response = NextResponse.redirect(new URL(SIGNIN_PATH, req.url))
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.callback-url')
    response.cookies.delete('next-auth.csrf-token')
    return response
  }

  // @ts-expect-error
  return authMiddleware(req, event)*/
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
}
