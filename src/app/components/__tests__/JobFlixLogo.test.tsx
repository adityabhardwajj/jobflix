import { render, screen } from '@testing-library/react'
import JobFlixLogo, { JobFlixLogoHeader, JobFlixLogoFooter } from '../JobFlixLogo'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('JobFlixLogo', () => {
  it('renders with default props', () => {
    render(<JobFlixLogo />)
    
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('Flix')).toBeInTheDocument()
  })

  it('renders without text when showText is false', () => {
    render(<JobFlixLogo showText={false} />)
    
    expect(screen.queryByText('Job')).not.toBeInTheDocument()
    expect(screen.queryByText('Flix')).not.toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<JobFlixLogo size="sm" />)
    expect(screen.getByText('Job')).toBeInTheDocument()
    
    rerender(<JobFlixLogo size="lg" />)
    expect(screen.getByText('Job')).toBeInTheDocument()
    
    rerender(<JobFlixLogo size="xl" />)
    expect(screen.getByText('Job')).toBeInTheDocument()
  })

  it('renders different variants', () => {
    const { rerender } = render(<JobFlixLogo variant="default" />)
    expect(screen.getByText('Job')).toBeInTheDocument()
    
    rerender(<JobFlixLogo variant="minimal" />)
    expect(screen.getByText('Job')).toBeInTheDocument()
    
    rerender(<JobFlixLogo variant="play" />)
    expect(screen.getByText('Job')).toBeInTheDocument()
  })

  it('renders icon-only variant correctly', () => {
    render(<JobFlixLogo variant="icon-only" />)
    
    expect(screen.queryByText('Job')).not.toBeInTheDocument()
    expect(screen.queryByText('Flix')).not.toBeInTheDocument()
  })

  it('renders text-only variant correctly', () => {
    render(<JobFlixLogo variant="text-only" />)
    
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('Flix')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<JobFlixLogo className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('JobFlixLogoHeader', () => {
  it('renders with header-specific props', () => {
    render(<JobFlixLogoHeader />)
    
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('Flix')).toBeInTheDocument()
  })
})

describe('JobFlixLogoFooter', () => {
  it('renders with footer-specific props', () => {
    render(<JobFlixLogoFooter />)
    
    expect(screen.getByText('Job')).toBeInTheDocument()
    expect(screen.getByText('Flix')).toBeInTheDocument()
  })
})
