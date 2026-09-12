import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  TextInput,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  KeyRound,
  Plus,
  Share2,
  Users,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useAuthStore, type ResidentMatch } from '@/stores/authStore';
import { PillButton } from '@/components/ui/PillButton';

type Step =
  | 'recherche'
  | 'trouve'
  | 'non-trouve'
  | 'code'
  | 'role-apres-code'
  | 'choix-appartement'
  | 'creer'
  | 'code-partage'
  | 'bienvenue';

type RoleChoice = 'coproprietaire' | 'locataire';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCode(): string {
  return Array.from(
    { length: 6 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
  ).join('');
}

function StepHeader({
  title,
  onBack,
  progress,
}: {
  title: string;
  onBack?: () => void;
  progress?: { step: number; total: number };
}) {
  const colors = useThemeColors();
  return (
    <YStack paddingHorizontal={24} paddingTop={20} gap={12}>
      {onBack && (
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
      )}
      {progress && (
        <XStack gap={6}>
          {Array.from({ length: progress.total }).map((_, i) => (
            <View
              key={i}
              flex={1}
              height={4}
              borderRadius={2}
              backgroundColor={i < progress.step ? colors.primary[500] : colors.surface.empty}
            />
          ))}
        </XStack>
      )}
      <Text
        fontFamily="$heading"
        fontSize={28}
        fontWeight="800"
        letterSpacing={-0.7}
        color={colors.text.primary}
        marginTop={onBack ? 12 : 4}
      >
        {title}
      </Text>
    </YStack>
  );
}

/** Étape 1 : recherche automatique du logement (checklist animée). */
function StepRecherche() {
  const colors = useThemeColors();
  const [checked, setChecked] = useState(0);
  const items = [
    'Email vérifié',
    'Consultation des syndics partenaires',
    'Rattachement de votre logement',
  ];

  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setChecked((c) => Math.max(c, i + 1)), 350 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap={20} paddingHorizontal={32}>
      <View
        width={96}
        height={96}
        borderRadius={48}
        backgroundColor={colors.primary[50]}
        alignItems="center"
        justifyContent="center"
      >
        <Building2 size={40} color={colors.primary[500]} strokeWidth={1.8} />
      </View>
      <Text
        fontFamily="$heading"
        fontSize={22}
        fontWeight="800"
        color={colors.text.primary}
        textAlign="center"
      >
        Recherche de votre{'\n'}copropriété
      </Text>
      <YStack gap={12} width="100%" marginTop={8}>
        {items.map((label, i) => (
          <XStack key={label} alignItems="center" gap={10}>
            <View
              width={22}
              height={22}
              borderRadius={11}
              alignItems="center"
              justifyContent="center"
              backgroundColor={checked > i ? colors.primary[500] : colors.surface.empty}
            >
              {checked > i && <Check size={12} color={colors.white} strokeWidth={3} />}
            </View>
            <Text fontFamily="$body" fontSize={14} fontWeight="500" color={colors.text.secondary}>
              {label}
            </Text>
          </XStack>
        ))}
      </YStack>
      <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
        Cela prend quelques secondes
      </Text>
    </YStack>
  );
}

