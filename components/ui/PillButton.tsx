import { Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  /** 'primary' = teal plein, 'secondary' = gris clair, 'white' = blanc (sur gradient) */
  variant?: 'primary' | 'secondary' | 'white';
  disabled?: boolean;
}

/** Bouton pill du prototype v2 : radius 999, padding vertical 17. */
export function PillButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: PillButtonProps) {
  const bg =
    variant === 'primary'
      ? colors.primary[500]
      : variant === 'white'
        ? colors.white
        : colors.surface.card;
  const fg = variant === 'primary' ? colors.white : colors.text.primary;

  return (
    <View
      backgroundColor={bg}
      borderRadius={999}
      paddingVertical={17}
      alignItems="center"
      opacity={disabled ? 0.5 : 1}
      pressStyle={disabled ? {} : { scale: 0.97 }}
      onPress={disabled ? undefined : onPress}
      role="button"
      aria-label={label}
      aria-disabled={disabled}
    >
      <Text
        fontFamily="$heading"
        fontSize={15}
        fontWeight={variant === 'primary' ? '700' : '600'}
        color={fg}
      >
        {label}
      </Text>
    </View>
  );
}
