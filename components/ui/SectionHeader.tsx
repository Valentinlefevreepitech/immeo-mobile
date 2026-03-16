import { XStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface SectionHeaderProps {
  title: string;
  count?: number;
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <XStack justifyContent="space-between" alignItems="center" accessibilityRole="header">
      <Text fontFamily="$heading" fontSize={20} fontWeight="700" color={colors.gray[900]}>
        {title}
      </Text>
      {count !== undefined && (
        <View
          paddingHorizontal={10}
          paddingVertical={4}
          borderRadius={12}
          backgroundColor={colors.primary[50]}
        >
          <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.primary[500]}>
            {count}
          </Text>
        </View>
      )}
    </XStack>
  );
}
