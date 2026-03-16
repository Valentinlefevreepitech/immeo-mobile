import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { YStack, XStack, Text, View } from 'tamagui';
import { Building2, Copy } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface CodeImmeubleCardProps {
  code: string;
}

export function CodeImmeubleCard({ code }: CodeImmeubleCardProps) {
  async function handleCopy() {
    try {
      await Clipboard.setStringAsync(code);
      Alert.alert('Code copie !', `Le code ${code} a ete copie dans le presse-papiers.`);
    } catch {
      Alert.alert('Code immeuble', code);
    }
  }

  return (
    <View
      backgroundColor={colors.primary[500]}
      borderRadius={20}
      padding={24}
      gap={16}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      onPress={handleCopy}
      accessibilityRole="button"
      accessibilityLabel={`Code immeuble : ${code}`}
      accessibilityHint="Double-tapez pour copier le code"
    >
      <XStack gap={12} alignItems="center">
        <View
          width={48}
          height={48}
          borderRadius={14}
          backgroundColor={`${colors.white}22`}
          alignItems="center"
          justifyContent="center"
        >
          <Building2 size={24} color={colors.white} />
        </View>
        <YStack flex={1}>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={`${colors.white}BB`}>
            Code immeuble
          </Text>
          <Text
            fontFamily="$heading"
            fontSize={28}
            fontWeight="700"
            color={colors.white}
            letterSpacing={4}
          >
            {code}
          </Text>
        </YStack>
        <Copy size={22} color={`${colors.white}BB`} />
      </XStack>
      <Text fontFamily="$body" fontSize={12} fontWeight="400" color={`${colors.white}88`}>
        Appuyez pour copier le code
      </Text>
    </View>
  );
}
