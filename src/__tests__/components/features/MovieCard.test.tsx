/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { render, screen } from '@testing-library/react'
import MovieCard from '@/components/features/MovieCard'
import { Movie } from '@/types'
import * as hooks from '@/lib/hooks'

// Mock the hooks
jest.mock('@/lib/hooks', () => ({
  useFavorites: jest.fn(),
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-fill={fill} {...props} />
  },
}))

describe('MovieCard', () => {
  const mockMovie: Movie = {
    Title: 'Test Movie',
    Year: '2023',
    imdbID: 'tt1234567',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
  }

  const mockToggleFavorite = jest.fn()
  const mockIsFavorite = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
      ; (hooks.useFavorites as jest.Mock).mockReturnValue({
        favorites: [],
        toggleFavorite: mockToggleFavorite,
        isFavorite: mockIsFavorite,
        refreshFavorites: jest.fn(),
      })
    mockIsFavorite.mockReturnValue(false)
  })

  it('should render without crashing', () => {
    render(<MovieCard movie={mockMovie} variant="grid" />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })
})