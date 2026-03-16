import { Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface PrimaryButtonProps {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  onPress: () => void;
}

export function PrimaryButton({
  label,
  loadingLabel,
  isLoading = false,
  onPress,
}: PrimaryButtonProps) {
  return (
    <View
      backgroundColor={isLoading ? colors.primary[300] : colors.primary[500]}
      borderRadius={16}
      paddingVertical={16}
      alignItems="center"
      pressStyle={isLoading ? {} : { opacity: 0.9, backgroundColor: colors.primary[600] }}
      onPress={onPress}
      opacity={isLoading ? 0.7 : 1}
      pointerEvents={isLoading ? 'none' : 'auto'}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
    >
      <Text fontFamily="$body" fontSize={16} fontWeight="600" color={colors.white}>
        {isLoading ? (loadingLabel ?? label) : label}
      </Text>
    </View>
  );
}
