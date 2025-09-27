import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CompatibilityBadge } from '../CompatibilityBadge';

describe('CompatibilityBadge', () => {
  it('should render with correct score', () => {
    render(<CompatibilityBadge score={85} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should show correct label for high score', () => {
    render(<CompatibilityBadge score={90} />);
    expect(screen.getByText('Perfect Match')).toBeInTheDocument();
  });

  it('should show correct label for medium score', () => {
    render(<CompatibilityBadge score={70} />);
    expect(screen.getByText('Good Match')).toBeInTheDocument();
  });

  it('should show correct label for low score', () => {
    render(<CompatibilityBadge score={30} />);
    expect(screen.getByText('Low Match')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<CompatibilityBadge score={85} size="sm" />);
    expect(screen.getByText('85%')).toBeInTheDocument();

    rerender(<CompatibilityBadge score={85} size="lg" />);
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should hide percentage when showPercentage is false', () => {
    render(<CompatibilityBadge score={85} showPercentage={false} />);
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.queryByText('85%')).not.toBeInTheDocument();
  });
});
