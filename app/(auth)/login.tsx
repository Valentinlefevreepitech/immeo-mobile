import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Building2,
  UserPlus,
  Sparkles,
  KeyRound,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

const HERO_BG = '#111111';

/* ── Validation helpers ── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Veuillez saisir votre adresse email.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Adresse email invalide.';
  return null;
}

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

function validatePassword(password: string): string | null {
  if (!password) return 'Veuillez saisir un mot de passe.';
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caracteres.';
  return null;
}

function validateRegisterPassword(password: string): string | null {
  if (!password) return 'Veuillez saisir un mot de passe.';
  const { checks } = getPasswordStrength(password);
  if (!checks.length) return 'Le mot de passe doit contenir au moins 8 caracteres.';
  if (!checks.uppercase) return 'Le mot de passe doit contenir au moins une majuscule.';
  if (!checks.number) return 'Le mot de passe doit contenir au moins un chiffre.';
  return null;
}

type AuthTab = 'login' | 'register';

/* ── Decorative grid squares ── */
function DecoSquares() {
  const rows = 5;
  const cols = 4;
  const size = 18;
  const gap = 10;

  return (
    <View position="absolute" top={30} right={20} opacity={0.35}>
      {Array.from({ length: rows }).map((_, row) => (
        <XStack key={row} gap={gap} marginBottom={gap}>
          {Array.from({ length: cols }).map((_, col) => {
            const distance = (row + col) / (rows + cols - 2);
            const opacity = Math.max(0.08, 1 - distance * 1.2);
            return (
              <View
                key={col}
                width={size}
                height={size}
                borderRadius={5}
                backgroundColor={colors.primary[400]}
                opacity={opacity}
              />
            );
          })}
        </XStack>
      ))}
    </View>
  );
}

/* ── Input field with icon (native TextInput) ── */
function InputField({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  showToggle,
  onToggle,
  keyboardType,
  autoCapitalize,
  onSubmitEditing,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  onSubmitEditing?: () => void;
}) {
  return (
    <View
      backgroundColor={colors.gray[50]}
      borderRadius={16}
      paddingLeft={16}
      paddingRight={showToggle ? 8 : 16}
      paddingVertical={10}
      flexDirection="row"
      alignItems="center"
      gap={14}
    >
      <View
        width={36}
        height={36}
        borderRadius={10}
        backgroundColor={colors.gray[100]}
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </View>
      <YStack flex={1} gap={2}>
        <Text fontFamily="$body" fontSize={11} fontWeight="400" color={colors.gray[500]}>
          {label}
        </Text>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.gray[500]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'sentences'}
          onSubmitEditing={onSubmitEditing}
          aria-label={label}
          style={{
            fontFamily: 'Inter',
            fontSize: 15,
            fontWeight: '500',
            color: colors.gray[900],
            height: 28,
            padding: 0,
          }}
        />
      </YStack>
      {showToggle && (
        <View
          width={40}
          height={40}
          borderRadius={12}
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.5 }}
          onPress={onToggle}
          role="button"
          aria-label={secureTextEntry ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
        >
          {secureTextEntry ? (
            <Eye size={20} color={colors.gray[400]} />
          ) : (
            <EyeOff size={20} color={colors.gray[400]} />
          )}
        </View>
      )}
    </View>
  );
}

/* ── Tab toggle ── */
function AuthTabs({ active, onSwitch }: { active: AuthTab; onSwitch: (tab: AuthTab) => void }) {
  return (
    <XStack backgroundColor={colors.gray[100]} borderRadius={14} padding={4} role="tablist">
      <View
        flex={1}
        paddingVertical={12}
        borderRadius={11}
        backgroundColor={active === 'login' ? colors.white : 'transparent'}
        alignItems="center"
        {...(active === 'login'
          ? {
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }
          : {})}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => onSwitch('login')}
        role="tab"
        aria-label="Connexion"
        aria-selected={active === 'login'}
      >
        <Text
          fontFamily="$body"
          fontSize={14}
          fontWeight={active === 'login' ? '600' : '400'}
          color={active === 'login' ? colors.gray[900] : colors.gray[500]}
        >
          Connexion
        </Text>
      </View>
      <View
        flex={1}
        paddingVertical={12}
        borderRadius={11}
        backgroundColor={active === 'register' ? colors.white : 'transparent'}
        alignItems="center"
        {...(active === 'register'
          ? {
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }
          : {})}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => onSwitch('register')}
        role="tab"
        aria-label="Inscription"
        aria-selected={active === 'register'}
      >
        <Text
          fontFamily="$body"
          fontSize={14}
          fontWeight={active === 'register' ? '600' : '400'}
          color={active === 'register' ? colors.gray[900] : colors.gray[500]}
        >
          Inscription
        </Text>
      </View>
    </XStack>
  );
}

/* ── Divider with text ── */
function DividerText({ text }: { text: string }) {
  return (
    <XStack alignItems="center" gap={12}>
      <View flex={1} height={1} backgroundColor={colors.gray[200]} />
      <Text fontFamily="$body" fontSize={12} fontWeight="400" color={colors.gray[400]}>
        {text}
      </Text>
      <View flex={1} height={1} backgroundColor={colors.gray[200]} />
    </XStack>
  );
}

