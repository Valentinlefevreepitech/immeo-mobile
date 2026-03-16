import { YStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface ProfileHeaderProps {
  initials: string;
  fullName: string;
  email: string;
  role?: string;
}

export function ProfileHeader({
  initials,
  fullName,
  email,
  role = 'Locataire',
}: ProfileHeaderProps) {
  return (
    <YStack paddingHorizontal="$5" paddingTop="$6" paddingBottom="$5" alignItems="center" gap="$3">
      <View
        width={80}
        height={80}
        borderRadius="$10"
        backgroundColor={colors.primary[500]}
        alignItems="center"
        justifyContent="center"
        accessibilityRole="image"
        accessibilityLabel={`Photo de profil de ${fullName}`}
      >
        <Text fontFamily="$heading" fontSize={30} fontWeight="700" color={colors.white}>
          {initials}
        </Text>
      </View>
      <YStack alignItems="center" gap="$1">
        <Text fontFamily="$heading" fontSize={22} fontWeight="700" color="$color">
          {fullName}
        </Text>
        <Text fontFamily="$body" fontSize={14} fontWeight="400" color="$placeholderColor">
          {email}
        </Text>
      </YStack>
      <View
        paddingHorizontal="$4"
        paddingVertical="$1"
        borderRadius="$10"
        backgroundColor={colors.primary[50]}
      >
        <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.primary[500]}>
          {role}
        </Text>
      </View>
    </YStack>
  );
}
