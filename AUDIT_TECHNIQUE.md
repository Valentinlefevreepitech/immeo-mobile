# Audit Technique - Immeo Mobile

**Date :** 15 mars 2026
**Version auditee :** 1.0.0 (commit `b7b1408`)
**Stack :** Expo 55 / React Native 0.83 / Tamagui RC / Supabase / Zustand

---

## Table des matieres

1. [Resume executif](#1-resume-executif)
2. [Securite](#2-securite)
3. [Architecture & Structure](#3-architecture--structure)
4. [Dependances & Compatibilite](#4-dependances--compatibilite)
5. [Qualite du code](#5-qualite-du-code)
6. [Authentification & Gestion d'etat](#6-authentification--gestion-detat)
7. [Performance](#7-performance)
8. [UX & Accessibilite](#8-ux--accessibilite)
9. [Outillage manquant](#9-outillage-manquant)
10. [Plan d'action](#10-plan-daction)

---

## 1. Resume executif

| Domaine | Niveau | Commentaire |
|---------|--------|-------------|
| Securite | CRITIQUE | Tokens de session stockes en clair (AsyncStorage) |
| Architecture | BON | Stack moderne, file-based routing, separation claire |
| Dependances | ATTENTION | Tamagui en Release Candidate, 3 libs d'icones |
| Qualite code | MOYEN | Pas de linter, pas de tests, fichiers volumineux |
| Performance | MOYEN | Pas de memoisation, chargement de polices bloquant |
| UX | MOYEN | UI soignee mais interactions 100% mockees |

**Verdict :** L'architecture est saine et l'UI est bien realisee, mais plusieurs points critiques doivent etre corriges avant toute mise en production.

---

## 2. Securite

### 2.1 CRITIQUE - Stockage des tokens en clair

**Fichier :** `lib/supabase.ts:10-15`

```typescript
auth: {
  storage: AsyncStorage, // ← Pas chiffre
}
```

`AsyncStorage` stocke les donnees en clair sur le filesystem. Sur Android, un appareil roote peut lire les tokens de session.

**Correction :** Utiliser `expo-secure-store` pour stocker les tokens sensibles :

```typescript
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
```

### 2.2 CRITIQUE - Pas de validation des entrees

**Fichiers :** `app/(auth)/login.tsx`, `stores/authStore.ts`

- L'email n'est pas valide par regex avant envoi a Supabase
- Le mot de passe n'a aucune contrainte de complexite cote client
- L'indicateur de force du mot de passe ne verifie que la longueur

**Risques :** Soumissions inutiles au serveur, mauvaise UX, mots de passe faibles.

### 2.3 MOYEN - Pas de rate limiting sur l'authentification

Le formulaire de login peut etre soumis indefiniment sans delai. Un utilisateur (ou un script) peut spammer le bouton de connexion.

**Correction :** Ajouter un debounce sur la soumission + desactiver le bouton pendant le chargement.

### 2.4 MOYEN - Donnees sensibles hardcodees

Des numeros de telephone, adresses et noms sont ecrits en dur dans les ecrans (`index.tsx`, `appart.tsx`, `copro.tsx`). Meme si c'est du mock, ces donnees ne doivent jamais apparaitre dans le code source en production.

### 2.5 INFO - Pas de certificate pinning

La connexion a Supabase ne fait pas de certificate pinning. Acceptable pour une v1 mais a considerer pour une app manipulant des donnees financieres (paiements de loyer).

---

## 3. Architecture & Structure

### 3.1 Points positifs

- **File-based routing** via Expo Router : clair et maintenable
- **Separation auth/app** avec route groups `(auth)` et `(app)`
- **AuthGuard** centralise dans `_layout.tsx` : bon pattern
- **Providers bien ordonnes** : GestureHandler > Tamagui > QueryClient > SafeArea > Auth
- **Design system** bien structure dans `tamagui.config.ts` (tokens, themes, animations)
- **Types metier** bien definis dans `types/database.ts`

### 3.2 Repertoires vides

```
components/ui/       → .gitkeep uniquement
components/features/ → .gitkeep uniquement
hooks/               → .gitkeep uniquement
```

Aucun composant reutilisable n'a ete extrait. Les ecrans contiennent tout le code UI en monolithique (200-400 lignes par fichier).

**Impact :** Duplication de code inevitable entre les ecrans, difficulte a maintenir la coherence UI.

### 3.3 Types de base de donnees non generes

**Fichier :** `types/database.ts:1-2`

```typescript
// Types generes par Supabase - placeholder
// Lancer : npx supabase gen types typescript --linked > types/database.ts
```

L'interface `Database` est vide (`Record<string, never>`). Aucune verification de type n'est faite sur les requetes Supabase.

### 3.4 Dark mode configure mais non branche

Le theme dark est defini dans `tamagui.config.ts` mais `_layout.tsx:61` force `defaultTheme="light"`. Pas de mecanisme de bascule.

---

## 4. Dependances & Compatibilite

### 4.1 Tamagui en Release Candidate

```json
"tamagui": "^2.0.0-rc.26"
```

Utiliser une RC en production expose a des breaking changes lors de la sortie de la v2 stable. Le caret `^` aggrave le risque car il autorise les montees automatiques.

**Correction :** Verrouiller la version exacte (`"2.0.0-rc.26"` sans `^`) ou migrer vers stable des que disponible.

### 4.2 Triple bibliotheque d'icones

Le projet utilise simultanement :

| Lib | Usage |
|-----|-------|
| `@expo/vector-icons` (Ionicons) | Tab bar, ecrans |
| `lucide-react-native` | Quelques ecrans |
| `react-native-heroicons` | Quelques ecrans |

**Impact :** Augmentation inutile de la taille du bundle. Chaque lib embarque son propre set d'icones SVG.

**Correction :** Choisir une seule lib (recommendation : `lucide-react-native` pour sa legerete et son exhaustivite).

### 4.3 Polyfill URL

```typescript
import 'react-native-url-polyfill/auto'; // lib/supabase.ts:1
```

Ce polyfill est requis par Supabase sur React Native mais ajoute du poids. Verifier si les versions recentes de React Native 0.83 incluent deja un support natif de l'API URL.

### 4.4 Vulnerabilites npm

```
npm audit → 0 vulnerabilities
```

Aucune vulnerabilite connue dans les dependances actuelles.

---

## 5. Qualite du code

### 5.1 Aucun linter ni formatter

Le projet n'a ni ESLint, ni Prettier, ni aucun outil d'analyse statique.

**Risques :**
- Inconsistance de style entre contributeurs
- Bugs silencieux non detectes
- Pas de pre-commit hooks pour bloquer le code non conforme

### 5.2 Aucun test

Pas de framework de test installe. Pas de repertoire `__tests__/`. Pas de script `test` dans `package.json`.

### 5.3 Fichiers ecrans trop volumineux

Les ecrans (`index.tsx`, `appart.tsx`, `copro.tsx`, `signaler.tsx`, `profil.tsx`, `login.tsx`) font chacun 200-400 lignes et melangent :
- Logique metier
- Composants UI inline
- Styles inline
- Donnees mockees

**Correction :** Extraire les composants reutilisables dans `components/`, les donnees mock dans des fixtures, et la logique dans des hooks custom.

### 5.4 Melange francais/anglais

Les commentaires et les noms de variables alternent entre francais et anglais sans convention claire. Exemple : `buildProfileFromAuth` (EN) cotoie `Colocataire` (FR).

**Recommendation :** Code et noms de variables en anglais, commentaires et labels UI en francais.

---

## 6. Authentification & Gestion d'etat

### 6.1 Erreurs silencieuses dans `initialize()`

**Fichier :** `stores/authStore.ts:80-82`

```typescript
} catch (_) {
  // Session invalide ou erreur reseau
}
```

Toute erreur reseau ou de session est avalee silencieusement. En dev, cela rend le debug extremement difficile.

**Correction :** Logger l'erreur au minimum via `console.warn` en dev.

### 6.2 Role hardcode a l'inscription

**Fichier :** `stores/authStore.ts:134`

```typescript
role: 'resident', // Toujours resident
```

Le role est defini cote client dans les `user_metadata`. Un utilisateur pourrait modifier cette valeur via l'API Supabase directement.

**Correction :** Le role doit etre assigne cote serveur (trigger Supabase ou fonction Edge).

### 6.3 Pas de gestion de refresh token explicite

Le store s'appuie entierement sur `autoRefreshToken: true` de Supabase. Si le refresh echoue (token expire apres longue inactivite), l'utilisateur verra un ecran vide sans message d'erreur.

### 6.4 Pas de listener `onAuthStateChange`

Le store ne s'abonne pas aux changements d'etat d'authentification Supabase. Si la session expire en arriere-plan, l'app ne le detecte pas.

**Correction :**

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    // Mettre a jour le store
  }
});
```

---

## 7. Performance

### 7.1 Chargement de polices bloquant

**Fichier :** `app/_layout.tsx:40-47`

6 variantes de la police Inter sont chargees de maniere synchrone. L'app affiche un ecran blanc (`return null`) tant que les polices ne sont pas pretes.

**Correction :** Afficher un splash screen anime ou ne charger que 2-3 variantes essentielles.

### 7.2 Pas de memoisation

Aucun composant n'utilise `React.memo`, `useMemo` ou `useCallback`. Sur les listes (paiements, messages, annonces), chaque re-render du parent re-render tous les items.

### 7.3 Pas de cache persistant pour React Query

```typescript
// lib/queryClient.ts
staleTime: 1000 * 60 * 5, // 5 minutes
```

Le cache est en memoire uniquement. A chaque redemarrage de l'app, toutes les donnees sont refetchees. Pas de strategie offline.

### 7.4 Pas de lazy loading des ecrans

Tous les ecrans sont importes statiquement. Expo Router supporte le lazy loading natif, mais aucune configuration n'est en place pour les ecrans lourds.

---

## 8. UX & Accessibilite

### 8.1 Interactions 100% mockees

Tous les boutons d'action affichent un `Alert.alert()` au lieu d'effectuer une action reelle. Liste non exhaustive :
- Copier un numero de telephone → Alert
- Voir un document → Alert
- Signaler un incident → stocke en state local, perdu au reload
- Voter dans un sondage → state local, non persiste
- Tous les menus du profil → Alert

### 8.2 Pas d'Error Boundary

Si un composant enfant throw une erreur, l'app entiere crash. Aucun `ErrorBoundary` n'est present.

### 8.3 Pas d'accessibilite (a11y)

- Pas de `accessibilityLabel` sur les boutons
- Pas de `accessibilityRole` sur les elements interactifs
- Contraste des couleurs non verifie (WCAG AA)
- Pas de support lecteur d'ecran

### 8.4 Pas de gestion du clavier sur tous les ecrans

Seul le formulaire de login a un `KeyboardAvoidingView`. Les autres ecrans avec des inputs (signaler) n'en ont pas.

---

## 9. Outillage manquant

| Outil | Status | Priorite |
|-------|--------|----------|
| ESLint + Prettier | Absent | Haute |
| Jest / Testing Library | Absent | Haute |
| Husky + lint-staged | Absent | Haute |
| CI/CD (EAS Build) | Absent | Haute |
| Sentry / error tracking | Absent | Haute |
| README.md | Absent | Moyenne |
| Storybook (composants) | Absent | Basse |
| i18n (internationalisation) | Absent | Basse |

---

## 10. Plan d'action

### Phase 1 — Corrections critiques (a faire immediatement)

- [ ] Remplacer `AsyncStorage` par `expo-secure-store` pour les tokens d'auth
- [ ] Ajouter la validation email (regex) et mot de passe (complexite) cote client
- [ ] Desactiver le bouton de login pendant le chargement (eviter double soumission)
- [ ] Ajouter `onAuthStateChange` dans le auth store pour detecter les expirations de session
- [ ] Deplacer l'assignation du role cote serveur (trigger ou Edge Function Supabase)

### Phase 2 — Stabilisation technique

- [ ] Installer ESLint + Prettier + configuration recommandee Expo
- [ ] Installer Husky + lint-staged pour les pre-commit hooks
- [ ] Verrouiller la version de Tamagui (retirer le `^`)
- [ ] Choisir une seule bibliotheque d'icones et supprimer les autres
- [ ] Generer les vrais types Supabase (`npx supabase gen types typescript`)
- [ ] Ajouter un `ErrorBoundary` global dans `_layout.tsx`
- [ ] Logger les erreurs en dev dans `initialize()` au lieu de les ignorer

### Phase 3 — Qualite & Testabilite

- [ ] Extraire les composants reutilisables dans `components/ui/`
- [ ] Extraire les hooks custom (`useAuth`, `useIncidents`, etc.) dans `hooks/`
- [ ] Deplacer les donnees mockees dans des fixtures separees
- [ ] Installer Jest + React Testing Library
- [ ] Ecrire les tests unitaires pour `authStore` et les utils
- [ ] Ajouter `accessibilityLabel` sur les elements interactifs

### Phase 4 — Integration backend

- [ ] Connecter les ecrans aux API Supabase (remplacer les mocks)
- [ ] Implementer l'upload de photos (incidents, profil) avec Supabase Storage
- [ ] Implementer le telechargement de documents
- [ ] Ajouter un cache persistant pour React Query (offline first)
- [ ] Configurer les push notifications

### Phase 5 — Mise en production

- [ ] Configurer EAS Build (dev, staging, production)
- [ ] Integrer Sentry pour le suivi d'erreurs
- [ ] Audit de performance avec React DevTools Profiler
- [ ] Audit d'accessibilite WCAG AA
- [ ] Rediger le README avec les instructions de setup
- [ ] Implementer le dark mode (deja configure dans Tamagui)

---

*Audit realise sur le commit `b7b1408` — branche `main`*
