import { useState } from 'react';
import { Alert, ScrollView, View as RNView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Hammer,
  HandHelping,
  ListChecks,
  MessageCircle,
  Utensils,
  Wrench,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useEntraide } from '@/hooks/useEntraide';
import type { EntraideCategorie, EntraideOffer } from '@/fixtures/entraide';
import { ENTRAIDE_CATEGORIES } from '@/fixtures/entraide';
import { MOCK_CONVERSATIONS_V2 } from '@/fixtures/copro';
import { Avatar } from '@/components/ui/Avatar';
import { GradientCard } from '@/components/ui/GradientCard';
import { ListRow, RowSeparator } from '@/components/ui/ListRow';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { TabSlideTransition } from '@/components/ui/TabSlideTransition';

type EntraideMainTab = 'offres' | 'messages';

const ENTRAIDE_ICONS = {
  wrench: Wrench,
  utensils: Utensils,
  hammer: Hammer,
  'hand-helping': HandHelping,
};

function OfferCard({ offer }: { offer: EntraideOffer }) {
  const colors = useThemeColors();
  const router = useRouter();
  const Icon = ENTRAIDE_ICONS[offer.icon];
  const emprunte = offer.statut === 'emprunte';

  return (
    <YStack
      backgroundColor={colors.surface.card}
      borderRadius={22}
      padding={18}
      gap={12}
      opacity={emprunte ? 0.7 : 1}
      onPress={
        emprunte
          ? undefined
          : () => router.push({ pathname: '/entraide-fiche', params: { id: offer.id } })
      }
      pressStyle={emprunte ? {} : { scale: 0.99 }}
      role="button"
      aria-label={offer.titre}
    >
      <XStack alignItems="center" gap={12}>
        <View
          width={44}
          height={44}
          borderRadius={14}
          backgroundColor={colors.white}
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={20} color={colors.primary[500]} strokeWidth={1.8} />
        </View>
        <YStack flex={1}>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            {offer.titre}
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
            {offer.proprietaire.nom} · {offer.proprietaire.etage} · {offer.condition}
          </Text>
        </YStack>
      </XStack>
      {emprunte ? (
        <View
          alignSelf="flex-start"
          paddingHorizontal={12}
          paddingVertical={6}
          borderRadius={999}
          backgroundColor={colors.surface.empty}
        >
          <Text fontFamily="$body" fontSize={12} fontWeight="600" color={colors.text.muted}>
            Emprunté
          </Text>
        </View>
      ) : (
        <View
          alignSelf="flex-start"
          paddingHorizontal={16}
          paddingVertical={9}
          borderRadius={999}
          backgroundColor={offer.demandeEnvoyee ? colors.successBg : colors.primary[500]}
          onPress={(e: { stopPropagation?: () => void }) => {
            e?.stopPropagation?.();
            if (!offer.demandeEnvoyee) {
              router.push({ pathname: '/entraide-demande', params: { id: offer.id } });
            }
          }}
          pressStyle={{ scale: 0.96 }}
          role="button"
          aria-label={offer.demandeEnvoyee ? 'Demande envoyée' : offer.ctaLabel}
        >
          <Text
            fontFamily="$heading"
            fontSize={13}
            fontWeight="700"
            color={offer.demandeEnvoyee ? colors.successText : colors.white}
          >
            {offer.demandeEnvoyee ? 'Demande envoyée' : offer.ctaLabel}
          </Text>
        </View>
      )}
    </YStack>
  );
}

