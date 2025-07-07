export const TOKEN_LIFETIME = 60 // seconds
export const TOKEN_LIFETIME_BUFFER = 10 // seconds

export const SIGNIN_PATH = '/signin'

export const PUBLIC_PATHS: string[] = ['/sample-page']

export const AUTH_ERROR_CODE = {
  DefaultError: 'auth_default_error',
  UserNotExist: 'User not exists',
} as const

export enum AUTH_ERROR_CODE_MESSAGE {
  DefaultError = 'Could you please double-check your email? We might need to sort something out there.',
  UserNotExist = 'It seems like this user does not exist. Please check your email and try again.',
}

export enum AuthApiEndpoints {
  LOGIN = '/api/v1/auth/login',
  REFRESH_TOKEN = '/api/v1/auth/refresh-token',
  LOGOUT = '/api/v1/auth/logout',
}

export enum UsersApiEndpoints {
  ME = '/api/v1/users/me',
}

export enum AuthProvider {
  AzureAD = 'AzureAD',
  Cognito = 'Cognito',
}
