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
    const needsCopro = isLoggedIn && !!user && !user.coproprieteId;

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && needsCopro && !inCoproSetup) {
      router.replace('/(auth)/copro-setup');
    } else if (isLoggedIn && !needsCopro && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [isLoggedIn, isInitialized, segments, user]);
}
