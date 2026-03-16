import { useCallback } from 'react';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { YStack, Text, View, Separator } from 'tamagui';
import { Pencil } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useCopro } from '@/hooks/useCopro';
import { ChatRow } from '@/components/features/copro/ChatRow';
import { AnnonceCard } from '@/components/features/copro/AnnonceCard';
import { SondageCard } from '@/components/features/copro/SondageCard';

export default function CoproScreen() {
  const { conversations, annonces, sondage, voteSondage } = useCopro();

  const handleChatPress = useCallback((name: string, detail: string) => {
    Alert.alert(name, detail);
  }, []);

  const handleAnnoncePress = useCallback((title: string, detail: string) => {
    Alert.alert(title, detail);
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
            Vie de copro
          </Text>
        </YStack>

        <YStack paddingHorizontal={20} gap={24}>
          {/* Chat section */}
          <YStack gap={12}>
            <SectionHeader title="Conversations" count={conversations.length} />
            <View backgroundColor={colors.white} borderRadius={16} paddingHorizontal={20}>
              {conversations.map((conv, index) => (
                <View key={conv.id}>
                  {index > 0 && <Separator borderColor={colors.gray[100]} />}
                  <ChatRow
                    name={conv.name}
                    initials={conv.initials}
                    message={conv.message}
                    time={conv.time}
                    unread={conv.unread}
                    onPress={() => handleChatPress(conv.name, conv.detail)}
                  />
                </View>
              ))}
            </View>
          </YStack>

          {/* Annonces */}
          <YStack gap={12}>
            <SectionHeader title="Annonces" count={annonces.length} />
            {annonces.map((annonce) => (
              <AnnonceCard
                key={annonce.id}
                title={annonce.title}
                content={annonce.content}
                date={annonce.date}
                author={annonce.author}
                onPress={() => handleAnnoncePress(annonce.title, annonce.detail)}
              />
            ))}
          </YStack>

          {/* Sondages */}
          <YStack gap={12}>
            <SectionHeader title="Sondages" count={1} />
            <SondageCard
              question={sondage.question}
              options={sondage.options}
              totalVotes={sondage.totalVotes}
              endsAt={sondage.endsAt}
              hasVoted={sondage.hasVoted}
              onVote={voteSondage}
            />
          </YStack>
        </YStack>
      </ScrollView>

      {/* FAB */}
      <View
        position="absolute"
        bottom={100}
        right={20}
        width={56}
        height={56}
        borderRadius={28}
        backgroundColor={colors.primary[500]}
        alignItems="center"
        justifyContent="center"
        pressStyle={{ scale: 0.95, backgroundColor: colors.primary[600] }}
        onPress={() =>
          Alert.alert('Nouveau message', 'La creation de messages sera bientot disponible.')
        }
        accessibilityRole="button"
        accessibilityLabel="Nouveau message"
        accessibilityHint="Double-tapez pour ecrire un nouveau message"
      >
        <Pencil size={24} color={colors.white} />
      </View>
    </SafeAreaView>
  );
}
