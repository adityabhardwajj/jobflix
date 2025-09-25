import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginModal from '../LoginModal'

describe('LoginModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('does not render when isOpen is false', () => {
    render(<LoginModal isOpen={false} onClose={mockOnClose} />)
    
    expect(screen.queryByText('Sign In to JobFlix')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText('Sign In to JobFlix')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    const closeButton = screen.getByLabelText('Close modal')
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('switches between email and phone login methods', async () => {
    const user = userEvent.setup()
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    // Default is email
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    
    // Switch to phone
    const phoneTab = screen.getByText('Phone')
    await user.click(phoneTab)
    
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    
    // Switch back to email
    const emailTab = screen.getByText('Email')
    await user.click(emailTab)
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
  })

  describe('Email Login Form', () => {
    it('validates email field', async () => {
      const user = userEvent.setup()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)
      
      const emailInput = screen.getByLabelText('Email Address')
      const submitButton = screen.getByText('Sign In')
      
      // Submit with invalid email
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      })
    })

    it('validates password field', async () => {
      const user = userEvent.setup()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)
      
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByText('Sign In')
      
      // Submit with valid email but short password
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
      })
    })

    it('toggles password visibility', async () => {
      const user = userEvent.setup()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)
      
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      expect(passwordInput.type).toBe('password')
      
      // Click eye icon to show password
      const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button
      await user.click(toggleButton)
      
      expect(passwordInput.type).toBe('text')
    })

    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)
      
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const submitButton = screen.getByText('Sign In')
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)
      
      // Should show loading state
      expect(screen.getByText('Signing In...')).toBeInTheDocument()
    })
  })

  describe('Phone Login Form', () => {
    beforeEach(async () => {
      const user = userEvent.setup()
      render(<LoginModal isOpen={true} onClose={mockOnClose} />)
      
      // Switch to phone tab
      const phoneTab = screen.getByText('Phone')
      await user.click(phoneTab)
    })

    it('validates phone number field', async () => {
      const user = userEvent.setup()
      
      const phoneInput = screen.getByLabelText('Phone Number')
      const submitButton = screen.getByText('Send Verification Code')
      
      // Submit with invalid phone
      await user.type(phoneInput, '123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid phone number format')).toBeInTheDocument()
      })
    })

    it('shows OTP field after sending code', async () => {
      const user = userEvent.setup()
      
      const phoneInput = screen.getByLabelText('Phone Number')
      const submitButton = screen.getByText('Send Verification Code')
      
      await user.type(phoneInput, '+1234567890')
      await user.click(submitButton)
      
      // Should show loading state first
      expect(screen.getByText('Sending Code...')).toBeInTheDocument()
      
      // After loading, should show OTP field
      await waitFor(() => {
        expect(screen.getByLabelText('Verification Code')).toBeInTheDocument()
        expect(screen.getByText('Verify & Sign In')).toBeInTheDocument()
      })
    })

    it('validates OTP field', async () => {
      const user = userEvent.setup()
      
      const phoneInput = screen.getByLabelText('Phone Number')
      let submitButton = screen.getByText('Send Verification Code')
      
      // First send the code
      await user.type(phoneInput, '+1234567890')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText('Verification Code')).toBeInTheDocument()
      })
      
      // Now try to submit with invalid OTP
      const otpInput = screen.getByLabelText('Verification Code')
      submitButton = screen.getByText('Verify & Sign In')
      
      await user.type(otpInput, '123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('OTP must be 6 digits')).toBeInTheDocument()
      })
    })
  })

  it('shows registration link', () => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />)
    
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText('Sign up here')).toBeInTheDocument()
  })
})
