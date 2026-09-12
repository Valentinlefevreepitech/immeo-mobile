import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

/**
 * Gere l'initialisation de l'auth et la redirection
 * selon l'etat de connexion.
 */
export function useAuthGuard() {
  const { user, isLoggedIn, isInitialized, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const segmentList: readonly string[] = segments;
    const inAuthGroup = segmentList[0] === '(auth)';
    const inCoproSetup = inAuthGroup && segmentList[1] === 'copro-setup';
    // Pas encore rattache a un cabinet/coproprietaire/tenant reel : on
    // envoie vers l'ecran de rattachement plutot que sur l'app avec des
    // donnees vides.
    const needsLinking = isLoggedIn && !!user && user.role === null;

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && needsLinking && !inCoproSetup) {
      router.replace('/(auth)/copro-setup');
    } else if (isLoggedIn && !needsLinking && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [isLoggedIn, isInitialized, segments, user]);
}
