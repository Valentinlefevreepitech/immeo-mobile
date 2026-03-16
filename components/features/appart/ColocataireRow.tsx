import { memo } from 'react';
import { Alert, Linking } from 'react-native';
import { XStack, Text, View } from 'tamagui';
import { colors } from '@/constants/colors';

interface ColocataireRowProps {
  name: string;
  initials: string;
  isPrincipal: boolean;
  phone?: string;
}

export const ColocataireRow = memo(function ColocataireRow({
  name,
  initials,
  isPrincipal,
  phone,
}: ColocataireRowProps) {
  function handlePress() {
    if (phone) {
      Alert.alert(name, `Telephone : ${phone}`, [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appeler',
          onPress: () => Linking.openURL(`tel:${phone}`).catch(() => {}),
        },
      ]);
    }
  }

  return (
    <XStack
      paddingVertical={12}
      gap={14}
      alignItems="center"
      pressStyle={phone ? { opacity: 0.7 } : undefined}
      onPress={phone ? handlePress : undefined}
      accessibilityRole={phone ? 'button' : undefined}
      accessibilityLabel={`${name}${isPrincipal ? ', titulaire' : ''}${phone ? `, telephone : ${phone}` : ''}`}
      accessibilityHint={phone ? 'Double-tapez pour appeler' : undefined}
    >
      <View
        width={44}
        height={44}
        borderRadius={22}
        backgroundColor={colors.primary[50]}
        alignItems="center"
        justifyContent="center"
      >
        <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.primary[500]}>
          {initials}
        </Text>
      </View>
      <Text fontFamily="$body" fontSize={15} fontWeight="500" color={colors.gray[900]} flex={1}>
        {name}
      </Text>
      {isPrincipal && (
        <View
          paddingHorizontal={10}
          paddingVertical={3}
          borderRadius={8}
          backgroundColor={colors.primary[50]}
        >
          <Text fontFamily="$body" fontSize={11} fontWeight="600" color={colors.primary[500]}>
            Titulaire
          </Text>
        </View>
      )}
    </XStack>
  );
});
