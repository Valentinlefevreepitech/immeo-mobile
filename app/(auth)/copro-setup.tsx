import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuthStore } from '@/stores/authStore';
import { MOCK_BUILDING } from '@/fixtures/home';
import { PillButton } from '@/components/ui/PillButton';

type Step = 'choice' | 'join' | 'create' | 'confirmation';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  return Array.from(
    { length: 6 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
  ).join('');
}

/** Étape 1 : choisir de rejoindre une copro existante ou d'en créer une. */
function StepChoice({ onJoin, onCreate }: { onJoin: () => void; onCreate: () => void }) {
  const colors = useThemeColors();

  return (
    <YStack flex={1} justifyContent="center" paddingHorizontal={24} gap={16}>
      <YStack gap={6} marginBottom={12}>
        <Text
          fontFamily="$heading"
          fontSize={30}
          fontWeight="800"
          letterSpacing={-0.8}
          color={colors.text.primary}
        >
          Votre copropriété
        </Text>
        <Text fontFamily="$body" fontSize={15} fontWeight="400" color={colors.text.muted}>
          Pour accéder à Imméo, rejoignez votre immeuble ou configurez-le.
        </Text>
      </YStack>

      <XStack
        alignItems="center"
        gap={14}
        backgroundColor={colors.surface.card}
        borderRadius={22}
        padding={20}
        pressStyle={{ scale: 0.98 }}
        onPress={onJoin}
        role="button"
        aria-label="Rejoindre une copropriété existante"
      >
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Building2 size={22} color={colors.primary[500]} strokeWidth={1.8} />
        </View>
        <YStack flex={1}>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            Rejoindre une copropriété
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
            J'ai un code fourni par mon syndic ou un voisin
          </Text>
        </YStack>
        <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
      </XStack>

      <XStack
        alignItems="center"
        gap={14}
        backgroundColor={colors.surface.card}
        borderRadius={22}
        padding={20}
        pressStyle={{ scale: 0.98 }}
        onPress={onCreate}
        role="button"
        aria-label="Créer une nouvelle copropriété"
      >
        <View
          width={48}
          height={48}
          borderRadius={24}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Plus size={22} color={colors.primary[500]} strokeWidth={1.8} />
        </View>
        <YStack flex={1}>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            Créer une copropriété
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
            Je suis le premier résident à configurer l'immeuble
          </Text>
        </YStack>
        <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
      </XStack>
    </YStack>
  );
}

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const colors = useThemeColors();
  return (
    <YStack paddingHorizontal={24} paddingTop={20} gap={12}>
      <View
        width={40}
        height={40}
        borderRadius={20}
        backgroundColor={colors.surface.card}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ scale: 0.9 }}
        onPress={onBack}
        role="button"
        aria-label="Retour"
      >
        <ChevronLeft size={18} color={colors.text.primary} strokeWidth={2} />
      </View>
      <Text
        fontFamily="$heading"
        fontSize={28}
        fontWeight="800"
        letterSpacing={-0.7}
        color={colors.text.primary}
        marginTop={12}
      >
        {title}
      </Text>
    </YStack>
  );
}

/** Étape 2a : rejoindre via un code à 6 caractères. */
function StepJoin({ onBack, onJoin }: { onBack: () => void; onJoin: (code: string) => void }) {
  const colors = useThemeColors();
  const [code, setCode] = useState('');
  const canSubmit = code.trim().length === 6;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <YStack flex={1}>
        <StepHeader title="Rejoindre une copropriété" onBack={onBack} />
        <YStack paddingHorizontal={24} paddingVertical={28} gap={12}>
          <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.text.muted}>
            Entrez le code à 6 caractères partagé par votre syndic ou un voisin.
          </Text>
          <TextInput
            placeholder="A4B7K9"
            placeholderTextColor={colors.text.disabled}
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase().slice(0, 6))}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            aria-label="Code de la copropriété"
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: 999,
              paddingVertical: 18,
              paddingHorizontal: 24,
              fontFamily: 'InterBold',
              fontSize: 22,
              letterSpacing: 6,
              textAlign: 'center',
              color: colors.text.primary,
            }}
          />
        </YStack>
        <YStack flex={1} />
        <YStack paddingHorizontal={24} paddingBottom={40}>
          <PillButton label="Rejoindre" disabled={!canSubmit} onPress={() => onJoin(code)} />
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}

