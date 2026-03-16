import { memo } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface AnnonceCardProps {
  title: string;
  content: string;
  date: string;
  author: string;
  onPress: () => void;
}

export const AnnonceCard = memo(function AnnonceCard({
  title,
  content,
  date,
  author,
  onPress,
}: AnnonceCardProps) {
  return (
    <View
      backgroundColor={colors.white}
      borderRadius={16}
      padding={20}
      gap={12}
      borderLeftWidth={4}
      borderLeftColor={colors.primary[500]}
      pressStyle={{ opacity: 0.8 }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Annonce de ${author} : ${title}, ${date}`}
      accessibilityHint="Double-tapez pour lire l'annonce"
    >
      <YStack flex={1} gap={4}>
        <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.gray[900]}>
          {title}
        </Text>
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="400"
          color={colors.gray[600]}
          numberOfLines={3}
        >
          {content}
        </Text>
      </YStack>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontFamily="$body" fontSize={12} fontWeight="500" color={colors.secondary[500]}>
          {author}
        </Text>
        <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[400]}>
          {date}
        </Text>
      </XStack>
    </View>
  );
});
