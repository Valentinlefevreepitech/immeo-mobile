import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { registerForPushNotifications, savePushTokenToSupabase } from '@/lib/notifications';
import { Sentry } from '@/lib/sentry';

/**
 * Sets up push notification listeners and registers the device token.
 * Should be mounted once at the root layout level.
 */
export function useNotifications() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const receivedListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Register push token when user is logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    registerForPushNotifications()
      .then((token) => {
        if (token) {
          savePushTokenToSupabase(token).catch((err) => {
            Sentry.captureException(err);
          });
        }
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  }, [isLoggedIn]);

  // Set up notification listeners
  useEffect(() => {
    // Notification received while app is in foreground
    receivedListener.current = Notifications.addNotificationReceivedListener((_notification) => {
      // No-op: the notification handler already shows the alert.
      // Add custom in-app handling here if needed.
    });

    // User tapped on notification — navigate to relevant screen
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      const redirectTo = data?.redirect_to as string | undefined;

      if (redirectTo) {
        // Deep link using expo-router — redirect_to should be a route path
        // e.g. "/(app)/copro", "/(app)/signaler", "/(app)/appart"
        router.push(redirectTo as never);
      }
    });

    return () => {
      if (receivedListener.current) {
        receivedListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);
}
