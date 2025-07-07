import { LoginResponse, NextAuthUserToken, UserInfo } from '@/types/next-auth'
import {
  AuthApiEndpoints,
  AuthProvider,
  TOKEN_LIFETIME,
  UsersApiEndpoints,
} from '@/constants/auth.constants'
import { generateAuthorization } from '@/services/api.services'
import axiosInstance from '@/services/api.services'

// TODO: token expiration need to be calculated from account token
const createTokenExpiry = (): number => {
  return Math.floor(Date.now() / 1000) + TOKEN_LIFETIME
}

export const authHandlers = {
  async handleSignIn(params: {
    userName?: string
    password?: string
    provider?: AuthProvider
    accessToken?: string
  }): Promise<LoginResponse> {
    const loginResponse = await axiosInstance.post<LoginResponse>(
      AuthApiEndpoints.LOGIN,
      {
        ...params,
      }
    )

    const userInfo = await axiosInstance.get<UserInfo>(UsersApiEndpoints.ME, {
      headers: {
        Authorization: generateAuthorization(loginResponse.data.accessToken),
      },
    })

    return {
      ...loginResponse.data,
      user: userInfo.data as UserInfo,
    }
  },

  async refreshAccessToken(token: Partial<NextAuthUserToken>): Promise<any> {
    try {
      const response = await axiosInstance.get<any>(AuthApiEndpoints.REFRESH_TOKEN, {
        headers: {
          Authorization: generateAuthorization(token.refreshToken as string),
        },
      })

      const refreshedTokens = response.data
      if (!response.data?.accessToken) {
        throw new Error(response.data?.error || 'Failed to refresh access token')
      }

      return {
        ...token,
        accessToken: refreshedTokens.accessToken,
        refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
        expiresAt: createTokenExpiry(),
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Exception: ${error.message}`)
      } else {
        throw new Error('Exception: An unknown error occurred')
      }
    }
  },

  createUserToken(token: Partial<NextAuthUserToken>, account: any): NextAuthUserToken {
    if (!account) {
      return token as NextAuthUserToken
    }

    return {
      ...token,
      user: account.user as UserInfo,
      accessToken: account.internalAccessToken as string,
      refreshToken: account.internalRefreshToken as string,
      expiresAt: createTokenExpiry(),
    }
  },
}
