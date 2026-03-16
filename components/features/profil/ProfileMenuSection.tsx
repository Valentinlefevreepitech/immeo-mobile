import { YStack, Text, View } from 'tamagui';

interface ProfileMenuSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileMenuSection({ title, children }: ProfileMenuSectionProps) {
  return (
    <YStack gap="$2">
      <Text
        fontFamily="$body"
        fontSize={13}
        fontWeight="600"
        color="$placeholderColor"
        textTransform="uppercase"
        letterSpacing={1}
        paddingLeft="$1"
        accessibilityRole="header"
      >
        {title}
      </Text>
      <View backgroundColor="$white" borderRadius="$5" paddingHorizontal="$5">
        {children}
      </View>
    </YStack>
  );
}