/** Étape 2a : correspondance trouvée, confirmation. */
function StepTrouve({
  match,
  onConfirm,
  onReject,
  isConfirming,
}: {
  match: ResidentMatch;
  onConfirm: () => void;
  onReject: () => void;
  isConfirming: boolean;
}) {
  const colors = useThemeColors();
  return (
    <YStack flex={1}>
      <YStack alignItems="center" paddingTop={40} paddingHorizontal={32} gap={16}>
        <View
          width={72}
          height={72}
          borderRadius={36}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Check size={32} color={colors.primary[500]} strokeWidth={2.5} />
        </View>
        <Text
          fontFamily="$heading"
          fontSize={24}
          fontWeight="800"
          color={colors.text.primary}
          textAlign="center"
        >
          Nous avons trouvé votre logement
        </Text>
        <Text
          fontFamily="$body"
          fontSize={14}
          fontWeight="400"
          color={colors.text.muted}
          textAlign="center"
        >
          Déclaré par votre syndic. Vérifiez que tout est exact avant de continuer.
        </Text>
      </YStack>

      <YStack paddingHorizontal={24} paddingTop={28} gap={16} flex={1}>
        <YStack backgroundColor={colors.surface.card} borderRadius={20} padding={18} gap={14}>
          <XStack alignItems="center" gap={12}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor={colors.primary[50]}
              alignItems="center"
              justifyContent="center"
            >
              <Building2 size={18} color={colors.primary[500]} strokeWidth={1.8} />
            </View>
            <YStack flex={1}>
              <Text
                fontFamily="$heading"
                fontSize={15}
                fontWeight="700"
                color={colors.text.primary}
              >
                {match.building_name}
              </Text>
              {match.building_address && (
                <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
                  {match.building_address}
                </Text>
              )}
            </YStack>
          </XStack>

          <XStack justifyContent="space-between">
            <YStack>
              <Text
                fontFamily="$body"
                fontSize={11}
                fontWeight="600"
                color={colors.text.muted}
                textTransform="uppercase"
              >
                Logement
              </Text>
              <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.primary}>
                {match.lot ?? '—'}
                {match.etage != null ? ` · ${match.etage}e étage` : ''}
              </Text>
            </YStack>
            <YStack alignItems="flex-end">
              <Text
                fontFamily="$body"
                fontSize={11}
                fontWeight="600"
                color={colors.text.muted}
                textTransform="uppercase"
              >
                Statut
              </Text>
              <Text fontFamily="$body" fontSize={13} fontWeight="600" color={colors.text.primary}>
                {match.role === 'coproprietaire' ? 'Copropriétaire' : 'Locataire'}
              </Text>
            </YStack>
          </XStack>

          {match.syndic_name && (
            <XStack
              alignItems="center"
              gap={8}
              backgroundColor={colors.primary[50]}
              borderRadius={999}
              paddingVertical={6}
              paddingHorizontal={12}
              alignSelf="flex-start"
            >
              <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.primary[700]}>
                Géré par {match.syndic_name}
              </Text>
            </XStack>
          )}
        </YStack>
      </YStack>

      <YStack paddingHorizontal={24} paddingBottom={32} gap={10}>
        <PillButton
          label={isConfirming ? 'Confirmation…' : "C'est bien mon logement"}
          disabled={isConfirming}
          onPress={onConfirm}
        />
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="500"
          color={colors.text.muted}
          textAlign="center"
          pressStyle={{ opacity: 0.6 }}
          onPress={onReject}
          role="button"
          aria-label="Ce n'est pas ma copropriété"
        >
          Ce n'est pas ma copropriété
        </Text>
      </YStack>
    </YStack>
  );
}

