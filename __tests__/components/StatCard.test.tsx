import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StatCard } from '@/components/ui/StatCard';

jest.mock('tamagui', () => {
  const { View, Text } = require('react-native');

  const TamaguiView = (props: Record<string, unknown>) => {
    const { children, accessibilityLabel, ...rest } = props;
    return (
      <View accessibilityLabel={accessibilityLabel as string} {...rest}>
        {children as React.ReactNode}
      </View>
    );
  };

  const TamaguiText = (props: Record<string, unknown>) => {
    const { children, ...rest } = props;
    return <Text {...rest}>{children as React.ReactNode}</Text>;
  };

  return { View: TamaguiView, Text: TamaguiText };
});

jest.mock('@/constants/colors', () => ({
  colors: {
    primary: { 500: '#0A7968' },
    gray: { 500: '#ADB5BD' },
    white: '#fff',
  },
}));

describe('StatCard', () => {
  it('renders value and label', () => {
    render(<StatCard value="T3" label="Appartement" />);

    expect(screen.getByText('T3')).toBeTruthy();
    expect(screen.getByText('Appartement')).toBeTruthy();
  });

  it('has correct accessibility label combining label and value', () => {
    render(<StatCard value="3eme" label="Etage" />);

    expect(screen.getByLabelText('Etage : 3eme')).toBeTruthy();
  });

  it('renders with different values', () => {
    render(<StatCard value="2 ans" label="Anciennete" />);

    expect(screen.getByText('2 ans')).toBeTruthy();
    expect(screen.getByText('Anciennete')).toBeTruthy();
  });

  it('accepts custom valueColor prop', () => {
    render(<StatCard value="2 ans" label="Anciennete" valueColor="#22C55E" />);

    // Component renders without error with custom color
    expect(screen.getByText('2 ans')).toBeTruthy();
  });
});
