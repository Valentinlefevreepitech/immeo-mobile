# Immeo Mobile

Application mobile de gestion immobiliere destinee aux residents et locataires. Elle permet de suivre son logement, signaler des incidents, communiquer avec la copropriete et gerer son profil.

## Stack technique

- **Framework** : Expo 55 / React Native 0.83
- **Navigation** : Expo Router (file-based routing)
- **UI** : Tamagui (themes light/dark, design tokens, animations)
- **Backend** : Supabase (auth, base de donnees PostgreSQL, storage)
- **State management** : Zustand (auth, theme)
- **Data fetching** : TanStack React Query v5
- **Icones** : lucide-react-native
- **Tests** : Jest + React Native Testing Library
- **Linting** : ESLint + Prettier + Husky (pre-commit)
- **Monitoring** : Sentry (error tracking)

## Prerequis

- Node.js 20+
- npm
- Expo CLI (`npx expo`)
- Un projet Supabase (ou instance locale via `supabase start`)

## Installation

```bash
git clone <repo-url>
cd immeo-mobile
npm install
```

Copier le fichier d'environnement et renseigner les valeurs :

```bash
cp .env.example .env
```

## Variables d'environnement

| Variable                       | Description                        |
| ------------------------------ | ---------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`     | URL du projet Supabase             |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`| Cle publique (anon) Supabase       |

## Scripts disponibles

| Commande         | Description                              |
| ---------------- | ---------------------------------------- |
| `npm start`      | Demarrer le serveur de developpement Expo|
| `npm run ios`    | Lancer sur simulateur iOS                |
| `npm run android`| Lancer sur emulateur Android             |
| `npm run web`    | Lancer en mode web                       |
| `npm run lint`   | Linter le code (ESLint)                  |
| `npm run lint:fix`| Linter et corriger automatiquement      |
| `npm run format` | Formater le code (Prettier)              |
| `npm test`       | Lancer les tests                         |
| `npm run test:watch`| Tests en mode watch                   |

## Structure du projet

```
app/                  # Ecrans (Expo Router file-based routing)
  (app)/              # Ecrans authentifies (tabs)
    index.tsx         # Accueil
    appart.tsx        # Mon appartement
    copro.tsx         # Copropriete
    signaler.tsx      # Signalements / incidents
    profil.tsx        # Profil et parametres
  (auth)/             # Ecrans d'authentification
    login.tsx
    register.tsx
  _layout.tsx         # Layout racine (providers, theme)
components/
  ui/                 # Composants generiques (boutons, badges, cards)
  features/           # Composants par fonctionnalite
    home/
    appart/
    copro/
    signaler/
    profil/
constants/            # Couleurs, configuration
fixtures/             # Donnees de demonstration
hooks/                # Hooks metier (useHome, useProfile, etc.)
lib/                  # Clients (Supabase, React Query, Sentry)
stores/               # Stores Zustand (auth, theme)
types/                # Types TypeScript (database, etc.)
supabase/             # Configuration Supabase locale
```

## Theme sombre

L'application supporte trois modes d'affichage : **Clair**, **Sombre** et **Automatique** (suit le theme systeme). Le choix est persiste localement via AsyncStorage. Le selecteur se trouve dans l'ecran Profil > Apparence.

## Contribution

1. Creer une branche depuis `main`
2. Suivre les conventions ESLint/Prettier en place
3. Les hooks Husky verifient le code au commit (lint-staged)
4. Ecrire des tests pour les nouvelles fonctionnalites
5. Ouvrir une Pull Request avec description claire
