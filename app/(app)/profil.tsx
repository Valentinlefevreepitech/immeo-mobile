import { useState } from 'react';
import { Alert, ScrollView, View as RNView } from 'react-native';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, LogOut, ShieldCheck, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useProfile } from '@/hooks/useProfile';
import { useRoleStore, ROLE_LABELS } from '@/stores/roleStore';
import { MOCK_APARTMENT } from '@/fixtures/apartment';
import { Avatar } from '@/components/ui/Avatar';
import { Toggle } from '@/components/ui/Toggle';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { PageTransition } from '@/components/ui/PageTransition';

interface Consent {
  id: string;
  title: string;
  subtitle: string;
  value: boolean;
}

const INITIAL_CONSENTS: Consent[] = [
  {
    id: 'push',
    title: 'Notifications push',
    subtitle: 'Annonces, incidents, AG',
    value: true,
  },
  {
    id: 'annuaire',
    title: 'Annuaire des voisins',
    subtitle: 'Nom visible par les résidents',
    value: false,
  },
  {
    id: 'photos',
    title: "Photos d'incidents",
    subtitle: 'Partagées avec les intervenants',
    value: true,
  },
];

function AccountRow({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <ListRow onPress={onPress} aria-label={label}>
      <View
        width={40}
        height={40}
        borderRadius={20}
        backgroundColor={colors.surface.card}
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </View>
      <Text flex={1} fontFamily="$body" fontSize={15} fontWeight="600" color={colors.text.primary}>
        {label}
      </Text>
      <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
    </ListRow>
  );
}

export default function ProfilScreen() {
  const { profile, handleLogout } = useProfile();
  const role = useRoleStore((s) => s.role);
  const toggleRole = useRoleStore((s) => s.toggleRole);
  const [consents, setConsents] = useState(INITIAL_CONSENTS);

  const setConsent = (id: string, value: boolean) => {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <PageTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 130 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Identité */}
            <YStack
              alignItems="center"
              gap={14}
              paddingTop={30}
              paddingBottom={24}
              paddingHorizontal={24}
            >
              <Avatar initials={profile.initials} size={88} />
              <YStack alignItems="center" gap={4}>
                <Text
                  fontFamily="$heading"
                  fontSize={24}
                  fontWeight="800"
                  letterSpacing={-0.5}
                  color={colors.text.primary}
                >
                  {profile.fullName}
                </Text>
                <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.text.muted}>
                  {profile.email}
                </Text>
              </YStack>
              {/* Badge rôle — tap pour basculer Locataire / Copropriétaire (démo) */}
              <View
                paddingVertical={6}
                paddingHorizontal={16}
                borderRadius={999}
                backgroundColor={colors.primary[50]}
                pressStyle={{ scale: 0.95 }}
                onPress={toggleRole}
                role="button"
                aria-label={`Rôle : ${ROLE_LABELS[role]}. Appuyez pour changer de rôle.`}
              >
                <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.primary[500]}>
                  {ROLE_LABELS[role]} · {MOCK_APARTMENT.numero}
                </Text>
              </View>
            </YStack>

            <YStack paddingHorizontal={24} gap={26}>
              {/* Compte */}
              <YStack gap={4}>
                <Text
                  fontFamily="$heading"
                  fontSize={20}
                  fontWeight="700"
                  letterSpacing={-0.4}
                  color={colors.text.primary}
                  marginBottom={8}
                  role="heading"
                >
                  Compte
                </Text>
                <AccountRow
                  icon={<User size={18} color={colors.text.primary} strokeWidth={1.8} />}
                  label="Mes données personnelles"
                  onPress={() =>
                    Alert.alert(
                      'Mes données personnelles',
                      `Nom : ${profile.fullName}\nEmail : ${profile.email}\n\nLa modification du profil sera bientôt disponible.`,
                    )
                  }
                />
                <RowSeparator />
                <AccountRow
                  icon={<ShieldCheck size={18} color={colors.text.primary} strokeWidth={1.8} />}
                  label="Sécurité · mot de passe"
                  onPress={() =>
                    Alert.alert('Sécurité', 'La gestion du mot de passe sera bientôt disponible.')
                  }
                />
              </YStack>

              {/* Consentements RGPD */}
              <YStack gap={14}>
                <Text
                  fontFamily="$heading"
                  fontSize={20}
                  fontWeight="700"
                  letterSpacing={-0.4}
                  color={colors.text.primary}
                  role="heading"
                >
                  Consentements
                </Text>
                <YStack
                  backgroundColor={colors.surface.card}
                  borderRadius={24}
                  padding={20}
                  gap={16}
                >
                  {consents.map((consent, index) => (
                    <YStack key={consent.id} gap={16}>
                      {index > 0 && <View height={1} backgroundColor={colors.surface.empty} />}
                      <XStack alignItems="center" gap={12}>
                        <YStack flex={1}>
                          <Text
                            fontFamily="$body"
                            fontSize={14}
                            fontWeight="600"
                            color={colors.text.primary}
                          >
                            {consent.title}
                          </Text>
                          <Text
                            fontFamily="$body"
                            fontSize={12}
                            fontWeight="400"
                            color={colors.text.muted}
                          >
                            {consent.subtitle}
                          </Text>
                        </YStack>
                        <Toggle
                          value={consent.value}
                          onValueChange={(value) => setConsent(consent.id, value)}
                          aria-label={consent.title}
                        />
                      </XStack>
                    </YStack>
                  ))}
                </YStack>
                <Text
                  fontFamily="$body"
                  fontSize={12}
                  fontWeight="400"
                  color={colors.text.muted}
                  paddingHorizontal={8}
                  lineHeight={18}
                >
                  Vos données restent limitées à votre lot et votre immeuble.{' '}
                  <Text
                    fontSize={12}
                    color={colors.primary[500]}
                    fontWeight="500"
                    onPress={() =>
                      Alert.alert('Exporter mes données', "L'export RGPD sera bientôt disponible.")
                    }
                    role="link"
                  >
                    Exporter mes données
                  </Text>{' '}
                  ·{' '}
                  <Text
                    fontSize={12}
                    color={colors.primary[500]}
                    fontWeight="500"
                    onPress={() =>
                      Alert.alert(
                        'Supprimer mon compte',
                        'La suppression de compte sera bientôt disponible.',
                      )
                    }
                    role="link"
                  >
                    Supprimer mon compte
                  </Text>
                </Text>
              </YStack>

              {/* Déconnexion */}
              <ListRow onPress={handleLogout} aria-label="Se déconnecter" paddingVertical={0}>
                <View
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor={colors.dangerBg}
                  alignItems="center"
                  justifyContent="center"
                >
                  <LogOut size={18} color={colors.danger} strokeWidth={1.8} />
                </View>
                <Text
                  flex={1}
                  fontFamily="$body"
                  fontSize={15}
                  fontWeight="600"
                  color={colors.danger}
                >
                  Se déconnecter
                </Text>
              </ListRow>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </PageTransition>
    </RNView>
  );
}
