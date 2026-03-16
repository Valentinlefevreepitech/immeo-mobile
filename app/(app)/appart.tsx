import { useCallback } from 'react';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { YStack, XStack, Text, View, Separator } from 'tamagui';
import { Car, CreditCard, Info, FolderOpen, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { StatCard } from '@/components/ui/StatCard';
import { useApartment } from '@/hooks/useApartment';
import { InfoRow } from '@/components/features/appart/InfoRow';
import { SectionCard } from '@/components/features/appart/SectionCard';
import { ParkingCard } from '@/components/features/appart/ParkingCard';
import { PaymentRow } from '@/components/features/appart/PaymentRow';
import { DocumentRow } from '@/components/features/appart/DocumentRow';
import { ColocataireRow } from '@/components/features/appart/ColocataireRow';

export default function AppartScreen() {
  const { apartment, parking, loyer, payments, documents, occupants } = useApartment();

  const handlePaymentPress = useCallback((month: string, detail: string) => {
    Alert.alert(month, detail);
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack paddingHorizontal={20} paddingTop={16} paddingBottom={12} gap={4}>
          <Text fontFamily="$body" fontSize={14} fontWeight="400" color={colors.gray[500]}>
            Residence Les Jardins
          </Text>
          <Text
            fontFamily="$heading"
            fontSize={28}
            fontWeight="700"
            color={colors.gray[900]}
            accessibilityRole="header"
          >
            Mon appartement
          </Text>
        </YStack>

        <YStack paddingHorizontal={20} gap={24}>
          {/* Infos generales */}
          <SectionCard title="Informations" icon={<Info size={20} color={colors.primary[500]} />}>
            <InfoRow label="Numero" value={apartment.numero} />
            <Separator borderColor={colors.gray[100]} />
            <InfoRow label="Etage" value={apartment.etage} />
            <Separator borderColor={colors.gray[100]} />
            <InfoRow label="Surface" value={apartment.surface} />
            <Separator borderColor={colors.gray[100]} />
            <InfoRow label="Pieces" value={apartment.pieces} />
            <Separator borderColor={colors.gray[100]} />
            <InfoRow label="Type" value={apartment.type} />
          </SectionCard>

          {/* Parking */}
          <YStack gap={12}>
            <XStack gap={8} alignItems="center" accessibilityRole="header">
              <Car size={20} color={colors.secondary[500]} />
              <Text fontFamily="$heading" fontSize={18} fontWeight="700" color={colors.gray[900]}>
                Place de parking
              </Text>
            </XStack>
            <ParkingCard parking={parking} />
          </YStack>

          {/* Loyer & charges */}
          <YStack gap={12}>
            <XStack gap={8} alignItems="center" accessibilityRole="header">
              <CreditCard size={20} color={colors.success} />
              <Text fontFamily="$heading" fontSize={18} fontWeight="700" color={colors.gray[900]}>
                Loyer & charges
              </Text>
            </XStack>

            <XStack gap={12}>
              <StatCard value={`${loyer.loyer} €`} label="Loyer" />
              <StatCard
                value={`${loyer.charges} €`}
                label="Charges"
                valueColor={colors.secondary[500]}
              />
              <StatCard
                value={`${loyer.total} €`}
                label="Total / mois"
                valueColor={colors.gray[900]}
              />
            </XStack>

            <View backgroundColor={colors.white} borderRadius={16} paddingHorizontal={20}>
              {payments.map((payment, index) => (
                <View key={payment.id}>
                  {index > 0 && <Separator borderColor={colors.gray[100]} />}
                  <PaymentRow
                    month={payment.month}
                    amount={payment.amount}
                    status={payment.status}
                    onPress={() => handlePaymentPress(payment.month, payment.detail)}
                  />
                </View>
              ))}
            </View>
          </YStack>

          {/* Documents */}
          <SectionCard title="Documents" icon={<FolderOpen size={20} color={colors.info} />}>
            {documents.map((doc, index) => (
              <View key={doc.name}>
                {index > 0 && <Separator borderColor={colors.gray[100]} />}
                <DocumentRow name={doc.name} type={doc.type} date={doc.date} />
              </View>
            ))}
          </SectionCard>

          {/* Colocataires */}
          <SectionCard title="Occupants" icon={<Users size={20} color={colors.primary[500]} />}>
            {occupants.map((occupant, index) => (
              <View key={occupant.name}>
                {index > 0 && <Separator borderColor={colors.gray[100]} />}
                <ColocataireRow
                  name={occupant.name}
                  initials={occupant.initials}
                  isPrincipal={occupant.isPrincipal}
                  phone={occupant.phone}
                />
              </View>
            ))}
          </SectionCard>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
