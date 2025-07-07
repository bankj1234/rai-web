import { AuthApiEndpoints, SIGNIN_PATH } from '@/constants/auth.constants'
import axiosInstance from './api.services'

export const signout = async (
  nextAuthSignOut: (arg0: { callbackUrl: string; redirect: boolean }) => any
) => {
  try {
    await axiosInstance.get(AuthApiEndpoints.LOGOUT)
  } catch (error) {
    console.error(error as Error)
  } finally {
    await nextAuthSignOut({ callbackUrl: SIGNIN_PATH, redirect: true })
    window.location.href = SIGNIN_PATH
  }
}
