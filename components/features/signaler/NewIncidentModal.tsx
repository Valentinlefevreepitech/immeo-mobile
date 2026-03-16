import { useState } from 'react';
import {
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { YStack, XStack, Text, View, Input, TextArea } from 'tamagui';
import { Droplets, Zap, Flame, MoreHorizontal, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import type { ComponentType } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import type { IncidentCategory } from '@/types/database';

type LucideIcon = ComponentType<{ size?: number; color?: string }>;

const CATEGORIES: {
  label: string;
  value: IncidentCategory;
  Icon: LucideIcon;
  color: string;
}[] = [
  { label: 'Plomberie', value: 'Plomberie', Icon: Droplets, color: colors.info },
  { label: 'Electricite', value: 'Électricité', Icon: Zap, color: colors.warning },
  { label: 'Chauffage', value: 'Chauffage', Icon: Flame, color: '#EF4444' },
  { label: 'Autre', value: 'Autre', Icon: MoreHorizontal, color: colors.gray[600] },
];

interface NewIncidentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (incident: {
    title: string;
    category: IncidentCategory;
    description: string;
    photoUris: string[];
  }) => void;
  isSubmitting?: boolean;
}

export function NewIncidentModal({
  visible,
  onClose,
  onSubmit,
  isSubmitting,
}: NewIncidentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [isPickingImage, setIsPickingImage] = useState(false);

  async function pickImage() {
    setIsPickingImage(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          "L'acces a la galerie est necessaire pour ajouter des photos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5 - photoUris.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newUris = result.assets.map((a) => a.uri);
        setPhotoUris((prev) => [...prev, ...newUris].slice(0, 5));
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de selectionner la photo.');
    } finally {
      setIsPickingImage(false);
    }
  }

  async function takePhoto() {
    setIsPickingImage(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          "L'acces a la camera est necessaire pour prendre une photo.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhotoUris((prev) => [...prev, result.assets[0].uri].slice(0, 5));
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de prendre la photo.');
    } finally {
      setIsPickingImage(false);
    }
  }

  function showPhotoOptions() {
    if (photoUris.length >= 5) {
      Alert.alert('Limite atteinte', 'Vous pouvez ajouter au maximum 5 photos.');
      return;
    }
    Alert.alert('Ajouter une photo', 'Choisissez une source', [
      { text: 'Appareil photo', onPress: takePhoto },
      { text: 'Galerie', onPress: pickImage },
      { text: 'Annuler', style: 'cancel' },
    ]);
  }

  function removePhoto(index: number) {
    setPhotoUris((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez donner un titre au probleme.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Erreur', 'Veuillez choisir une categorie.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez decrire le probleme.');
      return;
    }

    onSubmit({
      title: title.trim(),
      category: selectedCategory,
      description: description.trim(),
      photoUris,
    });
    setTitle('');
    setDescription('');
    setSelectedCategory(null);
    setPhotoUris([]);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          edges={['top', 'bottom']}
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Modal header */}
            <XStack
              paddingHorizontal={20}
              paddingVertical={16}
              justifyContent="space-between"
              alignItems="center"
            >
              <View
                pressStyle={{ opacity: 0.6 }}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Annuler"
                accessibilityHint="Double-tapez pour fermer le formulaire"
              >
                <Text fontFamily="$body" fontSize={15} fontWeight="500" color={colors.gray[500]}>
                  Annuler
                </Text>
              </View>
              <Text
                fontFamily="$heading"
                fontSize={17}
                fontWeight="700"
                color={colors.gray[900]}
                accessibilityRole="header"
              >
                Nouveau signalement
              </Text>
              <View
                pressStyle={{ opacity: 0.6 }}
                onPress={handleSubmit}
                opacity={isSubmitting ? 0.5 : 1}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Envoyer le signalement"
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.primary[500]} />
                ) : (
                  <Text
                    fontFamily="$body"
                    fontSize={15}
                    fontWeight="600"
                    color={colors.primary[500]}
                  >
                    Envoyer
                  </Text>
                )}
              </View>
            </XStack>

            <YStack paddingHorizontal={20} gap={24}>
              {/* Title */}
              <YStack gap={8}>
                <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.gray[700]}>
                  Titre du probleme
                </Text>
                <Input
                  placeholder="Ex: Fuite sous l'evier"
                  backgroundColor={colors.white}
                  borderColor={colors.gray[200]}
                  borderRadius={12}
                  fontSize={15}
                  fontFamily="$body"
                  value={title}
                  onChangeText={setTitle}
                  accessibilityLabel="Titre du probleme"
                />
              </YStack>

              {/* Category */}
              <YStack gap={8}>
                <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.gray[700]}>
                  Categorie
                </Text>
                <XStack flexWrap="wrap" gap={8}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <View
                        key={cat.value}
                        flexDirection="row"
                        alignItems="center"
                        gap={6}
                        paddingHorizontal={14}
                        paddingVertical={10}
                        borderRadius={12}
                        backgroundColor={isSelected ? colors.primary[500] : colors.white}
                        borderWidth={1}
                        borderColor={isSelected ? colors.primary[500] : colors.gray[200]}
                        pressStyle={{ scale: 0.97 }}
                        onPress={() => setSelectedCategory(cat.value)}
                        accessibilityRole="button"
                        accessibilityLabel={`Categorie ${cat.label}`}
                        accessibilityState={{ selected: isSelected }}
                      >
                        <cat.Icon size={16} color={isSelected ? colors.white : cat.color} />
                        <Text
                          fontFamily="$body"
                          fontSize={13}
                          fontWeight="500"
                          color={isSelected ? colors.white : colors.gray[700]}
                        >
                          {cat.label}
                        </Text>
                      </View>
                    );
                  })}
                </XStack>
              </YStack>

              {/* Description */}
              <YStack gap={8}>
                <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.gray[700]}>
                  Description
                </Text>
                <TextArea
                  placeholder="Decrivez le probleme en detail..."
                  backgroundColor={colors.white}
                  borderColor={colors.gray[200]}
                  borderRadius={12}
                  fontSize={15}
                  fontFamily="$body"
                  numberOfLines={5}
                  minHeight={120}
                  value={description}
                  onChangeText={setDescription}
                  accessibilityLabel="Description du probleme"
                />
              </YStack>

              {/* Photo section */}
              <YStack gap={8}>
                <Text fontFamily="$body" fontSize={14} fontWeight="600" color={colors.gray[700]}>
                  Photos (optionnel, max 5)
                </Text>

                {/* Photo previews */}
                {photoUris.length > 0 && (
                  <XStack flexWrap="wrap" gap={8}>
                    {photoUris.map((uri, index) => (
                      <View key={uri} position="relative">
                        <Image
                          source={{ uri }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                          }}
                        />
                        <View
                          position="absolute"
                          top={-6}
                          right={-6}
                          width={22}
                          height={22}
                          borderRadius={11}
                          backgroundColor={colors.danger}
                          alignItems="center"
                          justifyContent="center"
                          pressStyle={{ opacity: 0.7 }}
                          onPress={() => removePhoto(index)}
                          accessibilityRole="button"
                          accessibilityLabel={`Supprimer la photo ${index + 1}`}
                        >
                          <X size={12} color={colors.white} />
                        </View>
                      </View>
                    ))}
                  </XStack>
                )}

                {/* Add photo button */}
                <View
                  backgroundColor={colors.white}
                  borderRadius={12}
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor={colors.gray[300]}
                  padding={24}
                  alignItems="center"
                  gap={8}
                  opacity={isPickingImage ? 0.5 : 1}
                  pressStyle={{ opacity: 0.7 }}
                  onPress={showPhotoOptions}
                  disabled={isPickingImage}
                  accessibilityRole="button"
                  accessibilityLabel="Ajouter une photo"
                  accessibilityHint="Double-tapez pour ajouter une photo au signalement"
                >
                  {isPickingImage ? (
                    <ActivityIndicator size="small" color={colors.gray[400]} />
                  ) : (
                    <Camera size={32} color={colors.gray[400]} />
                  )}
                  <Text fontFamily="$body" fontSize={13} fontWeight="400" color={colors.gray[400]}>
                    {isPickingImage ? 'Selection en cours...' : 'Ajouter une photo'}
                  </Text>
                </View>
              </YStack>
            </YStack>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
