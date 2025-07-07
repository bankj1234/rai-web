import CredentialsProvider from 'next-auth/providers/credentials'
import { authHandlers } from '../authHandlers'

export const configureCredentialsProvider = () => {
  return CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials) {
        console.error('Missing credentials')
        return null
      }
      try {
        const data = await authHandlers.handleSignIn({
          userName: credentials.username,
          password: credentials.password,
        })

        return {
          ...data.user,
          internalAccessToken: data.accessToken,
          internalRefreshToken: data.refreshToken,
        }
      } catch (error) {
        console.error('Credentials Login Error:', error)
        return null
      }
    },
  })
}
