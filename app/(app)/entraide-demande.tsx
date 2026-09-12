import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, TextInput, View as RNView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEntraide } from '@/hooks/useEntraide';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PillButton } from '@/components/ui/PillButton';

const DATE_SLOTS = ['21-22 mars', '28-29 mars', '4-5 avril', '11-12 avril'];

export default function EntraideDemandeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { offers, demander } = useEntraide();
  const offer = offers.find((o) => o.id === id) ?? offers[1];
  const prenom = offer.proprietaire.nom.split(' ')[0];
  const prisSlots = new Set(offer.dejaReserve.map((s) => s.dateLabel));

  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState<string | null>(
    DATE_SLOTS.find((s) => !prisSlots.has(s)) ?? null,
  );
  const [message, setMessage] = useState('');

  if (step === 2) {
    return (
      <RNView style={{ flex: 1, backgroundColor: colors.background }}>
        <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
          <Confirmation
            prenom={prenom}
            onSuivre={() => router.replace('/entraide-gestion')}
            onRetour={() => router.replace('/entraide')}
          />
        </SafeAreaView>
      </RNView>
    );
  }

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
          <ScreenHeader
            title="Demander"
            subtitle={offer.titre}
            onBack={() => router.replace({ pathname: '/entraide-fiche', params: { id: offer.id } })}
          />
        </YStack>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, gap: 22 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <YStack gap={10}>
            <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
              Choisissez une date
            </Text>
            <XStack gap={8} flexWrap="wrap">
              {DATE_SLOTS.map((slot) => {
                const pris = prisSlots.has(slot);
                const isActive = date === slot;
                return (
                  <View
                    key={slot}
                    paddingHorizontal={14}
                    paddingVertical={10}
                    borderRadius={999}
                    backgroundColor={isActive ? colors.primary[500] : colors.surface.card}
                    opacity={pris ? 0.4 : 1}
                    onPress={pris ? undefined : () => setDate(slot)}
                    pressStyle={pris ? {} : { scale: 0.96 }}
                    role="radio"
                    aria-label={slot}
                    aria-selected={isActive}
                  >
                    <Text
                      fontFamily="$body"
                      fontSize={13}
                      fontWeight={isActive ? '600' : '500'}
                      color={isActive ? colors.white : colors.text.secondary}
                      style={pris ? { textDecorationLine: 'line-through' } : undefined}
                    >
                      {slot}
                    </Text>
                  </View>
                );
              })}
            </XStack>
          </YStack>

          <TextInput
            placeholder={`Un mot pour ${prenom}`}
            placeholderTextColor={colors.text.disabled}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            aria-label={`Un mot pour ${prenom}`}
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 18,
              minHeight: 90,
              fontFamily: 'Inter',
              fontSize: 14,
              color: colors.text.primary,
            }}
          />

          <YStack gap={12}>
            <SectionLabel marginBottom={0}>Récapitulatif</SectionLabel>
            <YStack
              backgroundColor={colors.background}
              borderWidth={1}
              borderColor={colors.primary[100]}
              borderRadius={20}
              paddingHorizontal={20}
              paddingVertical={18}
              gap={12}
            >
              <XStack justifyContent="space-between">
                <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                  Objet
                </Text>
                <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.primary}>
                  {offer.titre}
                </Text>
              </XStack>
              <View height={1} backgroundColor={colors.primary[50]} />
              <XStack justifyContent="space-between">
                <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                  Retrait
                </Text>
                <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.primary}>
                  {offer.proprietaire.etage}
                </Text>
              </XStack>
              <View height={1} backgroundColor={colors.primary[50]} />
              <XStack justifyContent="space-between">
                <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                  Vos coordonnées
                </Text>
                <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.primary}>
                  Après acceptation
                </Text>
              </XStack>
            </YStack>
          </YStack>

          <Text
            fontFamily="$body"
            fontSize={12}
            fontWeight="400"
            color={colors.text.muted}
            lineHeight={18}
          >
            Tant qu'il n'a pas accepté, {prenom} ne voit que votre nom et votre étage.
          </Text>
        </ScrollView>

        <YStack paddingHorizontal={24} paddingTop={16} paddingBottom={16}>
          <PillButton
            label="Envoyer la demande"
            disabled={!date}
            onPress={() => {
              demander(offer.id);
              setStep(2);
            }}
          />
        </YStack>
      </SafeAreaView>
    </RNView>
  );
}

function Confirmation({
  prenom,
  onSuivre,
  onRetour,
}: {
  prenom: string;
  onSuivre: () => void;
  onRetour: () => void;
}) {
  const colors = useThemeColors();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [pop]);

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap={18} paddingHorizontal={32}>
      <Animated.View style={{ transform: [{ scale: pop }] }}>
        <View
          width={96}
          height={96}
          borderRadius={48}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Check size={44} color={colors.primary[500]} strokeWidth={2.5} />
        </View>
      </Animated.View>
      <Text
        fontFamily="$heading"
        fontSize={26}
        fontWeight="800"
        letterSpacing={-0.6}
        color={colors.text.primary}
        textAlign="center"
      >
        Demande envoyée
      </Text>
      <Text
        fontFamily="$body"
        fontSize={14}
        fontWeight="400"
        color={colors.text.muted}
        textAlign="center"
      >
        {prenom} a 48h pour répondre.
      </Text>
      <YStack gap={10} width="100%" marginTop={8}>
        <PillButton label="Suivre mes demandes" onPress={onSuivre} />
        <PillButton label="Retour à l'entraide" variant="secondary" onPress={onRetour} />
      </YStack>
    </YStack>
  );
}
