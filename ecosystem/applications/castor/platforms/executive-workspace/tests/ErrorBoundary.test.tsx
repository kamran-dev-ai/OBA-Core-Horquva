import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../src/components/shell/ErrorBoundary';

const ThrowingComponent: React.FC = () => {
  throw new Error('Test crash');
};

describe('ErrorBoundary', () => {
  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Safe content</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('renders a fallback UI when a child component throws', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackTitle="Custom error title">
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error title')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