function OffresTab() {
  const colors = useThemeColors();
  const router = useRouter();
  const { offers, demandesRecues, mesAnnonces } = useEntraide();
  const [filter, setFilter] = useState<'Tout' | EntraideCategorie>('Tout');

  const filtered = filter === 'Tout' ? offers : offers.filter((o) => o.categorie === filter);
  const filterOptions: ('Tout' | EntraideCategorie)[] = ['Tout', ...ENTRAIDE_CATEGORIES];
  const enAttente = demandesRecues.filter((d) => d.statut === 'pending').length;
  const gestionSubtitle =
    enAttente > 0
      ? `${enAttente} demande${enAttente > 1 ? 's' : ''} à traiter`
      : `${mesAnnonces.length} annonce${mesAnnonces.length > 1 ? 's' : ''} publiée${mesAnnonces.length > 1 ? 's' : ''}`;

  return (
    <YStack gap={24} paddingBottom={130}>
      {/* CTA proposer un prêt */}
      <GradientCard radius={24} padding={20}>
        <XStack
          alignItems="center"
          gap={14}
          onPress={() => router.push('/entraide-annonce')}
          pressStyle={{ opacity: 0.8 }}
          role="button"
          aria-label="Proposer un prêt ou un coup de main"
        >
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={colors.white}
            alignItems="center"
            justifyContent="center"
          >
            <HandHelping size={22} color={colors.primary[500]} strokeWidth={1.8} />
          </View>
          <YStack flex={1}>
            <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.primary[900]}>
              Proposer un prêt ou un coup de main
            </Text>
            <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.primary[600]}>
              Outil, appareil, service…
            </Text>
          </YStack>
          <ChevronRight size={16} color={colors.primary[600]} strokeWidth={2} />
        </XStack>
      </GradientCard>

      {/* Accès rapide : gérer mes prêts */}
      <XStack
        alignItems="center"
        gap={14}
        backgroundColor={colors.surface.card}
        borderRadius={22}
        padding={16}
        onPress={() => router.push('/entraide-gestion')}
        pressStyle={{ scale: 0.99 }}
        role="button"
        aria-label="Gérer mes prêts"
      >
        <View
          width={44}
          height={44}
          borderRadius={22}
          backgroundColor={enAttente > 0 ? colors.warningBg : colors.primary[50]}
          alignItems="center"
          justifyContent="center"
        >
          <ListChecks
            size={20}
            color={enAttente > 0 ? colors.warning : colors.primary[500]}
            strokeWidth={1.8}
          />
        </View>
        <YStack flex={1}>
          <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.text.primary}>
            Mes prêts
          </Text>
          <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.text.muted}>
            {gestionSubtitle}
          </Text>
        </YStack>
        <ChevronRight size={16} color={colors.text.disabled} strokeWidth={2} />
      </XStack>

      {/* Chips de filtre */}
      <XStack gap={8} flexWrap="wrap">
        {filterOptions.map((cat) => {
          const isActive = filter === cat;
          return (
            <View
              key={cat}
              paddingVertical={9}
              paddingHorizontal={16}
              borderRadius={999}
              backgroundColor={isActive ? colors.primary[500] : colors.surface.card}
              pressStyle={{ scale: 0.95 }}
              onPress={() => setFilter(cat)}
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

      {/* Cartes d'offres */}
      <YStack gap={12}>
        {filtered.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
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
        Prêts de voisin à voisin, sans intervention du syndic. Vos coordonnées ne sont partagées
        qu'après acceptation.
      </Text>
    </YStack>
  );
}

function MessagesTab() {
  const colors = useThemeColors();
  const handleOpenConversation = (name: string) => {
    Alert.alert(name, 'La conversation détaillée sera bientôt disponible.');
  };

  return (
    <YStack gap={20} paddingBottom={130}>
      {/* CTA gestionnaire : canal unique et traçable */}
      <GradientCard radius={24} padding={20}>
        <XStack
          alignItems="center"
          gap={14}
          onPress={() => handleOpenConversation('Cabinet Foncia')}
          pressStyle={{ opacity: 0.8 }}
          role="button"
          aria-label="Écrire au gestionnaire"
        >
          <View
            width={48}
            height={48}
            borderRadius={24}
            backgroundColor={colors.white}
            alignItems="center"
            justifyContent="center"
          >
            <MessageCircle size={22} color={colors.primary[500]} strokeWidth={1.8} />
          </View>
          <YStack flex={1}>
            <Text fontFamily="$heading" fontSize={15} fontWeight="700" color={colors.primary[900]}>
              Écrire au gestionnaire
            </Text>
            <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.primary[600]}>
              Canal unique et traçable · réponse sous 48h
            </Text>
          </YStack>
          <ChevronRight size={16} color={colors.primary[600]} strokeWidth={2} />
        </XStack>
      </GradientCard>

      {/* Conversations : syndic + gardien uniquement (pas de P2P en P0) */}
      <YStack>
        {MOCK_CONVERSATIONS_V2.map((conv, index) => {
          const hasUnread = conv.unread > 0;
          return (
            <YStack key={conv.id}>
              {index > 0 && <RowSeparator />}
              <ListRow
                onPress={() => handleOpenConversation(conv.name)}
                aria-label={`Conversation avec ${conv.name}`}
              >
                <Avatar
                  initials={conv.initials}
                  size={52}
                  variant={conv.gradient ? 'gradient' : 'soft'}
                />
                <YStack flex={1} gap={2} minWidth={0}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text
                      fontFamily="$heading"
                      fontSize={15}
                      fontWeight={hasUnread ? '700' : '600'}
                      color={colors.text.primary}
                    >
                      {conv.name}
                    </Text>
                    <Text
                      fontFamily="$body"
                      fontSize={12}
                      fontWeight={hasUnread ? '500' : '400'}
                      color={hasUnread ? colors.primary[500] : colors.text.disabled}
                    >
                      {conv.time}
                    </Text>
                  </XStack>
                  <Text
                    fontFamily="$body"
                    fontSize={13}
                    fontWeight={hasUnread ? '500' : '400'}
                    color={hasUnread ? colors.text.secondary : colors.text.muted}
                    numberOfLines={1}
                  >
                    {conv.message}
                  </Text>
                </YStack>
                {hasUnread && (
                  <View
                    minWidth={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor={colors.primary[500]}
                    alignItems="center"
                    justifyContent="center"
                    paddingHorizontal={5}
                  >
                    <Text fontFamily="$heading" fontSize={11} fontWeight="700" color={colors.white}>
                      {conv.unread}
                    </Text>
                  </View>
                )}
              </ListRow>
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
}

export default function EntraideScreen() {
  const colors = useThemeColors();
  const [tab, setTab] = useState<EntraideMainTab>('offres');

  return (
    <RNView style={{ flex: 1, backgroundColor: colors.background }}>
      <TabSlideTransition>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 0 }}
            showsVerticalScrollIndicator={false}
          >
            <YStack paddingHorizontal={24} paddingTop={20} paddingBottom={16}>
              <Text
                fontFamily="$heading"
                fontSize={32}
                fontWeight="800"
                letterSpacing={-0.8}
                color={colors.text.primary}
                role="heading"
              >
                Entraide
              </Text>
            </YStack>

            <YStack paddingHorizontal={24} gap={24}>
              <SegmentedTabs
                tabs={[
                  { key: 'offres', label: 'Offres' },
                  { key: 'messages', label: 'Messages' },
                ]}
                active={tab}
                onSwitch={(key) => setTab(key as EntraideMainTab)}
              />
              {tab === 'offres' ? <OffresTab /> : <MessagesTab />}
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </TabSlideTransition>
    </RNView>
  );
}
