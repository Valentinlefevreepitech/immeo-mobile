import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View as RNView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Check, ChevronLeft, Mail } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRoleStore, ROLE_LABELS } from '@/stores/roleStore';
import { PillButton } from '@/components/ui/PillButton';
import { Toggle } from '@/components/ui/Toggle';

const INVITATION_EMAIL = 'valentin.lefevre@epitech.digital';

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
}

/** Orbe décorative teal, dégradé radial, respiration lente (scale + opacité). */
function DecorativeOrb({ color }: { color: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -80,
        right: -100,
        width: 340,
        height: 340,
        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.14, 0.24] }),
        transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
      }}
    >
      <Svg width={340} height={340}>
        <Defs>
          <RadialGradient id="orb" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={1} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={170} cy={170} r={170} fill="url(#orb)" />
      </Svg>
    </Animated.View>
  );
}

/** Étape 1 : invitation reçue du syndic. */
function StepInvitation({ onActivate }: { onActivate: () => void }) {
  const colors = useThemeColors();
  const role = useRoleStore((s) => s.role);

  return (
    <YStack flex={1}>
      <DecorativeOrb color={colors.primary[300]} />
      <YStack flex={1} justifyContent="center" paddingHorizontal={32} gap={14}>
        <View
          width={64}
          height={64}
          borderRadius={20}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
          marginBottom={8}
        >
          <Mail size={30} color={colors.primary[500]} strokeWidth={2} />
        </View>
        <Text
          fontFamily="$heading"
          fontSize={34}
          fontWeight="800"
          letterSpacing={-1}
          lineHeight={40}
          color={colors.text.primary}
        >
          Vous êtes invité par votre syndic
        </Text>
        <Text
          fontFamily="$body"
          fontSize={15}
          fontWeight="400"
          color={colors.text.muted}
          lineHeight={23}
        >
          Cabinet Foncia vous invite à rejoindre la{' '}
          <Text fontSize={15} fontWeight="700" color={colors.text.primary}>
            Résidence Les Jardins
          </Text>{' '}
          sur Imméo.
        </Text>
        <XStack
          backgroundColor={colors.surface.card}
          borderRadius={20}
          paddingVertical={18}
          paddingHorizontal={20}
          alignItems="center"
          gap={14}
        >
          <View
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor={colors.primary[50]}
            alignItems="center"
            justifyContent="center"
          >
            <Building2 size={20} color={colors.primary[500]} strokeWidth={2} />
          </View>
          <YStack>
            <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
              Appt 12B · 3ème étage
            </Text>
            <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
              {ROLE_LABELS[role]} · Parking n°42
            </Text>
          </YStack>
        </XStack>
      </YStack>
      <YStack paddingHorizontal={24} paddingBottom={40} gap={12}>
        <PillButton label="Activer mon compte" onPress={onActivate} />
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="400"
          color={colors.text.muted}
          textAlign="center"
        >
          Invitation envoyée à {INVITATION_EMAIL}
        </Text>
      </YStack>
    </YStack>
  );
}

