import { render, screen } from '@testing-library/react';
import { Loading } from '../Loading';

describe('Loading', () => {
  it('renders with default props', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loading text="Custom loading text" />);
    expect(screen.getByText('Custom loading text')).toBeInTheDocument();
  });

  it('applies fullScreen class when fullScreen prop is true', () => {
    render(<Loading fullScreen />);
    const container = screen.getByTestId('loading-container');
    expect(container).toHaveClass('fixed');
  });
}); 