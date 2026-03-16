import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

jest.mock('@/constants/colors', () => ({
  colors: {
    primary: { 500: '#500' },
    gray: { 600: '#600', 900: '#900' },
    white: '#fff',
    background: '#f7f9fc',
    danger: '#ef4444',
    dangerBg: '#fee2e2',
  },
}));

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <Text>Child content</Text>;
}

// Suppress console.error for expected errors in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Une erreur est survenue')).toBeTruthy();
    expect(screen.getByText("L'application a rencontre un probleme inattendu.")).toBeTruthy();
    expect(screen.getByText('Reessayer')).toBeTruthy();
  });

  it('shows error message in dev mode', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test error message')).toBeTruthy();
  });

  it('resets and re-renders children when Reessayer is pressed', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Une erreur est survenue')).toBeTruthy();

    // Rerender with non-throwing child before pressing reset
    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>,
    );

    fireEvent.press(screen.getByText('Reessayer'));

    expect(screen.getByText('Child content')).toBeTruthy();
    expect(screen.queryByText('Une erreur est survenue')).toBeNull();
  });

  it('has correct accessibility on reset button', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>,
    );

    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Reessayer');
    expect(button.props.accessibilityHint).toBe('Double-tapez pour recharger la page');
  });
});
