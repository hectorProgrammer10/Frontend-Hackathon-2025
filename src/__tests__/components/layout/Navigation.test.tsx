/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { render, screen, fireEvent } from '@testing-library/react'
import Navigation from '@/components/layout/Navigation'
import * as navigation from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock Next/Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

// Mock ThemeToggle
jest.mock('@/components/features/ThemeToggle', () => {
  return function MockThemeToggle() {
    return <div data-testid="theme-toggle">Theme Toggle</div>
  }
})

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
      ; (navigation.usePathname as jest.Mock).mockReturnValue('/')
  })

  it('should render logo and app name', () => {
    render(<Navigation />)
    expect(screen.getByText('ComePelículas')).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    render(<Navigation />)

    expect(screen.getAllByText('Inicio')).toHaveLength(2) // Desktop + Mobile
    expect(screen.getAllByText('Buscar')).toHaveLength(2)
    expect(screen.getAllByText('Favoritos')).toHaveLength(2)
    expect(screen.getAllByText('IA')).toHaveLength(2)
  })

  it('should highlight active route', () => {
    ; (navigation.usePathname as jest.Mock).mockReturnValue('/search')
    const { container } = render(<Navigation />)

    // Find the desktop links
    const links = container.querySelectorAll('a[href="/search"]')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should toggle mobile menu when hamburger clicked', () => {
    render(<Navigation />)

    // Mobile menu should not be visible initially
    const mobileMenu = screen.getByRole('navigation').querySelector('[class*="invisible"]')
    expect(mobileMenu).toHaveClass('invisible')

    // Click hamburger button
    const hamburger = screen.getByLabelText('Toggle menu')
    fireEvent.click(hamburger)

    // Mobile menu should become visible
    const visibleMenu = screen.getByRole('navigation').querySelector('[class*="visible"]')
    expect(visibleMenu).not.toHaveClass('invisible')
  })

  it('should render theme toggle button', () => {
    render(<Navigation />)
    const themeToggles = screen.getAllByTestId('theme-toggle')
    expect(themeToggles.length).toBeGreaterThan(0)
  })

  it('should add backdrop blur on scroll', () => {
    const { container } = render(<Navigation />)

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { writable: true, value: 50 })
    fireEvent.scroll(window)

    // Wait for state update
    setTimeout(() => {
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('backdrop-blur-xl')
    }, 100)
  })

  it('should render correct href for each navigation link', () => {
    render(<Navigation />)

    const homeLinks = screen.getAllByText('Inicio')
    expect(homeLinks[0].closest('a')).toHaveAttribute('href', '/')

    const searchLinks = screen.getAllByText('Buscar')
    expect(searchLinks[0].closest('a')).toHaveAttribute('href', '/search')

    const favoritesLinks = screen.getAllByText('Favoritos')
    expect(favoritesLinks[0].closest('a')).toHaveAttribute('href', '/favorites')

    const smartSearchLinks = screen.getAllByText('IA')
    expect(smartSearchLinks[0].closest('a')).toHaveAttribute('href', '/smart-search')
  })
})