/* ── Login form ── */
function LoginForm() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleLogin() {
    if (isLoading) return;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }

    setErrors({});
    const result = await login(email.trim(), password);
    if (!result.success) {
      Alert.alert('Erreur', result.error);
    }
  }

  return (
    <YStack gap={20}>
      <YStack gap={4}>
        <InputField
          icon={<Mail size={18} color={colors.gray[400]} />}
          label="Adresse email"
          placeholder="votre@email.com"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setErrors((e) => ({ ...e, email: undefined }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text fontFamily="$body" fontSize={12} color={colors.danger} marginLeft={4}>
            {errors.email}
          </Text>
        )}
      </YStack>

      <YStack gap={4}>
        <InputField
          icon={<Lock size={18} color={colors.gray[400]} />}
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setErrors((e) => ({ ...e, password: undefined }));
          }}
          secureTextEntry={!showPassword}
          showToggle
          onToggle={() => setShowPassword(!showPassword)}
          onSubmitEditing={handleLogin}
        />
        {errors.password && (
          <Text fontFamily="$body" fontSize={12} color={colors.danger} marginLeft={4}>
            {errors.password}
          </Text>
        )}
      </YStack>

      <XStack justifyContent="flex-end">
        <Text
          fontFamily="$body"
          fontSize={13}
          fontWeight="500"
          color={colors.primary[500]}
          pressStyle={{ opacity: 0.6 }}
          onPress={() =>
            Alert.alert('Mot de passe oublie', 'Un email de reinitialisation vous sera envoye.')
          }
          role="link"
          aria-label="Mot de passe oublie"
        >
          Mot de passe oublie ?
        </Text>
      </XStack>

      <PrimaryButton
        label="Se connecter"
        loadingLabel="Connexion..."
        isLoading={isLoading}
        onPress={handleLogin}
      />
    </YStack>
  );
}

/* ── Register form ── */
function RegisterForm() {
  const { register, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const strength = getPasswordStrength(password);
  const strengthLabel =
    strength.score <= 1
      ? 'Faible'
      : strength.score <= 2
        ? 'Moyen'
        : strength.score <= 3
          ? 'Bon'
          : 'Fort';
  const strengthColor =
    strength.score <= 1
      ? colors.danger
      : strength.score <= 2
        ? colors.warning
        : strength.score <= 3
          ? colors.primary[400]
          : colors.primary[500];

  async function handleRegister() {
    if (isLoading) return;

    const nameError = !fullName.trim() ? 'Veuillez saisir votre nom.' : null;
    const emailError = validateEmail(email);
    const passwordError = validateRegisterPassword(password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError ?? undefined,
        email: emailError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }

    setErrors({});
    const result = await register(fullName.trim(), email.trim(), password);
    if (!result.success) {
      Alert.alert('Erreur', result.error);
    }
  }

  return (
    <YStack gap={20}>
      <YStack gap={4}>
        <InputField
          icon={<User size={18} color={colors.gray[400]} />}
          label="Nom complet"
          placeholder="Prenom Nom"
          value={fullName}
          onChangeText={(t) => {
            setFullName(t);
            setErrors((e) => ({ ...e, name: undefined }));
          }}
          autoCapitalize="words"
        />
        {errors.name && (
          <Text fontFamily="$body" fontSize={12} color={colors.danger} marginLeft={4}>
            {errors.name}
          </Text>
        )}
      </YStack>

      <YStack gap={4}>
        <InputField
          icon={<Mail size={18} color={colors.gray[400]} />}
          label="Adresse email"
          placeholder="votre@email.com"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setErrors((e) => ({ ...e, email: undefined }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text fontFamily="$body" fontSize={12} color={colors.danger} marginLeft={4}>
            {errors.email}
          </Text>
        )}
      </YStack>

      <YStack gap={4}>
        <InputField
          icon={<Lock size={18} color={colors.gray[400]} />}
          label="Mot de passe"
          placeholder="Minimum 8 caracteres"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setErrors((e) => ({ ...e, password: undefined }));
          }}
          secureTextEntry={!showPassword}
          showToggle
          onToggle={() => setShowPassword(!showPassword)}
          onSubmitEditing={handleRegister}
        />
        {errors.password && (
          <Text fontFamily="$body" fontSize={12} color={colors.danger} marginLeft={4}>
            {errors.password}
          </Text>
        )}
      </YStack>

      {password.length > 0 && (
        <YStack gap={6} marginTop={-12}>
          <XStack gap={6} alignItems="center">
            {[1, 2, 3, 4].map((level) => (
              <View
                key={level}
                flex={1}
                height={4}
                borderRadius={2}
                backgroundColor={strength.score >= level ? strengthColor : colors.gray[200]}
              />
            ))}
            <Text
              fontFamily="$body"
              fontSize={11}
              fontWeight="500"
              color={strengthColor}
              marginLeft={4}
            >
              {strengthLabel}
            </Text>
          </XStack>
          <XStack gap={8} flexWrap="wrap">
            <Text
              fontFamily="$body"
              fontSize={10}
              color={strength.checks.length ? colors.primary[500] : colors.gray[400]}
            >
              {strength.checks.length ? '✓' : '○'} 8+ caracteres
            </Text>
            <Text
              fontFamily="$body"
              fontSize={10}
              color={strength.checks.uppercase ? colors.primary[500] : colors.gray[400]}
            >
              {strength.checks.uppercase ? '✓' : '○'} Majuscule
            </Text>
            <Text
              fontFamily="$body"
              fontSize={10}
              color={strength.checks.number ? colors.primary[500] : colors.gray[400]}
            >
              {strength.checks.number ? '✓' : '○'} Chiffre
            </Text>
            <Text
              fontFamily="$body"
              fontSize={10}
              color={strength.checks.special ? colors.primary[500] : colors.gray[400]}
            >
              {strength.checks.special ? '✓' : '○'} Special
            </Text>
          </XStack>
        </YStack>
      )}

      <XStack
        alignItems="flex-start"
        gap={10}
        backgroundColor={colors.primary[50]}
        borderRadius={16}
        padding={14}
      >
        <Sparkles size={16} color={colors.primary[500]} strokeWidth={2} style={{ marginTop: 1 }} />
        <Text
          fontFamily="$body"
          fontSize={12}
          fontWeight="500"
          color={colors.primary[700]}
          flex={1}
        >
          Votre logement est retrouvé automatiquement. Aucun code à saisir.
        </Text>
      </XStack>

      <Text
        fontFamily="$body"
        fontSize={12}
        fontWeight="400"
        color={colors.gray[400]}
        textAlign="center"
        lineHeight={18}
      >
        En vous inscrivant, vous acceptez les{' '}
        <Text
          color={colors.primary[500]}
          fontWeight="500"
          pressStyle={{ opacity: 0.6 }}
          onPress={() => Alert.alert('CGU', 'Les conditions generales seront bientot disponibles.')}
          role="link"
          aria-label="Conditions generales d'utilisation"
        >
          conditions generales
        </Text>{' '}
        et la{' '}
        <Text
          color={colors.primary[500]}
          fontWeight="500"
          pressStyle={{ opacity: 0.6 }}
          onPress={() =>
            Alert.alert(
              'Confidentialite',
              'La politique de confidentialite sera bientot disponible.',
            )
          }
          role="link"
          aria-label="Politique de confidentialite"
        >
          politique de confidentialite
        </Text>
      </Text>

      <PrimaryButton
        label="Creer mon compte"
        loadingLabel="Creation..."
        isLoading={isLoading}
        onPress={handleRegister}
      />
    </YStack>
  );
}

