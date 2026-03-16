import { Alert } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { Car } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ParkingCardProps {
  parking: { numero: string; niveau: string; type: string };
}

export function ParkingCard({ parking }: ParkingCardProps) {
  return (
    <View
      backgroundColor={colors.white}
      borderRadius={16}
      padding={20}
      gap={12}
      pressStyle={{ opacity: 0.8 }}
      onPress={() =>
        Alert.alert(
          'Place de parking',
          `Place n°${parking.numero}\n${parking.niveau} · ${parking.type}\n\nAcces par la rampe cote jardin.\nBadge requis pour l'ouverture du portail.`,
        )
      }
      accessibilityRole="button"
      accessibilityLabel={`Place de parking numero ${parking.numero}, ${parking.niveau}, ${parking.type}`}
      accessibilityHint="Double-tapez pour voir les details"
    >
      <XStack gap={14} alignItems="center">
        <View
          width={52}
          height={52}
          borderRadius={16}
          backgroundColor={colors.secondary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Car size={26} color={colors.secondary[500]} />
        </View>
        <YStack flex={1} gap={2}>
          <Text fontFamily="$heading" fontSize={16} fontWeight="700" color={colors.gray[900]}>
            {`Place n°${parking.numero}`}
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.gray[500]}>
            {`${parking.niveau} · ${parking.type}`}
          </Text>
        </YStack>
        <View
          paddingHorizontal={10}
          paddingVertical={4}
          borderRadius={10}
          backgroundColor={colors.successBg}
        >
          <Text fontFamily="$body" fontSize={11} fontWeight="600" color={colors.successText}>
            Attribuee
          </Text>
        </View>
      </XStack>
    </View>
  );
}
