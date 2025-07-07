import React from 'react'
import { usePathname } from 'next/navigation'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
//import { SIGNIN_PATH } from '@/constants/auth.constants'
import RootTemplate from './template'

vi.mock('@/components/header/HeaderBar', () => ({
  default: () => <div>Header Bar</div>,
}))

describe('RootTemplate', () => {
  it('renders the layout with children when not on login page', () => {
    vi.mocked(usePathname).mockReturnValue('/test')

    render(
      <RootTemplate>
        <div data-testid="child-content">Child Content</div>
      </RootTemplate>
    )

    //expect(screen.getByText('Header Bar')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  //it('renders only children on login page', () => {
  //vi.mocked(usePathname).mockReturnValue(SIGNIN_PATH)

  //render(
  //<RootTemplate>
  //<div data-testid="login-content">Login Content</div>
  //</RootTemplate>
  //)

  //expect(screen.queryByText('Header Bar')).not.toBeInTheDocument()
  //expect(screen.getByTestId('login-content')).toBeInTheDocument()
  //})

  //it('renders the correct header label', () => {
  //vi.mocked(usePathname).mockReturnValue('/test')

  //render(
  //<RootTemplate>
  //<div data-testid="child-content">Child Content</div>
  //</RootTemplate>
  //)

  //expect(screen.getByText('Header Bar')).toBeInTheDocument()
  //})
})
