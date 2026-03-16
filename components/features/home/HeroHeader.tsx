import { Alert } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';

interface HeroHeaderProps {
  buildingName: string;
}

export function HeroHeader({ buildingName }: HeroHeaderProps) {
  const { user } = useAuthStore();
  const initials = user?.initials || 'VL';
  const name = user?.fullName?.split(' ')[0] || 'Valentin';

  return (
    <View>
      <LinearGradient
        colors={['#E6F5F2', '#D4F1EB', colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ paddingBottom: 20 }}
      >
        <SafeAreaView edges={['top']}>
          <XStack
            paddingHorizontal={20}
            paddingTop={8}
            paddingBottom={16}
            alignItems="center"
            gap={12}
          >
            <View
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor={colors.primary[500]}
              alignItems="center"
              justifyContent="center"
              accessibilityLabel={`Avatar de ${name}`}
              accessibilityRole="image"
            >
              <Text fontFamily="$heading" fontSize={16} fontWeight="700" color={colors.white}>
                {initials}
              </Text>
            </View>
            <YStack flex={1}>
              <Text fontFamily="$body" fontSize={15} fontWeight="400" color={colors.secondary[500]}>
                Bonjour, {name}
              </Text>
              <Text fontFamily="$heading" fontSize={22} fontWeight="700" color={colors.gray[900]}>
                {buildingName}
              </Text>
            </YStack>
            <View
              width={44}
              height={44}
              borderRadius={22}
              backgroundColor={`${colors.white}CC`}
              alignItems="center"
              justifyContent="center"
              pressStyle={{ scale: 0.95 }}
              onPress={() => Alert.alert('Notifications', 'Aucune nouvelle notification.')}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              accessibilityHint="Double-tapez pour voir les notifications"
            >
              <Bell size={20} color={colors.gray[700]} />
            </View>
          </XStack>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
