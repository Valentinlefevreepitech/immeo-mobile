import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Sentry } from '@/lib/sentry';
import { queryClient, asyncStoragePersister } from '@/lib/queryClient';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useAppReady } from '@/hooks/useAppReady';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useNotifications } from '@/hooks/useNotifications';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import config from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }: { children: React.ReactNode }) {
  useAuthGuard();
  return <>{children}</>;
}

function NotificationSetup() {
  useNotifications();
  return null;
}

const persistOptions = {
  persister: asyncStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: { state: { status: string } }) =>
      query.state.status === 'success',
  },
};

function RootLayout() {
  const isReady = useAppReady();
  const theme = useResolvedTheme();

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <TamaguiProvider config={config} defaultTheme={theme}>
          <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            <SafeAreaProvider>
              <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
              <NotificationSetup />
              <AuthGuard>
                <Slot />
              </AuthGuard>
            </SafeAreaProvider>
          </PersistQueryClientProvider>
        </TamaguiProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);
