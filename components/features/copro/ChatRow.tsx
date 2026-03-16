import { memo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface ChatRowProps {
  name: string;
  initials: string;
  message: string;
  time: string;
  unread?: boolean;
  onPress: () => void;
}

export const ChatRow = memo(function ChatRow({
  name,
  initials,
  message,
  time,
  unread,
  onPress,
}: ChatRowProps) {
  return (
    <View
      paddingVertical={14}
      pressStyle={{ opacity: 0.7 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Conversation avec ${name}${unread ? ', non lu' : ''} : ${message}`}
      accessibilityHint="Double-tapez pour ouvrir la conversation"
    >
      <XStack gap={14} alignItems="center">
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.primary[500]}>
            {initials}
          </Text>
        </View>
        <YStack flex={1} gap={2}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontFamily="$body"
              fontSize={15}
              fontWeight={unread ? '700' : '500'}
              color={colors.gray[900]}
            >
              {name}
            </Text>
            <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[400]}>
              {time}
            </Text>
          </XStack>
          <Text
            fontFamily="$body"
            fontSize={13}
            fontWeight={unread ? '500' : '400'}
            color={unread ? colors.gray[800] : colors.gray[500]}
            numberOfLines={1}
          >
            {message}
          </Text>
        </YStack>
        {unread && (
          <View width={10} height={10} borderRadius={5} backgroundColor={colors.primary[500]} />
        )}
      </XStack>
    </View>
  );
});