/** Étape 2 : création du mot de passe + consentements RGPD. */
function StepPassword({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const colors = useThemeColors();
  const [password, setPassword] = useState('');
  const [notifConsent, setNotifConsent] = useState(true);
  const [annuaireConsent, setAnnuaireConsent] = useState(false);

  const { checks, score } = getPasswordStrength(password);
  const strengthLabel =
    score <= 1 ? 'Faible' : score === 2 ? 'Moyen' : score === 3 ? 'Bon' : 'Fort';
  const canContinue = checks.length && checks.uppercase && checks.number;

  const criteria = [
    { key: 'length', label: '8+ caractères', ok: checks.length },
    { key: 'uppercase', label: 'Majuscule', ok: checks.uppercase },
    { key: 'number', label: 'Chiffre', ok: checks.number },
    { key: 'special', label: 'Spécial', ok: checks.special },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <YStack flex={1}>
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
              fontSize={30}
              fontWeight="800"
              letterSpacing={-0.8}
              color={colors.text.primary}
              marginTop={12}
            >
              Créez votre mot de passe
            </Text>
            <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.text.muted}>
              Il vous servira aussi sur l'espace web Imméo.
            </Text>
          </YStack>

          <YStack paddingHorizontal={24} paddingVertical={28} gap={12}>
            <TextInput
              placeholder="Votre mot de passe"
              placeholderTextColor={colors.text.disabled}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              aria-label="Mot de passe"
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

            {/* Jauge de force */}
            <XStack gap={6} alignItems="center" paddingHorizontal={8}>
              {[1, 2, 3, 4].map((level) => (
                <View
                  key={level}
                  flex={1}
                  height={4}
                  borderRadius={2}
                  backgroundColor={
                    score >= level
                      ? level === 4
                        ? colors.primary[400]
                        : colors.primary[500]
                      : colors.surface.empty
                  }
                />
              ))}
              {password.length > 0 && (
                <Text
                  fontFamily="$body"
                  fontSize={12}
                  fontWeight="600"
                  color={colors.primary[500]}
                  marginLeft={6}
                >
                  {strengthLabel}
                </Text>
              )}
            </XStack>

            {/* Checklist critères */}
            <XStack gap={10} flexWrap="wrap" paddingHorizontal={8}>
              {criteria.map((c) => (
                <Text
                  key={c.key}
                  fontFamily="$body"
                  fontSize={12}
                  fontWeight="400"
                  color={c.ok ? colors.primary[500] : colors.text.disabled}
                >
                  ✓ {c.label}
                </Text>
              ))}
            </XStack>

            {/* Consentements RGPD */}
            <YStack
              backgroundColor={colors.surface.card}
              borderRadius={20}
              padding={20}
              gap={14}
              marginTop={12}
            >
              <Text
                fontFamily="$heading"
                fontSize={13}
                fontWeight="700"
                color={colors.text.primary}
              >
                Vos consentements
              </Text>
              <XStack alignItems="center" gap={12}>
                <Toggle
                  value={notifConsent}
                  onValueChange={setNotifConsent}
                  aria-label="Recevoir les notifications de ma copropriété"
                />
                <Text
                  flex={1}
                  fontFamily="$body"
                  fontSize={13}
                  fontWeight="400"
                  color={colors.text.secondary}
                >
                  Recevoir les notifications de ma copropriété
                </Text>
              </XStack>
              <XStack alignItems="center" gap={12}>
                <Toggle
                  value={annuaireConsent}
                  onValueChange={setAnnuaireConsent}
                  aria-label="Apparaître dans l'annuaire des voisins"
                />
                <Text
                  flex={1}
                  fontFamily="$body"
                  fontSize={13}
                  fontWeight="400"
                  color={colors.text.secondary}
                >
                  Apparaître dans l'annuaire des voisins
                </Text>
              </XStack>
            </YStack>
          </YStack>

          <YStack flex={1} />
          <YStack paddingHorizontal={24} paddingBottom={40}>
            <PillButton label="Continuer" onPress={onContinue} disabled={!canContinue} />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Étape 3 : compte activé. */
function StepConfirmation({ onDiscover }: { onDiscover: () => void }) {
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
        Bienvenue chez vous
      </Text>
      <Text
        fontFamily="$body"
        fontSize={15}
        fontWeight="400"
        color={colors.text.muted}
        textAlign="center"
        lineHeight={23}
      >
        Votre compte est rattaché à l'Appt 12B{'\n'}de la Résidence Les Jardins.
      </Text>
      <View
        backgroundColor={colors.primary[500]}
        borderRadius={999}
        paddingVertical={16}
        paddingHorizontal={44}
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

export default function InvitationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {step === 1 && <StepInvitation onActivate={() => setStep(2)} />}
        {step === 2 && <StepPassword onBack={() => setStep(1)} onContinue={() => setStep(3)} />}
        {step === 3 && (
          <StepConfirmation
            onDiscover={() => {
              // L'activation réelle (token d'invitation → compte Supabase) arrivera
              // avec le branchement backend ; on renvoie vers la connexion.
              router.replace('/(auth)/login');
            }}
          />
        )}
      </SafeAreaView>
    </RNView>
  );
}
