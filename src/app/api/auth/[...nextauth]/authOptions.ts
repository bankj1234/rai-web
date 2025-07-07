import { AuthOptions, Session } from 'next-auth'
import { NextAuthUserToken, UserInfo } from '@/types/next-auth'
import {
  AuthProvider,
  SIGNIN_PATH,
  TOKEN_LIFETIME,
  TOKEN_LIFETIME_BUFFER,
} from '@/constants/auth.constants'
import { authHandlers } from './authHandlers'
import { AZURE_CONFIG, configureAzureProvider } from './provider/AzureProviderConfig'
import { configureCredentialsProvider } from './provider/CredentialsProviderConfig'

const authOptions: AuthOptions = {
  pages: {
    signIn: SIGNIN_PATH,
    error: SIGNIN_PATH,
  },

  session: {
    strategy: 'jwt',
    maxAge: TOKEN_LIFETIME + TOKEN_LIFETIME_BUFFER,
  },

  jwt: {
    maxAge: TOKEN_LIFETIME + TOKEN_LIFETIME_BUFFER,
  },

  providers: [configureAzureProvider(AZURE_CONFIG), configureCredentialsProvider()],

  callbacks: {
    /**
     * This callback is called whenever a sign-in attempt is made.
     * It is used to control if a user should be allowed to sign in.
     * This function is called after the user submits their login details.
     * It returns true to proceed or false to deny the authentication.
     */
    async signIn({ account, user }) {
      try {
        if (account?.provider === 'credentials') {
          const { internalAccessToken, internalRefreshToken, ...restUser } = user as any

          if (!internalAccessToken) {
            console.error('Missing internal access token for credentials provider')
            return false
          }
          account.user = restUser
          account.internalAccessToken = internalAccessToken
          account.internalRefreshToken = internalRefreshToken
          return true
        } else if (account?.provider === 'azure-ad') {
          if (!account?.access_token) {
            console.error('Missing access token for Azure AD provider')
            return false
          }

          try {
            const data = await authHandlers.handleSignIn({
              provider: AuthProvider.AzureAD,
              accessToken: account.access_token,
            })

            account.user = data.user
            account.internalAccessToken = data.accessToken
            account.internalRefreshToken = data.refreshToken

            return true
          } catch (azureError) {
            console.error('Azure AD sign-in error:', azureError)
            return false
          }
        }
        return false
      } catch (error) {
        console.error('Sign-in callback error:', error)
        return false
      }
    },

    async jwt({ token, account, trigger }): Promise<NextAuthUserToken> {
      // Prevent token refresh during the "update" trigger
      if (trigger === 'update') {
        return token as NextAuthUserToken
      }

      const tokenObject = authHandlers.createUserToken(token, account)

      const currentTime = Date.now() / 1000 // Convert to seconds
      if (tokenObject.expiresAt && currentTime < tokenObject.expiresAt) {
        return tokenObject
      }

      // Access token has expired, try to refresh it
      const refreshedToken = await authHandlers.refreshAccessToken(tokenObject)
      return refreshedToken
    },

    async session({ session, token }): Promise<Session> {
      session.user = token.user as UserInfo
      session.accessToken = String(token.accessToken)
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
}

export default authOptions