/** Étape 2b : aucune correspondance — code immeuble (conseillé) ou création. */
function StepNonTrouve({
  email,
  onCode,
  onCreate,
  onSkip,
}: {
  email: string;
  onCode: () => void;
  onCreate: () => void;
  onSkip: () => void;
}) {
  const colors = useThemeColors();
  return (
    <YStack flex={1} justifyContent="center" paddingHorizontal={24} gap={16}>
      <YStack gap={6} marginBottom={12}>
        <Text
          fontFamily="$heading"
          fontSize={26}
          fontWeight="800"
          letterSpacing={-0.6}
          color={colors.text.primary}
        >
          Aucune correspondance
        </Text>
        <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.text.muted}>
          Aucun syndic n'a déclaré <Text fontWeight="600">{email}</Text>. Deux options pour la
          rejoindre :
        </Text>
      </YStack>

      <XStack
        alignItems="center"
        gap={14}
        backgroundColor={colors.primary[50]}
        borderWidth={2}
        borderColor={colors.primary[200]}
        borderRadius={22}
        padding={18}
        pressStyle={{ scale: 0.98 }}
        onPress={onCode}
        role="button"
        aria-label="Saisir un code immeuble"
      >
        <View
          width={44}
          height={44}
          borderRadius={22}
          backgroundColor={colors.white}
          alignItems="center"
          justifyContent="center"
        >
          <KeyRound size={20} color={colors.primary[500]} strokeWidth={1.8} />
        </View>
        <YStack flex={1}>
          <XStack alignItems="center" gap={8}>
            <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
              Saisir un code immeuble
            </Text>
            <View
              backgroundColor={colors.primary[500]}
              borderRadius={999}
              paddingHorizontal={8}
              paddingVertical={2}
            >
              <Text fontFamily="$body" fontSize={10} fontWeight="700" color={colors.white}>
                CONSEILLÉ
              </Text>
            </View>
          </XStack>
          <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
            Votre syndic ou un voisin vous transmet un code à 6 caractères.
          </Text>
        </YStack>
      </XStack>

      <XStack
        alignItems="center"
        gap={14}
        backgroundColor={colors.surface.card}
        borderRadius={22}
        padding={18}
        pressStyle={{ scale: 0.98 }}
        onPress={onCreate}
        role="button"
        aria-label="Créer ma copropriété"
      >
        <View
          width={44}
          height={44}
          borderRadius={22}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Plus size={20} color={colors.primary[500]} strokeWidth={1.8} />
        </View>
        <YStack flex={1}>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            Créer ma copropriété
          </Text>
          <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.text.muted}>
            Vous êtes le premier de l'immeuble sur Imméo. 2 minutes, puis invitez vos voisins.
          </Text>
        </YStack>
      </XStack>

      <XStack alignItems="flex-start" gap={10} marginTop={8}>
        <AlertTriangle size={14} color={colors.text.disabled} strokeWidth={2} />
        <Text
          flex={1}
          fontFamily="$body"
          fontSize={12}
          fontWeight="400"
          color={colors.text.muted}
          pressStyle={{ opacity: 0.6 }}
          onPress={onSkip}
          role="button"
          aria-label="Continuer sans copropriété"
        >
          Vous pouvez aussi continuer sans copropriété et la rejoindre plus tard depuis votre
          profil.
        </Text>
      </XStack>
    </YStack>
  );
}

/** Étape 3 : saisie du code immeuble à 6 caractères. */
function StepCode({
  onBack,
  onJoin,
  isJoining,
  error,
}: {
  onBack: () => void;
  onJoin: (code: string) => void;
  isJoining: boolean;
  error: string | null;
}) {
  const colors = useThemeColors();
  const [code, setCode] = useState('');
  const canSubmit = code.trim().length === 6 && !isJoining;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <YStack flex={1}>
        <StepHeader title="Votre code immeuble" onBack={onBack} />
        <YStack paddingHorizontal={24} paddingVertical={28} gap={12}>
          <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.text.muted}>
            6 caractères, transmis par votre syndic ou affiché dans le hall.
          </Text>
          <TextInput
            placeholder="A4B7K9"
            placeholderTextColor={colors.text.disabled}
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase().slice(0, 6))}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            aria-label="Code immeuble"
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
          {error && (
            <Text
              fontFamily="$body"
              fontSize={13}
              fontWeight="500"
              color={colors.danger}
              textAlign="center"
            >
              {error}
            </Text>
          )}
        </YStack>
        <YStack flex={1} />
        <YStack paddingHorizontal={24} paddingBottom={40}>
          <PillButton
            label={isJoining ? 'Recherche…' : 'Rejoindre la copropriété'}
            disabled={!canSubmit}
            onPress={() => onJoin(code)}
          />
        </YStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}

