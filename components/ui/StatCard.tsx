import { Text, View } from 'tamagui';
import { useThemeColors } from '@/hooks/useThemeColors';

interface StatCardProps {
  value: string;
  label: string;
  valueColor?: string;
}

export function StatCard({ value, label, valueColor }: StatCardProps) {
  const colors = useThemeColors();
  return (
    <View
      flex={1}
      backgroundColor={colors.white}
      borderRadius={16}
      padding={16}
      gap={4}
      alignItems="center"
      accessibilityLabel={`${label} : ${value}`}
    >
      <Text
        fontFamily="$heading"
        fontSize={22}
        fontWeight="700"
        color={valueColor ?? colors.primary[500]}
      >
        {value}
      </Text>
      <Text fontFamily="$body" fontSize={12} fontWeight="500" color={colors.gray[500]}>
        {label}
      </Text>
    </View>
  );
}
