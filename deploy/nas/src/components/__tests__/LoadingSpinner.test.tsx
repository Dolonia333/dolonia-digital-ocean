import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest' 
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const { getByText } = render(<LoadingSpinner />)
    expect(getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    const { getByText } = render(<LoadingSpinner text="Custom loading text" />)
    expect(getByText('Custom loading text')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender, getByTestId } = render(<LoadingSpinner size="sm" />)
    const spinner = getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
    
    rerender(<LoadingSpinner size="lg" />)
    expect(spinner).toBeInTheDocument()
  })

  it('renders without text when text is empty', () => {
    const { queryByText } = render(<LoadingSpinner text="" />)
    expect(queryByText('Loading...')).not.toBeInTheDocument()
  })
})