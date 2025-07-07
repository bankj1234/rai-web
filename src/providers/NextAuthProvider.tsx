'use client'

import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

//import { usePathname, useRouter } from 'next/navigation'
//import { PUBLIC_PATHS, SIGNIN_PATH } from '@/constants/auth.constants'

type Props = Readonly<{
  children: React.ReactNode
}>

/*enum SESSION_STATUS {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
}*/

const AuthenticationGuard = ({ children }: { children: ReactNode }) => {
  // Comment for bypass login
  /*const { data: session, status } = useSession()
  const pathname = usePathname() as string
  const router = useRouter()

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) {
      return
    }

    if (
      status !== SESSION_STATUS.LOADING &&
      (status === SESSION_STATUS.UNAUTHENTICATED ||
        !session ||
        Object.keys(session).length === 0)
    ) {
      router.push(SIGNIN_PATH)
    }
  }, [session, status, router, pathname])
  */
  return children
}

const NextAuthProvider = ({ children }: Props) => (
  <SessionProvider>
    <AuthenticationGuard>{children}</AuthenticationGuard>
  </SessionProvider>
)

export default NextAuthProvider