/** Étape 2b : créer une nouvelle copropriété (nom + adresse). */
function StepCreate({
  onBack,
  onCreate,
}: {
  onBack: () => void;
  onCreate: (name: string, address: string) => void;
}) {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const canSubmit = name.trim().length > 0 && address.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <YStack flex={1}>
          <StepHeader title="Créer une copropriété" onBack={onBack} />
          <YStack paddingHorizontal={24} paddingVertical={28} gap={12}>
            <TextInput
              placeholder="Nom de la résidence"
              placeholderTextColor={colors.text.disabled}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              aria-label="Nom de la résidence"
              style={{
                backgroundColor: colors.surface.card,
                borderRadius: 999,
                paddingVertical: 18,
                paddingHorizontal: 24,
                fontFamily: 'InterMedium',
                fontSize: 15,
                color: colors.text.primary,
              }}
            />
            <TextInput
              placeholder="Adresse"
              placeholderTextColor={colors.text.disabled}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="sentences"
              aria-label="Adresse"
              style={{
                backgroundColor: colors.surface.card,
                borderRadius: 999,
                paddingVertical: 18,
                paddingHorizontal: 24,
                fontFamily: 'InterMedium',
                fontSize: 15,
                color: colors.text.primary,
              }}
            />
          </YStack>
          <YStack flex={1} />
          <YStack paddingHorizontal={24} paddingBottom={40}>
            <PillButton
              label="Créer"
              disabled={!canSubmit}
              onPress={() => onCreate(name.trim(), address.trim())}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Étape 3 : confirmation, avec éventuellement le code généré à partager. */
function StepConfirmation({
  buildingName,
  code,
  onDiscover,
}: {
  buildingName: string;
  code?: string;
  onDiscover: () => void;
}) {
  const colors = useThemeColors();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [pop]);

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap={20} paddingHorizontal={32}>
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
        fontSize={28}
        fontWeight="800"
        letterSpacing={-0.7}
        color={colors.text.primary}
        textAlign="center"
      >
        Vous êtes prêt·e !
      </Text>
      <Text
        fontFamily="$body"
        fontSize={15}
        fontWeight="400"
        color={colors.text.muted}
        textAlign="center"
        lineHeight={23}
      >
        Votre compte est rattaché à{'\n'}
        <Text fontSize={15} fontWeight="700" color={colors.text.primary}>
          {buildingName}
        </Text>
        .
      </Text>
      {code && (
        <YStack
          backgroundColor={colors.surface.card}
          borderRadius={20}
          paddingVertical={16}
          paddingHorizontal={24}
          alignItems="center"
          gap={4}
        >
          <Text
            fontFamily="$body"
            fontSize={12}
            fontWeight="600"
            color={colors.text.muted}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Code immeuble à partager
          </Text>
          <Text
            fontFamily="$heading"
            fontSize={24}
            fontWeight="800"
            letterSpacing={6}
            color={colors.primary[900]}
          >
            {code}
          </Text>
        </YStack>
      )}
      <View
        backgroundColor={colors.primary[500]}
        borderRadius={999}
        paddingVertical={16}
        paddingHorizontal={44}
        marginTop={8}
        pressStyle={{ scale: 0.97 }}
        onPress={onDiscover}
        role="button"
        aria-label="Découvrir l'app"
      >
        <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.white}>
          Découvrir l'app
        </Text>
      </View>
    </YStack>
  );
}

export default function CoproSetupScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const setCopropriete = useAuthStore((s) => s.setCopropriete);
  const [step, setStep] = useState<Step>('choice');
  const [result, setResult] = useState<{ id: string; name: string; code?: string } | null>(null);

  const handleJoin = (code: string) => {
    const matches = code.toUpperCase() === MOCK_BUILDING.code;
    setResult({
      id: `copro-${code.toLowerCase()}`,
      name: matches ? MOCK_BUILDING.name : 'Votre nouvelle copropriété',
    });
    setStep('confirmation');
  };

  const handleCreate = (name: string, _address: string) => {
    const code = generateCode();
    setResult({ id: `copro-${code.toLowerCase()}`, name, code });
    setStep('confirmation');
  };

  const handleDiscover = () => {
    if (result) setCopropriete(result.id);
    router.replace('/(app)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {step === 'choice' && (
          <StepChoice onJoin={() => setStep('join')} onCreate={() => setStep('create')} />
        )}
        {step === 'join' && <StepJoin onBack={() => setStep('choice')} onJoin={handleJoin} />}
        {step === 'create' && (
          <StepCreate onBack={() => setStep('choice')} onCreate={handleCreate} />
        )}
        {step === 'confirmation' && result && (
          <StepConfirmation
            buildingName={result.name}
            code={result.code}
            onDiscover={handleDiscover}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
