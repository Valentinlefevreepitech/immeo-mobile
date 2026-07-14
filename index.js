// Entry point personnalisé : filtre, avant l'init de React, le bruit dev web
// de Tamagui 2.0 RC (props accessibility* posées sur le DOM, signalées par
// React 19). Web dev uniquement — l'accessibilité native n'est pas affectée.
if (__DEV__ && typeof document !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].startsWith('React does not recognize') &&
      String(args[1]).startsWith('accessibility')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

require('expo-router/entry');
