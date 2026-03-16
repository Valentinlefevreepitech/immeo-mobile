import { memo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  danger?: boolean;
  onPress?: () => void;
}

export const ProfileMenuItem = memo(function ProfileMenuItem({
  icon,
  label,
  subtitle,
  danger = false,
  onPress,
}: ProfileMenuItemProps) {
  return (
    <View
      paddingVertical="$4"
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <XStack gap="$4" alignItems="center">
        <View
          width={40}
          height={40}
          borderRadius="$3"
          backgroundColor={danger ? colors.dangerBg : colors.gray[100]}
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </View>
        <YStack flex={1}>
          <Text
            fontFamily="$body"
            fontSize={15}
            fontWeight="500"
            color={danger ? colors.danger : '$color'}
          >
            {label}
          </Text>
          {subtitle && (
            <Text fontFamily="$body" fontSize={13} fontWeight="300" color="$placeholderColor">
              {subtitle}
            </Text>
          )}
        </YStack>
        <ChevronRight size={16} color={colors.gray[400]} />
      </XStack>
    </View>
  );
});
