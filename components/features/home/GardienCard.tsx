import { Alert, Linking } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { User, Phone, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface GardienCardProps {
  name: string;
  phone: string;
  horaires: string;
}

export function GardienCard({ name, phone, horaires }: GardienCardProps) {
  function handleCall() {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Appeler le gardien', `${name} : ${phone}`);
    });
  }

  return (
    <View
      backgroundColor={colors.white}
      borderRadius={16}
      padding={20}
      gap={12}
      accessibilityLabel={`Gardien : ${name}, ${horaires}`}
    >
      <XStack gap={14} alignItems="center">
        <View
          width={52}
          height={52}
          borderRadius={26}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
          accessibilityRole="image"
          accessibilityLabel={`Photo du gardien ${name}`}
        >
          <User size={24} color={colors.primary[500]} />
        </View>
        <YStack flex={1} gap={2}>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.gray[500]}>
            Gardien
          </Text>
          <Text fontFamily="$heading" fontSize={16} fontWeight="700" color={colors.gray[900]}>
            {name}
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.gray[500]}>
            {phone}
          </Text>
        </YStack>
        <View
          width={44}
          height={44}
          borderRadius={22}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ scale: 0.9, backgroundColor: colors.primary[100] }}
          onPress={handleCall}
          accessibilityRole="button"
          accessibilityLabel={`Appeler le gardien ${name}`}
          accessibilityHint="Double-tapez pour appeler le gardien"
        >
          <Phone size={20} color={colors.primary[500]} />
        </View>
      </XStack>
      <XStack gap={8} alignItems="center">
        <Clock size={16} color={colors.gray[400]} />
        <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.gray[600]}>
          {horaires}
        </Text>
      </XStack>
    </View>
  );
}
