import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { YStack, XStack, Text, View, Separator, useTheme } from 'tamagui';
import {
  User,
  Bell,
  ShieldCheck,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { StatCard } from '@/components/ui/StatCard';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader } from '@/components/features/profil/ProfileHeader';
import { ProfileMenuItem } from '@/components/features/profil/ProfileMenuItem';
import { ProfileMenuSection } from '@/components/features/profil/ProfileMenuSection';
import { ThemeToggle } from '@/components/features/profil/ThemeToggle';

export default function ProfilScreen() {
  const { profile, stats, handleLogout } = useProfile();
  const { initials, fullName, email } = profile;
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: theme.background.val }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader initials={initials} fullName={fullName} email={email} />

        {/* Stats row */}
        <XStack paddingHorizontal="$5" gap="$3" marginBottom="$5">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              valueColor={stat.valueColor}
            />
          ))}
        </XStack>

        {/* Menu sections */}
        <YStack paddingHorizontal="$5" gap="$5">
          {/* Apparence */}
          <ProfileMenuSection title="Apparence">
            <ThemeToggle />
          </ProfileMenuSection>

          {/* Account */}
          <ProfileMenuSection title="Compte">
            <ProfileMenuItem
              icon={<User size={20} color={colors.gray[700]} />}
              label="Informations"
              subtitle="Coordonnees et identite"
              onPress={() =>
                Alert.alert(
                  'Informations',
                  `Nom : ${fullName}\nEmail : ${email}\n\nLa modification du profil sera bientot disponible.`,
                )
              }
            />
            <Separator borderColor="$borderColor" />
            <ProfileMenuItem
              icon={<Bell size={20} color={colors.gray[700]} />}
              label="Notifications"
              subtitle="Alertes et rappels"
              onPress={() =>
                Alert.alert(
                  'Notifications',
                  'Toutes les notifications sont activees.\n\n- Alertes copropriete\n- Messages residents\n- Rappels paiement\n- Travaux et incidents',
                )
              }
            />
            <Separator borderColor="$borderColor" />
            <ProfileMenuItem
              icon={<ShieldCheck size={20} color={colors.gray[700]} />}
              label="Securite"
              subtitle="Mot de passe et 2FA"
              onPress={() =>
                Alert.alert(
                  'Securite',
                  'Mot de passe : ********\nAuthentification 2FA : Desactivee\n\nLa gestion de la securite sera bientot disponible.',
                )
              }
            />
          </ProfileMenuSection>

          {/* Gestion */}
          <ProfileMenuSection title="Gestion">
            <ProfileMenuItem
              icon={<FileText size={20} color={colors.gray[700]} />}
              label="Documents"
              subtitle="Pieces et justificatifs"
              onPress={() =>
                Alert.alert(
                  'Documents',
                  '4 documents disponibles :\n\n- Bail de location\n- Etat des lieux\n- Attestation assurance\n- Quittance fevrier 2026\n\nConsultez l\'onglet "Mon Appart" pour y acceder.',
                )
              }
            />
            <Separator borderColor="$borderColor" />
            <ProfileMenuItem
              icon={<CreditCard size={20} color={colors.gray[700]} />}
              label="Paiements"
              subtitle="Moyens de paiement"
              onPress={() =>
                Alert.alert(
                  'Paiements',
                  'Mode de paiement : Virement automatique\nIBAN : FR76 **** **** **** 4521\n\nLa gestion des paiements sera bientot disponible.',
                )
              }
            />
            <Separator borderColor="$borderColor" />
            <ProfileMenuItem
              icon={<HelpCircle size={20} color={colors.gray[700]} />}
              label="Aide"
              subtitle="FAQ et support"
              onPress={() =>
                Alert.alert(
                  'Aide & Support',
                  "Besoin d'aide ?\n\nEmail : support@immeo.fr\nTel : 01 23 45 67 89\nHoraires : Lun-Ven 9h-18h",
                )
              }
            />
          </ProfileMenuSection>

          {/* Logout */}
          <View backgroundColor="$backgroundHover" borderRadius="$5" paddingHorizontal="$5">
            <ProfileMenuItem
              icon={<LogOut size={20} color={colors.danger} />}
              label="Se deconnecter"
              danger
              onPress={handleLogout}
            />
          </View>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
