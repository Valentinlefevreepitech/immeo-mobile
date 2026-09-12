import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, TextInput, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Check } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { INCIDENT_CATEGORIES } from '@/fixtures/incidents';
import { MOCK_SYNDIC } from '@/fixtures/incidents';
import { MOCK_APARTMENT } from '@/fixtures/apartment';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PillButton } from '@/components/ui/PillButton';

type Localisation = 'logement' | 'communes';

/** Segment de barre de progression, remplissage animé (origin left). */
function ProgressSegment({ filled }: { filled: boolean }) {
  const colors = useThemeColors();
  const anim = useRef(new Animated.Value(filled ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: filled ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [filled, anim]);

  return (
    <RNView
      style={{
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.surface.empty,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={{
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.primary[500],
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </RNView>
  );
}

function StepOne({
  photos,
  onPickPhotos,
  localisation,
  onLocalisation,
  category,
  onCategory,
  onContinue,
}: {
  photos: string[];
  onPickPhotos: () => void;
  localisation: Localisation;
  onLocalisation: (l: Localisation) => void;
  category: string;
  onCategory: (c: string) => void;
  onContinue: () => void;
}) {
  const colors = useThemeColors();
  return (
    <YStack flex={1}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, gap: 22 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Zone photo */}
        <YStack
          borderWidth={2}
          borderStyle="dashed"
          borderColor={colors.primary[100]}
          backgroundColor={colors.primary[50]}
          borderRadius={24}
          padding={26}
          alignItems="center"
          gap={10}
          pressStyle={{ scale: 0.98 }}
          onPress={onPickPhotos}
          role="button"
          aria-label="Ajouter une photo"
        >
          {photos.length > 0 ? (
            <XStack gap={8} flexWrap="wrap" justifyContent="center">
              {photos.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{ width: 64, height: 64, borderRadius: 12 }}
                />
              ))}
            </XStack>
          ) : (
            <View
              width={52}
              height={52}
              borderRadius={26}
              backgroundColor={colors.primary[50]}
              alignItems="center"
              justifyContent="center"
            >
              <Camera size={24} color={colors.primary[500]} strokeWidth={1.8} />
            </View>
          )}
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            {photos.length > 0
              ? `${photos.length} photo${photos.length > 1 ? 's' : ''} jointe${photos.length > 1 ? 's' : ''}`
              : 'Ajouter une photo'}
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
            Une photo accélère le diagnostic
          </Text>
        </YStack>

        {/* Localisation */}
        <YStack gap={10}>
          <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
            Localisation
          </Text>
          <XStack backgroundColor={colors.surface.card} borderRadius={999} padding={4}>
            {(
              [
                { key: 'logement', label: 'Mon logement' },
                { key: 'communes', label: 'Parties communes' },
              ] as const
            ).map((opt) => {
              const isActive = localisation === opt.key;
              return (
                <View
                  key={opt.key}
                  flex={1}
                  paddingVertical={10}
                  borderRadius={999}
                  alignItems="center"
                  backgroundColor={isActive ? colors.white : 'transparent'}
                  {...(isActive
                    ? {
                        shadowColor: '#0B0F0E',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 3,
                      }
                    : {})}
                  onPress={() => onLocalisation(opt.key)}
                  role="radio"
                  aria-label={opt.label}
                  aria-selected={isActive}
                >
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight={isActive ? '600' : '500'}
                    color={isActive ? colors.primary[500] : colors.text.muted}
                  >
                    {opt.label}
                  </Text>
                </View>
              );
            })}
          </XStack>
        </YStack>

        {/* Catégorie */}
        <YStack gap={10}>
          <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
            Catégorie
          </Text>
          <XStack flexWrap="wrap" gap={8}>
            {INCIDENT_CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <View
                  key={cat}
                  paddingVertical={10}
                  paddingHorizontal={18}
                  borderRadius={999}
                  backgroundColor={isActive ? colors.primary[500] : colors.surface.card}
                  pressStyle={{ scale: 0.95 }}
                  onPress={() => onCategory(cat)}
                  role="radio"
                  aria-label={cat}
                  aria-selected={isActive}
                >
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight={isActive ? '600' : '500'}
                    color={isActive ? colors.white : colors.text.secondary}
                  >
                    {cat}
                  </Text>
                </View>
              );
            })}
          </XStack>
        </YStack>
      </ScrollView>

      <YStack paddingHorizontal={24} paddingTop={16} paddingBottom={24}>
        <PillButton label="Continuer" onPress={onContinue} />
      </YStack>
    </YStack>
  );
}

