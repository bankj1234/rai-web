// types/next-auth.d.ts
import * as _NextAuth from 'next-auth'
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
    accessToken: string
  }
}
export interface UserInfo extends DefaultUser {
  id: string
  fullName: string
  email: string
  roles: string[]
}

export interface LoginResponse {
  user: UserInfo
  accessToken: string
  refreshToken: string
}

export interface NextAuthUserToken extends JWT {
  user: UserInfo | null
  accessToken: string | undefined
  refreshToken: string | undefined
  expiresAt: number | undefined
}