/** Étape 4 : après un code validé, préciser le rôle (pas de correspondance email). */
function StepRoleApresCode({
  buildingName,
  onSelect,
  isSubmitting,
}: {
  buildingName: string;
  onSelect: (role: RoleChoice) => void;
  isSubmitting: boolean;
}) {
  const colors = useThemeColors();
  return (
    <YStack flex={1} justifyContent="center" paddingHorizontal={24} gap={16}>
      <YStack gap={6} marginBottom={12}>
        <Text
          fontFamily="$heading"
          fontSize={26}
          fontWeight="800"
          letterSpacing={-0.6}
          color={colors.text.primary}
        >
          Vous êtes...
        </Text>
        <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.text.muted}>
          pour {buildingName}, afin d'adapter votre accès.
        </Text>
      </YStack>
      {(['coproprietaire', 'locataire'] as const).map((role) => (
        <XStack
          key={role}
          alignItems="center"
          gap={14}
          backgroundColor={colors.surface.card}
          borderRadius={22}
          padding={18}
          pressStyle={{ scale: 0.98 }}
          onPress={() => !isSubmitting && onSelect(role)}
          role="button"
          aria-label={role === 'coproprietaire' ? 'Copropriétaire' : 'Locataire'}
        >
          <View
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor={colors.primary[50]}
            alignItems="center"
            justifyContent="center"
          >
            <Users size={20} color={colors.primary[500]} strokeWidth={1.8} />
          </View>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            {role === 'coproprietaire' ? 'Copropriétaire' : 'Locataire'}
          </Text>
          <View flex={1} />
          <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
        </XStack>
      ))}
    </YStack>
  );
}

