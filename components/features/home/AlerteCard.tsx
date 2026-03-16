import { memo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { ChevronRight } from 'lucide-react-native';

interface AlerteCardProps {
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export const AlerteCard = memo(function AlerteCard({
  icon,
  iconColor,
  bgColor,
  textColor,
  title,
  subtitle,
  onPress,
}: AlerteCardProps) {
  return (
    <View
      backgroundColor={bgColor}
      borderRadius={16}
      padding={16}
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Alerte : ${title}. ${subtitle}`}
      accessibilityHint="Double-tapez pour voir les details"
    >
      <XStack gap={12} alignItems="center">
        <View
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor={`${iconColor}22`}
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {icon}
        </View>
        <YStack flex={1} gap={4}>
          <Text fontFamily="$body" fontSize={14} fontWeight="600" color={textColor}>
            {title}
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={textColor}>
            {subtitle}
          </Text>
        </YStack>
        <ChevronRight size={16} color={textColor} flexShrink={0} />
      </XStack>
    </View>
  );
});