function StepTwo({
  description,
  onDescription,
  category,
  localisation,
  photoCount,
  onSubmit,
}: {
  description: string;
  onDescription: (t: string) => void;
  category: string;
  localisation: Localisation;
  photoCount: number;
  onSubmit: () => void;
}) {
  const colors = useThemeColors();
  const recap = [
    { label: 'Catégorie', value: category },
    {
      label: 'Localisation',
      value:
        localisation === 'logement'
          ? `Mon logement · ${MOCK_APARTMENT.numero}`
          : 'Parties communes',
    },
    {
      label: 'Photos',
      value: photoCount > 0 ? `${photoCount} jointe${photoCount > 1 ? 's' : ''}` : 'Aucune',
    },
    { label: 'Destinataire', value: MOCK_SYNDIC.name },
  ];

  return (
    <YStack flex={1}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          placeholder="Décrivez le problème le plus précisément possible…"
          placeholderTextColor={colors.text.disabled}
          value={description}
          onChangeText={onDescription}
          multiline
          textAlignVertical="top"
          aria-label="Description du problème"
          style={{
            backgroundColor: colors.surface.card,
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 18,
            minHeight: 120,
            fontFamily: 'Inter',
            fontSize: 14,
            lineHeight: 22,
            color: colors.text.primary,
          }}
        />

        <YStack gap={12}>
          <SectionLabel marginBottom={0}>Récapitulatif</SectionLabel>
          <YStack
            backgroundColor={colors.primary[50]}
            borderWidth={1}
            borderColor={colors.primary[100]}
            borderRadius={20}
            paddingHorizontal={20}
            paddingVertical={18}
            gap={12}
          >
            {recap.map((row, index) => (
              <YStack key={row.label} gap={12}>
                {index > 0 && <View height={1} backgroundColor={colors.primary[50]} />}
                <XStack justifyContent="space-between">
                  <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                    {row.label}
                  </Text>
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight="600"
                    color={colors.text.primary}
                  >
                    {row.value}
                  </Text>
                </XStack>
              </YStack>
            ))}
          </YStack>
        </YStack>
      </ScrollView>

      <YStack paddingHorizontal={24} paddingTop={16} paddingBottom={24}>
        <PillButton label="Envoyer au syndic" onPress={onSubmit} />
      </YStack>
    </YStack>
  );
}

function Confirmation({ onFollow, onHome }: { onFollow: () => void; onHome: () => void }) {
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
        Incident envoyé
      </Text>
      <Text
        fontFamily="$body"
        fontSize={14}
        fontWeight="400"
        color={colors.text.muted}
        textAlign="center"
        lineHeight={22}
      >
        Le {MOCK_SYNDIC.name} a été notifié.{'\n'}Vous serez alerté à chaque changement de statut.
      </Text>
      <YStack gap={10} width="100%" marginTop={8}>
        <PillButton label="Suivre mon incident" onPress={onFollow} />
        <PillButton label="Retour à l'accueil" variant="secondary" onPress={onHome} />
      </YStack>
    </YStack>
  );
}

export default function SignalerScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [localisation, setLocalisation] = useState<Localisation>('logement');
  const [category, setCategory] = useState<string>(INCIDENT_CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const handlePickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos(result.assets.map((asset) => asset.uri));
    }
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {step === 3 ? (
          <Confirmation
            onFollow={() => router.replace('/incident-detail')}
            onHome={() => router.replace('/')}
          />
        ) : (
          <YStack flex={1}>
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={8}>
              <ScreenHeader
                title={step === 1 ? 'Nouvel incident' : 'Décrivez le problème'}
                subtitle={`Étape ${step} sur 2`}
                icon={step === 1 ? 'close' : 'back'}
                onBack={() => (step === 1 ? router.back() : setStep(1))}
              />
            </YStack>
            <XStack paddingHorizontal={24} paddingTop={8} gap={6}>
              <ProgressSegment filled />
              <ProgressSegment filled={step === 2} />
            </XStack>
            {step === 1 ? (
              <StepOne
                photos={photos}
                onPickPhotos={handlePickPhotos}
                localisation={localisation}
                onLocalisation={setLocalisation}
                category={category}
                onCategory={setCategory}
                onContinue={() => setStep(2)}
              />
            ) : (
              <StepTwo
                description={description}
                onDescription={setDescription}
                category={category}
                localisation={localisation}
                photoCount={photos.length}
                onSubmit={() => setStep(3)}
              />
            )}
          </YStack>
        )}
      </SafeAreaView>
    </RNView>
  );
}
