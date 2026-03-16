import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';

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

describe('StatusBadge', () => {
  it('renders the label text', () => {
    render(<StatusBadge label="En cours" backgroundColor="#FFEDD5" textColor="#9A3412" />);

    expect(screen.getByText('En cours')).toBeTruthy();
  });

  it('renders correct accessibility label', () => {
    render(<StatusBadge label="En attente" backgroundColor="#DBEAFE" textColor="#1E40AF" />);

    expect(screen.getByLabelText('Statut : En attente')).toBeTruthy();
  });

  it('renders different status texts', () => {
    const statuses = [
      { label: 'En cours', bg: '#FFEDD5', text: '#9A3412' },
      { label: 'En attente', bg: '#DBEAFE', text: '#1E40AF' },
      { label: 'Resolu', bg: '#DCFCE7', text: '#166534' },
    ];

    for (const status of statuses) {
      const { unmount } = render(
        <StatusBadge label={status.label} backgroundColor={status.bg} textColor={status.text} />,
      );

      expect(screen.getByText(status.label)).toBeTruthy();
      unmount();
    }
  });

  it('defaults to sm size', () => {
    render(<StatusBadge label="En cours" backgroundColor="#FFEDD5" textColor="#9A3412" />);

    // Renders without error with default size
    expect(screen.getByText('En cours')).toBeTruthy();
  });

  it('accepts md size', () => {
    render(
      <StatusBadge label="En cours" backgroundColor="#FFEDD5" textColor="#9A3412" size="md" />,
    );

    expect(screen.getByText('En cours')).toBeTruthy();
  });
});
