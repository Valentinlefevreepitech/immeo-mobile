import { memo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface DateRowProps {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  date: string;
  onPress?: () => void;
}

export const DateRow = memo(function DateRow({
  icon,
  iconColor,
  label,
  date,
  onPress,
}: DateRowProps) {
  return (
    <XStack
      backgroundColor={colors.white}
      borderRadius={16}
      padding={16}
      alignItems="center"
      gap={14}
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${date}`}
      accessibilityHint="Double-tapez pour voir les details"
    >
      <View
        width={44}
        height={44}
        borderRadius={12}
        backgroundColor={`${iconColor}15`}
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </View>
      <YStack flex={1}>
        <Text fontFamily="$body" fontSize={14} fontWeight="500" color={colors.gray[900]}>
          {label}
        </Text>
        <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[500]}>
          {date}
        </Text>
      </YStack>
      <ChevronRight size={16} color={colors.gray[400]} />
    </XStack>
  );
});
