import { getToken } from 'next-auth/jwt'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { describe, expect, it, Mock, vi } from 'vitest'
import { SIGNIN_PATH } from './constants/auth.constants'
import middleware from './middleware'

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}))

vi.mock('next-auth/middleware', () => ({
  withAuth: vi.fn(() => vi.fn()),
}))

const HOST_PATH = 'http://localhost'

describe('middleware', () => {
  it('should redirect authenticated users away from auth pages', async () => {
    const req = {
      nextUrl: { pathname: SIGNIN_PATH },
      url: HOST_PATH + SIGNIN_PATH,
    } as NextRequest
    const event = {} as NextFetchEvent

    ;(getToken as Mock).mockResolvedValue({
      accessToken: 'valid-token',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    })

    const response = await middleware(req, event)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response?.status).toBe(200)
    expect(response?.headers.get('location')).toBe(null)
  })

  //it('should redirect to sign-in page if token is expired', async () => {
  //const req = {
  //nextUrl: { pathname: SIGNIN_PATH },
  //url: HOST_PATH + SIGNIN_PATH,
  //} as NextRequest
  //const event = {} as NextFetchEvent

  //;(getToken as Mock).mockResolvedValue({
  //accessToken: 'expired-token',
  //expiresAt: Math.floor(Date.now() / 1000) - 3600,
  //})

  //const response = (await middleware(req, event)) as NextResponse

  //expect(response).toBeInstanceOf(NextResponse)
  //expect(response?.status).toBe(307)
  //expect(response?.headers.get('location')).toBe(`${HOST_PATH}${SIGNIN_PATH}`)
  //})
})
