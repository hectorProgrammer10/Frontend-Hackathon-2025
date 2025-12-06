import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingSkeleton, ErrorMessage } from '@/components/ui/Loading'

describe('Loading Components', () => {
  describe('LoadingSpinner', () => {
    it('should render loading spinner', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('should have aria-label for accessibility', () => {
      render(<LoadingSpinner />)
      const spinner = screen.getByLabelText(/loading/i)
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('LoadingSkeleton', () => {
    it('should render default number of skeleton items', () => {
      const { container } = render(<LoadingSkeleton />)
      const skeletonItems = container.querySelectorAll('.animate-pulse')
      expect(skeletonItems.length).toBeGreaterThan(0)
    })

    it('should render specified number of skeleton items', () => {
      const count = 5
      const { container } = render(<LoadingSkeleton count={count} />)
      const skeletonItems = container.querySelectorAll('.animate-pulse')
      expect(skeletonItems.length).toBe(count)
    })
  })

  describe('ErrorMessage', () => {
    it('should render error message', () => {
      const errorText = 'Something went wrong'
      render(<ErrorMessage message={errorText} />)
      expect(screen.getByText(errorText)).toBeInTheDocument()
    })

    it('should have error role for accessibility', () => {
      render(<ErrorMessage message="Error" />)
      const errorElement = screen.getByRole('alert')
      expect(errorElement).toBeInTheDocument()
    })
  })
})
