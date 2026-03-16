import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  enableAutoSessionTracking: true,
  tracesSampleRate: 0.2,
});

export { Sentry };