/** Étape 5 (locataire uniquement) : choix de l'appartement. */
function StepChoixAppartement({
  onBack,
  apartments,
  isLoading,
  onSelect,
  isSubmitting,
}: {
  onBack: () => void;
  apartments: { id: string; numero: string; etage: number | null }[];
  isLoading: boolean;
  onSelect: (apartmentId: string) => void;
  isSubmitting: boolean;
}) {
  const colors = useThemeColors();
  return (
    <YStack flex={1}>
      <StepHeader title="Votre appartement" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, gap: 8 }}>
        {isLoading && (
          <Text fontFamily="$body" fontSize={14} color={colors.text.muted}>
            Chargement…
          </Text>
        )}
        {!isLoading && apartments.length === 0 && (
          <Text fontFamily="$body" fontSize={14} color={colors.text.muted}>
            Aucun appartement trouvé pour cet immeuble.
          </Text>
        )}
        {apartments.map((apt) => (
          <XStack
            key={apt.id}
            alignItems="center"
            justifyContent="space-between"
            backgroundColor={colors.surface.card}
            borderRadius={16}
            paddingVertical={14}
            paddingHorizontal={18}
            pressStyle={{ scale: 0.98 }}
            onPress={() => !isSubmitting && onSelect(apt.id)}
            role="button"
            aria-label={apt.numero}
          >
            <Text fontFamily="$heading" fontSize={14} fontWeight="700" color={colors.text.primary}>
              {apt.numero}
            </Text>
            {apt.etage != null && (
              <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
                {apt.etage}e étage
              </Text>
            )}
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
}

/** Étape 6a (créer, mock) : informations + rôle. */
function StepCreate({
  onBack,
  onCreate,
}: {
  onBack: () => void;
  onCreate: (name: string, address: string, role: RoleChoice) => void;
}) {
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<RoleChoice>('coproprietaire');
  const canSubmit = name.trim().length > 0 && address.trim().length > 0;

  const inputStyle = {
    backgroundColor: colors.surface.card,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 22,
    fontFamily: 'InterMedium',
    fontSize: 14,
    color: colors.text.primary,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <YStack flex={1}>
          <StepHeader title="Votre copropriété" onBack={onBack} progress={{ step: 1, total: 2 }} />
          <Text
            fontFamily="$body"
            fontSize={13}
            fontWeight="400"
            color={colors.text.muted}
            paddingHorizontal={24}
            marginTop={4}
          >
            Ces informations seront visibles par les voisins qui rejoindront l'immeuble.
          </Text>
          <YStack paddingHorizontal={24} paddingVertical={24} gap={12}>
            <TextInput
              placeholder="Nom de la copropriété"
              placeholderTextColor={colors.text.disabled}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              aria-label="Nom de la copropriété"
              style={inputStyle}
            />
            <TextInput
              placeholder="Adresse"
              placeholderTextColor={colors.text.disabled}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="sentences"
              aria-label="Adresse"
              style={inputStyle}
            />
            <XStack gap={12}>
              <TextInput
                placeholder="Code postal"
                placeholderTextColor={colors.text.disabled}
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="number-pad"
                aria-label="Code postal"
                style={[inputStyle, { flex: 1 }]}
              />
              <TextInput
                placeholder="Ville"
                placeholderTextColor={colors.text.disabled}
                value={city}
                onChangeText={setCity}
                autoCapitalize="words"
                aria-label="Ville"
                style={[inputStyle, { flex: 1 }]}
              />
            </XStack>

            <YStack gap={8} marginTop={8}>
              <Text
                fontFamily="$heading"
                fontSize={13}
                fontWeight="700"
                color={colors.text.primary}
              >
                Vous êtes
              </Text>
              <XStack backgroundColor={colors.surface.card} borderRadius={999} padding={4}>
                {(['coproprietaire', 'locataire'] as const).map((r) => {
                  const isActive = role === r;
                  return (
                    <View
                      key={r}
                      flex={1}
                      paddingVertical={10}
                      borderRadius={999}
                      alignItems="center"
                      backgroundColor={isActive ? colors.white : 'transparent'}
                      borderWidth={isActive ? 1 : 0}
                      borderColor={colors.primary[200]}
                      onPress={() => setRole(r)}
                      role="radio"
                      aria-label={r === 'coproprietaire' ? 'Copropriétaire' : 'Locataire'}
                      aria-selected={isActive}
                    >
                      <Text
                        fontFamily="$body"
                        fontSize={13}
                        fontWeight={isActive ? '600' : '500'}
                        color={isActive ? colors.primary[500] : colors.text.muted}
                      >
                        {r === 'coproprietaire' ? 'Copropriétaire' : 'Locataire'}
                      </Text>
                    </View>
                  );
                })}
              </XStack>
            </YStack>
          </YStack>
          <YStack flex={1} />
          <YStack paddingHorizontal={24} paddingBottom={40}>
            <PillButton
              label="Créer la copropriété"
              disabled={!canSubmit}
              onPress={() => onCreate(name.trim(), address.trim(), role)}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Étape 6b (créer, mock) : code généré, copier/partager. */
function StepCodePartage({
  buildingName,
  code,
  onInvite,
  onLater,
}: {
  buildingName: string;
  code: string;
  onInvite: () => void;
  onLater: () => void;
}) {
  const colors = useThemeColors();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    Share.share({
      message: `Rejoins ${buildingName} sur Imméo avec le code ${code}`,
    });
  };

  return (
    <YStack flex={1}>
      <StepHeader title="" progress={{ step: 2, total: 2 }} />
      <YStack flex={1} alignItems="center" justifyContent="center" gap={18} paddingHorizontal={32}>
        <View
          width={72}
          height={72}
          borderRadius={36}
          backgroundColor={colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <Check size={32} color={colors.primary[500]} strokeWidth={2.5} />
        </View>
        <Text
          fontFamily="$heading"
          fontSize={22}
          fontWeight="800"
          color={colors.text.primary}
          textAlign="center"
        >
          {buildingName} est en ligne
        </Text>
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="400"
          color={colors.text.muted}
          textAlign="center"
        >
          Partagez ce code avec vos voisins : il leur suffit de le saisir à l'inscription.
        </Text>

        <YStack
          backgroundColor={colors.primary[50]}
          borderRadius={20}
          paddingVertical={20}
          paddingHorizontal={28}
          alignItems="center"
          gap={12}
          width="100%"
        >
          <Text
            fontFamily="$body"
            fontSize={11}
            fontWeight="600"
            color={colors.primary[600]}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Code immeuble
          </Text>
          <Text
            fontFamily="$heading"
            fontSize={26}
            fontWeight="800"
            letterSpacing={6}
            color={colors.primary[900]}
          >
            {code}
          </Text>
          <XStack gap={10}>
            <XStack
              alignItems="center"
              gap={6}
              backgroundColor={colors.white}
              borderRadius={999}
              paddingVertical={8}
              paddingHorizontal={14}
              pressStyle={{ scale: 0.95 }}
              onPress={handleCopy}
              role="button"
              aria-label="Copier le code"
            >
              {copied ? (
                <Check size={13} color={colors.primary[500]} strokeWidth={2.5} />
              ) : (
                <Copy size={13} color={colors.primary[500]} strokeWidth={2} />
              )}
              <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.primary[500]}>
                {copied ? 'Copié' : 'Copier'}
              </Text>
            </XStack>
            <XStack
              alignItems="center"
              gap={6}
              backgroundColor={colors.white}
              borderRadius={999}
              paddingVertical={8}
              paddingHorizontal={14}
              pressStyle={{ scale: 0.95 }}
              onPress={handleShare}
              role="button"
              aria-label="Partager le code"
            >
              <Share2 size={13} color={colors.primary[500]} strokeWidth={2} />
              <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.primary[500]}>
                Partager
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </YStack>

      <YStack paddingHorizontal={24} paddingBottom={32} gap={10}>
        <PillButton label="Inviter mes voisins" onPress={onInvite} />
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="500"
          color={colors.text.muted}
          textAlign="center"
          pressStyle={{ opacity: 0.6 }}
          onPress={onLater}
          role="button"
          aria-label="Plus tard"
        >
          Plus tard
        </Text>
      </YStack>
    </YStack>
  );
}

/** Étape finale : bienvenue. */
function StepBienvenue({
  buildingName,
  lot,
  onEnter,
}: {
  buildingName: string;
  lot?: string | null;
  onEnter: () => void;
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
          <KeyRound size={40} color={colors.primary[500]} strokeWidth={2} />
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
        Votre compte est rattaché {lot ? `à l'${lot} de ` : 'à '}
        <Text fontSize={15} fontWeight="700" color={colors.text.primary}>
          {buildingName}
        </Text>
        .
      </Text>
      <View
        backgroundColor={colors.primary[500]}
        borderRadius={999}
        paddingVertical={16}
        paddingHorizontal={44}
        marginTop={8}
        pressStyle={{ scale: 0.97 }}
        onPress={onEnter}
        role="button"
        aria-label="Entrer dans l'app"
      >
        <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.white}>
          Entrer dans l'app
        </Text>
      </View>
    </YStack>
  );
}

export default function CoproSetupScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);
  const searchMatch = useAuthStore((s) => s.searchMatch);
  const confirmMatch = useAuthStore((s) => s.confirmMatch);
  const joinByCode = useAuthStore((s) => s.joinByCode);
  const listApartments = useAuthStore((s) => s.listApartments);
  const joinAsCoproprietaire = useAuthStore((s) => s.joinAsCoproprietaire);
  const joinAsLocataire = useAuthStore((s) => s.joinAsLocataire);
  const setCopropriete = useAuthStore((s) => s.setCopropriete);
  const skipOnboarding = useAuthStore((s) => s.skipOnboarding);

  const [step, setStep] = useState<Step>('recherche');
  const [match, setMatch] = useState<ResidentMatch | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [joinedCopro, setJoinedCopro] = useState<{ id: string; nom: string } | null>(null);
  const [apartments, setApartments] = useState<
    { id: string; numero: string; etage: number | null }[]
  >([]);
  const [apartmentsLoading, setApartmentsLoading] = useState(false);
  const [mockResult, setMockResult] = useState<{ id: string; name: string; code: string } | null>(
    null,
  );
  const [welcome, setWelcome] = useState<{ name: string; lot?: string | null }>({ name: '' });

  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1100));
    Promise.all([searchMatch(), minDelay]).then(([result]) => {
      if (cancelled) return;
      if (result) {
        setMatch(result);
        setStep('trouve');
      } else {
        setStep('non-trouve');
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmMatch = async () => {
    setIsBusy(true);
    const ok = await confirmMatch();
    setIsBusy(false);
    if (ok && match) {
      setWelcome({ name: match.building_name, lot: match.lot });
      setStep('bienvenue');
    } else {
      setStep('non-trouve');
    }
  };

  const handleJoinByCode = async (code: string) => {
    setIsBusy(true);
    setCodeError(null);
    const found = await joinByCode(code);
    setIsBusy(false);
    if (!found) {
      setCodeError('Code invalide. Vérifiez et réessayez.');
      return;
    }
    setJoinedCopro(found);
    setStep('role-apres-code');
  };

  const handleRoleAfterCode = async (role: RoleChoice) => {
    if (!joinedCopro) return;
    setIsBusy(true);
    if (role === 'coproprietaire') {
      await joinAsCoproprietaire(joinedCopro.id);
      setIsBusy(false);
      setWelcome({ name: joinedCopro.nom });
      setStep('bienvenue');
      return;
    }
    setApartmentsLoading(true);
    const apts = await listApartments(joinedCopro.id);
    setApartments(apts);
    setApartmentsLoading(false);
    setIsBusy(false);
    setStep('choix-appartement');
  };

  const handleSelectApartment = async (apartmentId: string) => {
    if (!joinedCopro) return;
    setIsBusy(true);
    await joinAsLocataire(apartmentId);
    setIsBusy(false);
    const apt = apartments.find((a) => a.id === apartmentId);
    setWelcome({ name: joinedCopro.nom, lot: apt?.numero });
    setStep('bienvenue');
  };

  const handleCreate = (name: string, _address: string, _role: RoleChoice) => {
    const code = generateCode();
    setMockResult({ id: `copro-${code.toLowerCase()}`, name, code });
    setStep('code-partage');
  };

  const handleFinishCreate = () => {
    if (mockResult) setCopropriete(mockResult.id);
    setWelcome({ name: mockResult?.name ?? '' });
    setStep('bienvenue');
  };

  const handleSkip = () => {
    skipOnboarding();
    router.replace('/(app)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        {step === 'recherche' && <StepRecherche />}
        {step === 'trouve' && match && (
          <StepTrouve
            match={match}
            isConfirming={isBusy}
            onConfirm={handleConfirmMatch}
            onReject={() => setStep('non-trouve')}
          />
        )}
        {step === 'non-trouve' && (
          <StepNonTrouve
            email={user?.email ?? ''}
            onCode={() => setStep('code')}
            onCreate={() => setStep('creer')}
            onSkip={handleSkip}
          />
        )}
        {step === 'code' && (
          <StepCode
            onBack={() => setStep('non-trouve')}
            onJoin={handleJoinByCode}
            isJoining={isBusy}
            error={codeError}
          />
        )}
        {step === 'role-apres-code' && joinedCopro && (
          <StepRoleApresCode
            buildingName={joinedCopro.nom}
            onSelect={handleRoleAfterCode}
            isSubmitting={isBusy}
          />
        )}
        {step === 'choix-appartement' && (
          <StepChoixAppartement
            onBack={() => setStep('role-apres-code')}
            apartments={apartments}
            isLoading={apartmentsLoading}
            onSelect={handleSelectApartment}
            isSubmitting={isBusy}
          />
        )}
        {step === 'creer' && (
          <StepCreate onBack={() => setStep('non-trouve')} onCreate={handleCreate} />
        )}
        {step === 'code-partage' && mockResult && (
          <StepCodePartage
            buildingName={mockResult.name}
            code={mockResult.code}
            onInvite={handleFinishCreate}
            onLater={handleFinishCreate}
          />
        )}
        {step === 'bienvenue' && (
          <StepBienvenue
            buildingName={welcome.name}
            lot={welcome.lot}
            onEnter={() => router.replace('/(app)')}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