/* ── Hero content per tab ── */
const heroContent = {
  login: {
    icon: <Building2 size={24} color={colors.primary[300]} />,
    title: 'Bienvenue sur\nImmeo',
    subtitle: 'Connectez-vous pour acceder a votre copropriete',
  },
  register: {
    icon: <UserPlus size={24} color={colors.primary[300]} />,
    title: 'Rejoignez votre\ncopropriete',
    subtitle: 'Creez un compte pour acceder a tous les services',
  },
};

export default function AuthScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const hero = heroContent[activeTab];

  return (
    <View style={{ flex: 1, backgroundColor: HERO_BG }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* ── Dark hero top ── */}
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View position="relative">
            <DecoSquares />
            <YStack paddingHorizontal={28} paddingTop={20} paddingBottom={36} gap={10}>
              <View
                width={48}
                height={48}
                borderRadius={14}
                backgroundColor={`${colors.white}12`}
                alignItems="center"
                justifyContent="center"
                marginBottom={8}
              >
                {hero.icon}
              </View>
              <Text
                fontFamily="$heading"
                fontSize={30}
                fontWeight="700"
                color={colors.white}
                lineHeight={38}
              >
                {hero.title}
              </Text>
              <Text fontFamily="$body" fontSize={15} fontWeight="400" color="#9CA3AF">
                {hero.subtitle}
              </Text>
            </YStack>
          </View>
        </SafeAreaView>

        {/* ── White card bottom ── */}
        <View
          flex={1}
          backgroundColor={colors.white}
          borderTopLeftRadius={32}
          borderTopRightRadius={32}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AuthTabs active={activeTab} onSwitch={setActiveTab} />

            <YStack gap={20} marginTop={28}>
              {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}

              <DividerText text="ou" />

              <XStack
                alignItems="center"
                justifyContent="center"
                gap={8}
                borderWidth={1}
                borderColor={colors.gray[200]}
                borderRadius={999}
                paddingVertical={14}
                pressStyle={{ opacity: 0.7, backgroundColor: colors.gray[50] }}
                onPress={() => router.push('/(auth)/invitation')}
                role="button"
                aria-label="J'ai un code d'invitation"
              >
                <KeyRound size={16} color={colors.gray[600]} strokeWidth={2} />
                <Text fontFamily="$body" fontSize={14} fontWeight="500" color={colors.gray[700]}>
                  J'ai un code d'invitation
                </Text>
              </XStack>
            </YStack>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
