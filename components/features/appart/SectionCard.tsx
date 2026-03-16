import { YStack, XStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <YStack gap={12}>
      <XStack gap={8} alignItems="center" accessibilityRole="header">
        {icon}
        <Text fontFamily="$heading" fontSize={18} fontWeight="700" color={colors.gray[900]}>
          {title}
        </Text>
      </XStack>
      <View backgroundColor={colors.white} borderRadius={16} paddingHorizontal={20}>
        {children}
      </View>
    </YStack>
  );
}
