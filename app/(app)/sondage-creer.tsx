import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, TextInput, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Plus, X } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSondages } from '@/hooks/useSondages';
import type { SondageDuree, SondagePortee } from '@/fixtures/sondages';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { PillButton } from '@/components/ui/PillButton';
import { Toggle } from '@/components/ui/Toggle';

const MAX_OPTIONS = 4;
const DUREES: SondageDuree[] = [3, 7, 14];

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
  question,
  onQuestion,
  contexte,
  onContexte,
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onContinue,
}: {
  question: string;
  onQuestion: (t: string) => void;
  contexte: string;
  onContexte: (t: string) => void;
  options: string[];
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onContinue: () => void;
}) {
  const colors = useThemeColors();
  const filledOptions = options.filter((o) => o.trim().length > 0);
  const canContinue = question.trim().length > 0 && filledOptions.length >= 2;

  return (
    <YStack flex={1}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, gap: 22 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack gap={8}>
          <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
            Votre question
          </Text>
          <TextInput
            placeholder="Ex. Installer un composteur partagé ?"
            placeholderTextColor={colors.text.disabled}
            value={question}
            onChangeText={onQuestion}
            multiline
            textAlignVertical="top"
            aria-label="Question du sondage"
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 18,
              minHeight: 80,
              fontFamily: 'Inter',
              fontSize: 14,
              lineHeight: 22,
              color: colors.text.primary,
            }}
          />
          <TextInput
            placeholder="Ajoutez un contexte court : ce qu'on gagne, ce qu'on perd"
            placeholderTextColor={colors.text.disabled}
            value={contexte}
            onChangeText={onContexte}
            multiline
            textAlignVertical="top"
            aria-label="Contexte du sondage"
            style={{
              backgroundColor: colors.surface.card,
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 16,
              minHeight: 60,
              fontFamily: 'Inter',
              fontSize: 13,
              lineHeight: 20,
              color: colors.text.secondary,
            }}
          />
        </YStack>

        <YStack gap={10}>
          <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
            Réponses possibles
          </Text>
          {options.map((option, index) => (
            <XStack key={index} alignItems="center" gap={10}>
              <View
                width={26}
                height={26}
                borderRadius={13}
                backgroundColor={colors.surface.card}
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  fontFamily="$heading"
                  fontSize={12}
                  fontWeight="700"
                  color={colors.text.muted}
                >
                  {index + 1}
                </Text>
              </View>
              <TextInput
                value={option}
                onChangeText={(text) => onOptionChange(index, text)}
                placeholder={`Réponse ${index + 1}`}
                placeholderTextColor={colors.text.disabled}
                aria-label={`Réponse ${index + 1}`}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface.card,
                  borderRadius: 999,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              />
              {options.length > 2 && (
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  alignItems="center"
                  justifyContent="center"
                  onPress={() => onRemoveOption(index)}
                  pressStyle={{ scale: 0.9 }}
                  role="button"
                  aria-label={`Supprimer la réponse ${index + 1}`}
                >
                  <X size={16} color={colors.text.disabled} strokeWidth={2} />
                </View>
              )}
            </XStack>
          ))}
          {options.length < MAX_OPTIONS && (
            <XStack
              alignItems="center"
              justifyContent="center"
              gap={8}
              borderWidth={2}
              borderStyle="dashed"
              borderColor={colors.surface.empty}
              borderRadius={999}
              paddingVertical={12}
              onPress={onAddOption}
              pressStyle={{ scale: 0.98 }}
              role="button"
              aria-label="Ajouter une réponse"
            >
              <Plus size={16} color={colors.text.muted} strokeWidth={2} />
              <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.muted}>
                Ajouter une réponse
              </Text>
            </XStack>
          )}
        </YStack>
      </ScrollView>

      <YStack paddingHorizontal={24} paddingTop={16} paddingBottom={24}>
        <PillButton label="Continuer" onPress={onContinue} disabled={!canContinue} />
      </YStack>
    </YStack>
  );
}

