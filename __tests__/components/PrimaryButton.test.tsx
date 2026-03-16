import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

jest.mock('tamagui', () => {
  const { View, Text, TouchableOpacity } = require('react-native');

  const TamaguiView = (props: Record<string, unknown>) => {
    const {
      children,
      onPress,
      accessibilityRole,
      accessibilityLabel,
      accessibilityState,
      testID,
      ...rest
    } = props;
    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress as () => void}
          accessibilityRole={accessibilityRole as string}
          accessibilityLabel={accessibilityLabel as string}
          accessibilityState={accessibilityState as Record<string, boolean>}
          testID={testID as string}
          disabled={(accessibilityState as Record<string, boolean>)?.disabled}
        >
          {children as React.ReactNode}
        </TouchableOpacity>
      );
    }
    return <View {...rest}>{children as React.ReactNode}</View>;
  };

  const TamaguiText = (props: Record<string, unknown>) => {
    const { children, ...rest } = props;
    return <Text {...rest}>{children as React.ReactNode}</Text>;
  };

  return { View: TamaguiView, Text: TamaguiText };
});

jest.mock('@/constants/colors', () => ({
  colors: {
    primary: { 300: '#300', 500: '#500', 600: '#600' },
    white: '#fff',
  },
}));

describe('PrimaryButton', () => {
  it('renders the label text', () => {
    render(<PrimaryButton label="Se connecter" onPress={jest.fn()} />);

    expect(screen.getByText('Se connecter')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<PrimaryButton label="Valider" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading label when isLoading is true', () => {
    render(
      <PrimaryButton
        label="Envoyer"
        loadingLabel="Chargement..."
        isLoading={true}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText('Chargement...')).toBeTruthy();
    expect(screen.queryByText('Envoyer')).toBeNull();
  });

  it('falls back to label when isLoading is true but no loadingLabel', () => {
    render(<PrimaryButton label="Envoyer" isLoading={true} onPress={jest.fn()} />);

    expect(screen.getByText('Envoyer')).toBeTruthy();
  });

  it('sets disabled accessibility state when loading', () => {
    render(<PrimaryButton label="Envoyer" isLoading={true} onPress={jest.fn()} />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toEqual({ disabled: true, busy: true });
  });

  it('has correct accessibility role and label', () => {
    render(<PrimaryButton label="Confirmer" onPress={jest.fn()} />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Confirmer');
  });
});
