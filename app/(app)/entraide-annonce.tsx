import { useState } from 'react';
import { Image, ScrollView, TextInput, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEntraide } from '@/hooks/useEntraide';
import {
  ENTRAIDE_CATEGORIES,
  ENTRAIDE_DUREES,
  type EntraideCategorie,
  type EntraideType,
} from '@/fixtures/entraide';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PillButton } from '@/components/ui/PillButton';
import { Toggle } from '@/components/ui/Toggle';

export default function EntraideAnnonceScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { publierAnnonce } = useEntraide();

  const [type, setType] = useState<EntraideType>('objet');
  const [photo, setPhoto] = useState<string | null>(null);
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState<EntraideCategorie>(ENTRAIDE_CATEGORIES[0]);
  const [duree, setDuree] = useState<(typeof ENTRAIDE_DUREES)[number]>('48h');
  const [visibleImmeuble, setVisibleImmeuble] = useState(true);

  const canPublish = titre.trim().length > 0;

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handlePublish = () => {
    if (!canPublish) return;
    publierAnnonce({
      type,
      titre: titre.trim(),
      categorie,
      duree,
      visibleImmeuble,
    });
    router.replace('/(app)/copro');
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
          <ScreenHeader title="Nouvelle annonce" icon="close" onBack={() => router.back()} />
        </YStack>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, gap: 22 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type */}
          <XStack backgroundColor={colors.surface.card} borderRadius={999} padding={4}>
            {(
              [
                { key: 'objet', label: 'Je prête un objet' },
                { key: 'service', label: 'Je propose un service' },
              ] as const
            ).map((opt) => {
              const isActive = type === opt.key;
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
                  onPress={() => setType(opt.key)}
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

          {/* Photo */}
          <YStack
            borderWidth={2}
            borderStyle="dashed"
            borderColor={colors.primary[100]}
            backgroundColor="#F7FCFB"
            borderRadius={24}
            padding={24}
            alignItems="center"
            gap={8}
            onPress={handlePickPhoto}
            pressStyle={{ scale: 0.98 }}
            role="button"
            aria-label="Ajouter une photo"
          >
            {photo ? (
              <Image source={{ uri: photo }} style={{ width: 64, height: 64, borderRadius: 12 }} />
            ) : (
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor={colors.primary[50]}
                alignItems="center"
                justifyContent="center"
              >
                <Camera size={22} color={colors.primary[500]} strokeWidth={1.8} />
              </View>
            )}
            <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
              {photo ? 'Photo ajoutée' : 'Ajouter une photo'}
            </Text>
            <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
              Recommandé · rassure vos voisins
            </Text>
          </YStack>

          {/* Titre */}
          <TextInput
            placeholder="Titre de l'annonce"
            placeholderTextColor={colors.text.disabled}
            value={titre}
            onChangeText={setTitre}
            aria-label="Titre de l'annonce"
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: 999,
              paddingHorizontal: 20,
              paddingVertical: 16,
              fontFamily: 'Inter',
              fontSize: 14,
              color: colors.text.primary,
            }}
          />

          {/* Catégorie */}
          <YStack gap={10}>
            <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
              Catégorie
            </Text>
            <XStack flexWrap="wrap" gap={8}>
              {ENTRAIDE_CATEGORIES.map((cat) => {
                const isActive = categorie === cat;
                return (
                  <View
                    key={cat}
                    paddingVertical={10}
                    paddingHorizontal={18}
                    borderRadius={999}
                    backgroundColor={isActive ? colors.primary[500] : colors.surface.card}
                    pressStyle={{ scale: 0.95 }}
                    onPress={() => setCategorie(cat)}
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

          {/* Durée */}
          <YStack gap={10}>
            <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
              Durée du prêt
            </Text>
            <XStack gap={8}>
              {ENTRAIDE_DUREES.map((d) => {
                const isActive = duree === d;
                return (
                  <View
                    key={d}
                    flex={1}
                    paddingVertical={12}
                    borderRadius={999}
                    alignItems="center"
                    backgroundColor={isActive ? colors.primary[500] : colors.surface.card}
                    pressStyle={{ scale: 0.96 }}
                    onPress={() => setDuree(d)}
                    role="radio"
                    aria-label={d}
                    aria-selected={isActive}
                  >
                    <Text
                      fontFamily="$body"
                      fontSize={13}
                      fontWeight={isActive ? '700' : '500'}
                      color={isActive ? colors.white : colors.text.secondary}
                    >
                      {d}
                    </Text>
                  </View>
                );
              })}
            </XStack>
          </YStack>

          {/* Visibilité */}
          <XStack
            alignItems="center"
            gap={12}
            backgroundColor={colors.surface.card}
            borderRadius={20}
            padding={18}
          >
            <Text
              flex={1}
              fontFamily="$body"
              fontSize={14}
              fontWeight="600"
              color={colors.text.primary}
            >
              Visible par tout l'immeuble
            </Text>
            <Toggle
              value={visibleImmeuble}
              onValueChange={setVisibleImmeuble}
              aria-label="Visible par tout l'immeuble"
            />
          </XStack>

          <Text
            fontFamily="$body"
            fontSize={12}
            fontWeight="400"
            color={colors.text.muted}
            lineHeight={18}
          >
            Votre numéro de téléphone n'est jamais visible publiquement : il n'est partagé qu'après
            acceptation d'une demande.
          </Text>
        </ScrollView>

        <YStack paddingHorizontal={24} paddingTop={16} paddingBottom={16}>
          <PillButton label="Publier l'annonce" disabled={!canPublish} onPress={handlePublish} />
        </YStack>
      </SafeAreaView>
    </RNView>
  );
}