function StepTwo({
  duree,
  onDuree,
  portee,
  onPortee,
  anonyme,
  onAnonyme,
  commentairesActifs,
  onCommentairesActifs,
  onSubmit,
}: {
  duree: SondageDuree;
  onDuree: (d: SondageDuree) => void;
  portee: SondagePortee;
  onPortee: (p: SondagePortee) => void;
  anonyme: boolean;
  onAnonyme: (v: boolean) => void;
  commentairesActifs: boolean;
  onCommentairesActifs: (v: boolean) => void;
  onSubmit: () => void;
}) {
  const colors = useThemeColors();

  return (
    <YStack flex={1}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, gap: 22 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Durée */}
        <YStack gap={10}>
          <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
            Durée
          </Text>
          <XStack gap={8}>
            {DUREES.map((d) => {
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
                  onPress={() => onDuree(d)}
                  role="radio"
                  aria-label={`${d} jours`}
                  aria-selected={isActive}
                >
                  <Text
                    fontFamily="$body"
                    fontSize={14}
                    fontWeight={isActive ? '700' : '500'}
                    color={isActive ? colors.white : colors.text.secondary}
                  >
                    {d} j
                  </Text>
                </View>
              );
            })}
          </XStack>
        </YStack>

        {/* Portée */}
        <YStack gap={10}>
          <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
            Qui peut voter ?
          </Text>
          <XStack backgroundColor={colors.surface.card} borderRadius={999} padding={4}>
            {(
              [
                { key: 'immeuble', label: "Tout l'immeuble" },
                { key: 'etage', label: 'Mon étage' },
              ] as const
            ).map((opt) => {
              const isActive = portee === opt.key;
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
                  onPress={() => onPortee(opt.key)}
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

        {/* Options avancées */}
        <YStack backgroundColor={colors.surface.card} borderRadius={20} padding={18} gap={14}>
          <XStack alignItems="center" gap={12}>
            <YStack flex={1}>
              <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.text.primary}>
                Votes anonymes
              </Text>
            </YStack>
            <Toggle value={anonyme} onValueChange={onAnonyme} aria-label="Votes anonymes" />
          </XStack>
          <View height={1} backgroundColor={colors.surface.empty} />
          <XStack alignItems="center" gap={12}>
            <YStack flex={1}>
              <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.text.primary}>
                Autoriser les commentaires
              </Text>
            </YStack>
            <Toggle
              value={commentairesActifs}
              onValueChange={onCommentairesActifs}
              aria-label="Autoriser les commentaires"
            />
          </XStack>
        </YStack>

        <Text
          fontFamily="$body"
          fontSize={12}
          fontWeight="400"
          color={colors.text.muted}
          lineHeight={18}
        >
          Sans valeur de vote en AG. Le gardien et le syndic y ont accès en lecture.
        </Text>
      </ScrollView>

      <YStack paddingHorizontal={24} paddingTop={16} paddingBottom={24}>
        <PillButton label="Publier le sondage" onPress={onSubmit} />
      </YStack>
    </YStack>
  );
}

function Confirmation({
  dureeJours,
  onVoir,
  onRetour,
}: {
  dureeJours: SondageDuree;
  onVoir: () => void;
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
        Sondage publié
      </Text>
      <Text
        fontFamily="$body"
        fontSize={14}
        fontWeight="400"
        color={colors.text.muted}
        textAlign="center"
        lineHeight={22}
      >
        41 lots ont reçu une notification.{'\n'}Il se clôture automatiquement dans {dureeJours}{' '}
        jours.
      </Text>
      <YStack gap={10} width="100%" marginTop={8}>
        <PillButton label="Voir le sondage" onPress={onVoir} />
        <PillButton label="Retour à Copro" variant="secondary" onPress={onRetour} />
      </YStack>
    </YStack>
  );
}

export default function SondageCreerScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { create } = useSondages();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [question, setQuestion] = useState('');
  const [contexte, setContexte] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [duree, setDuree] = useState<SondageDuree>(7);
  const [portee, setPortee] = useState<SondagePortee>('immeuble');
  const [anonyme, setAnonyme] = useState(false);
  const [commentairesActifs, setCommentairesActifs] = useState(true);

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };
  const handleAddOption = () => {
    setOptions((prev) => (prev.length < MAX_OPTIONS ? [...prev, ''] : prev));
  };
  const handleRemoveOption = (index: number) => {
    setOptions((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handlePublish = () => {
    create({
      question: question.trim(),
      contexte: contexte.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
      dureeJours: duree,
      portee,
      anonyme,
      commentairesActifs,
    });
    setStep(3);
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {step === 3 ? (
          <Confirmation
            dureeJours={duree}
            onVoir={() => router.replace('/sondage-detail')}
            onRetour={() => router.replace('/(app)/copro')}
          />
        ) : (
          <YStack flex={1}>
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={8}>
              <ScreenHeader
                title={step === 1 ? 'Nouveau sondage' : 'Paramètres du sondage'}
                subtitle={`Étape ${step} sur 2`}
                icon={step === 1 ? 'close' : 'back'}
                onBack={() => (step === 1 ? router.replace('/copro') : setStep(1))}
              />
            </YStack>
            <XStack paddingHorizontal={24} paddingTop={8} gap={6}>
              <ProgressSegment filled />
              <ProgressSegment filled={step === 2} />
            </XStack>
            {step === 1 ? (
              <StepOne
                question={question}
                onQuestion={setQuestion}
                contexte={contexte}
                onContexte={setContexte}
                options={options}
                onOptionChange={handleOptionChange}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onContinue={() => setStep(2)}
              />
            ) : (
              <StepTwo
                duree={duree}
                onDuree={setDuree}
                portee={portee}
                onPortee={setPortee}
                anonyme={anonyme}
                onAnonyme={setAnonyme}
                commentairesActifs={commentairesActifs}
                onCommentairesActifs={setCommentairesActifs}
                onSubmit={handlePublish}
              />
            )}
          </YStack>
        )}
      </SafeAreaView>
    </RNView>
  );
}
