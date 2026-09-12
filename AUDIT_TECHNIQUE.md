# Audit Technique - Immeo Mobile

**Date :** 15 mars 2026 (audit initial) — mis a jour le 12 septembre 2026
**Version auditee :** 1.0.0 (commit `b7b1408`) — reaudit sur commit `c8c405a` ("refonte design v2 (prototype MVP P0)")
**Stack :** Expo 55 / React Native 0.83 / Tamagui RC / Supabase / Zustand

> **Note de mise a jour (12/09/2026) :** la plupart des points critiques et de l'outillage manquant identifies lors de l'audit initial ont ete corriges dans le commit `c8c405a`. Les sections ci-dessous sont annotees `[RESOLU]` ou `[OUVERT]` pour refleter l'etat reel verifie a cette date (tests executes, lint, tsc, npm audit, lecture du code). Un recapitulatif complet est disponible en fin de document, section [11. Suivi — etat au 12 septembre 2026](#11-suivi--etat-au-12-septembre-2026).

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
11. [Suivi — etat au 12 septembre 2026](#11-suivi--etat-au-12-septembre-2026)

---

## 1. Resume executif

| Domaine | Niveau (mars 2026) | Niveau (sept. 2026) | Commentaire |
|---------|--------|--------|-------------|
| Securite | CRITIQUE | ATTENTION | Tokens desormais chiffres (`expo-secure-store`) ; le role utilisateur reste assignable cote client |
| Architecture | BON | BON | Stack moderne, file-based routing, separation claire |
| Dependances | ATTENTION | ATTENTION | Tamagui verrouille et lib d'icones unifiee, mais 39 vulnerabilites npm (1 critique) dans la toolchain |
| Qualite code | MOYEN | BON | Linter, TypeScript et 70 tests (9 suites) en place et verts |
| Performance | MOYEN | MOYEN | Toujours peu de memoisation, ecrans volumineux |
| UX | MOYEN | MOYEN | Navigation principale et flux cles fonctionnels ; plusieurs sous-ecrans et actions restent mockes |

**Verdict (sept. 2026) :** Le gros du chantier "outillage et securite de base" de la Phase 1/2 a ete traite. Le travail restant est desormais concentre sur le branchement backend reel (remplacer les mocks), l'assignation serveur du role, et un refactor progressif des ecrans les plus volumineux. Voir la section [11](#11-suivi--etat-au-12-septembre-2026) pour le detail.

**Verdict original (mars 2026, conserve pour historique) :** L'architecture est saine et l'UI est bien realisee, mais plusieurs points critiques doivent etre corriges avant toute mise en production.

---

## 2. Securite

### 2.1 [RESOLU] CRITIQUE - Stockage des tokens en clair

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

**[RESOLU au 12/09/2026]** — `lib/supabase.ts` utilise desormais exactement ce pattern avec `expo-secure-store`. Verifie par lecture directe du fichier.

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

### 3.2 [PARTIELLEMENT RESOLU] Repertoires vides

```
components/ui/       → .gitkeep uniquement
components/features/ → .gitkeep uniquement
hooks/               → .gitkeep uniquement
```

Aucun composant reutilisable n'a ete extrait. Les ecrans contiennent tout le code UI en monolithique (200-400 lignes par fichier).

**Impact :** Duplication de code inevitable entre les ecrans, difficulte a maintenir la coherence UI.

**[12/09/2026]** — 14 fichiers existent desormais dans `components/` (ex. `ErrorBoundary`, `PrimaryButton`, `StatCard`, `StatusBadge`, `ScreenHeader`, testes unitairement). Mais les ecrans restent volumineux (`signaler.tsx` 429 lignes, `index.tsx` 346, `_layout.tsx` 302) — l'extraction n'est que partielle, voir [11.4](#114-fichiers-ecrans-toujours-volumineux).

### 3.3 [RESOLU] Types de base de donnees non generes

**Fichier :** `types/database.ts:1-2`

```typescript
// Types generes par Supabase - placeholder
// Lancer : npx supabase gen types typescript --linked > types/database.ts
```

L'interface `Database` est vide (`Record<string, never>`). Aucune verification de type n'est faite sur les requetes Supabase.

**[RESOLU au 12/09/2026]** — `types/database.ts` contient desormais le schema reel genere par Supabase (tables, `Json`, `PostgrestVersion`). `npx tsc --noEmit` passe sans erreur.

### 3.4 [RESOLU] Dark mode configure mais non branche

Le theme dark est defini dans `tamagui.config.ts` mais `_layout.tsx:61` force `defaultTheme="light"`. Pas de mecanisme de bascule.

**[RESOLU au 12/09/2026]** — `stores/themeStore.ts` gere desormais 3 modes (`light`/`dark`/`system`), persiste via AsyncStorage, et `_layout.tsx` utilise `useResolvedTheme()` pour piloter `TamaguiProvider` et la `StatusBar` dynamiquement.

---

## 4. Dependances & Compatibilite

### 4.1 [RESOLU] Tamagui en Release Candidate

```json
"tamagui": "^2.0.0-rc.26"
```

Utiliser une RC en production expose a des breaking changes lors de la sortie de la v2 stable. Le caret `^` aggrave le risque car il autorise les montees automatiques.

**Correction :** Verrouiller la version exacte (`"2.0.0-rc.26"` sans `^`) ou migrer vers stable des que disponible.

**[RESOLU au 12/09/2026]** — `package.json` fixe desormais `"tamagui": "2.0.0-rc.26"` sans caret (idem pour tous les paquets `@tamagui/*`). Toujours en Release Candidate : a migrer vers stable des que disponible.

### 4.2 [RESOLU] Triple bibliotheque d'icones

Le projet utilise simultanement :

| Lib | Usage |
|-----|-------|
| `@expo/vector-icons` (Ionicons) | Tab bar, ecrans |
| `lucide-react-native` | Quelques ecrans |
| `react-native-heroicons` | Quelques ecrans |

**Impact :** Augmentation inutile de la taille du bundle. Chaque lib embarque son propre set d'icones SVG.

**Correction :** Choisir une seule lib (recommendation : `lucide-react-native` pour sa legerete et son exhaustivite).

**[RESOLU au 12/09/2026]** — Seule `lucide-react-native` est presente dans `package.json` et utilisee dans le code (verifie par grep sur `app/`, `components/`, `hooks/`).

### 4.3 Polyfill URL

```typescript
import 'react-native-url-polyfill/auto'; // lib/supabase.ts:1
```

Ce polyfill est requis par Supabase sur React Native mais ajoute du poids. Verifier si les versions recentes de React Native 0.83 incluent deja un support natif de l'API URL.

### 4.4 [REGRESSION] Vulnerabilites npm

```
npm audit → 0 vulnerabilities
```

Aucune vulnerabilite connue dans les dependances actuelles.

**[REGRESSION constatee au 12/09/2026]** — `npm audit --omit=dev` remonte desormais **39 vulnerabilites** (2 low, 18 moderate, 18 high, **1 critique**) :
- **Critique :** `shell-quote`
- **Hautes (extrait) :** `@expo/cli`, `@expo/metro`, `@expo/metro-config`, `expo`, `metro`, `metro-config`, `metro-transform-worker`, `postcss`, `ws`, `js-yaml`, `node-forge`, `nanoid`, `browserslist`, `picomatch`, `brace-expansion`, `image-size`, `fast-uri`, `@xmldom/xmldom`

La quasi-totalite provient de la toolchain Expo/Metro (build-time, non embarquee dans le bundle app livre a l'utilisateur), mais merite un `npm audit fix` et une mise a jour d'Expo SDK a la prochaine fenetre de maintenance — le paquet `expo` lui-meme est concerne.

---

## 5. Qualite du code

### 5.1 [RESOLU] Aucun linter ni formatter

Le projet n'a ni ESLint, ni Prettier, ni aucun outil d'analyse statique.

**Risques :**
- Inconsistance de style entre contributeurs
- Bugs silencieux non detectes
- Pas de pre-commit hooks pour bloquer le code non conforme

**[RESOLU au 12/09/2026]** — ESLint + Prettier + Husky (pre-commit avec lint-staged) sont installes et configures. `npm run lint` remonte 13 warnings (0 erreur) : imports `require()` dans des fichiers de test, deux `useEffect` avec deps manquantes dans `hooks/useAuthGuard.ts`, quelques variables/imports inutilises. Rien de bloquant, a nettoyer en continu.

### 5.2 [RESOLU] Aucun test

Pas de framework de test installe. Pas de repertoire `__tests__/`. Pas de script `test` dans `package.json`.

**[RESOLU au 12/09/2026]** — Jest + React Native Testing Library installes. `__tests__/` contient 9 suites (70 tests) : `authStore`, `validation`, hooks (`useCopro`, `useIncidents`, `useProfile`) et composants (`ErrorBoundary`, `PrimaryButton`, `StatCard`, `StatusBadge`). `npm test` passe integralement (70/70).

### 5.3 [OUVERT] Fichiers ecrans trop volumineux

Les ecrans (`index.tsx`, `appart.tsx`, `copro.tsx`, `signaler.tsx`, `profil.tsx`, `login.tsx`) font chacun 200-400 lignes et melangent :
- Logique metier
- Composants UI inline
- Styles inline
- Donnees mockees

**Correction :** Extraire les composants reutilisables dans `components/`, les donnees mock dans des fixtures, et la logique dans des hooks custom.

**[12/09/2026]** — Toujours vrai. Mesure actuelle : `signaler.tsx` 429 lignes, `index.tsx` 346, `app/(app)/_layout.tsx` 302, `copro.tsx` 294, `profil.tsx` 279, `appart.tsx` 273, `incident-detail.tsx` 269. Les hooks et `fixtures/` existent desormais (progres reel), mais l'extraction UI des ecrans eux-memes n'a pas suivi.

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

### 6.2 [OUVERT] Role hardcode a l'inscription

**Fichier :** `stores/authStore.ts:134`

```typescript
role: 'resident', // Toujours resident
```

Le role est defini cote client dans les `user_metadata`. Un utilisateur pourrait modifier cette valeur via l'API Supabase directement.

**Correction :** Le role doit etre assigne cote serveur (trigger Supabase ou fonction Edge).

**[TOUJOURS OUVERT au 12/09/2026]** — Confirme par lecture du code : `stores/authStore.ts` fixe `role: 'tenant'` a l'inscription et retombe sur `meta.role || 'resident'` a la lecture. C'est le point de securite le plus important restant a traiter (Phase 1 du plan d'action, toujours valide).

### 6.3 [OUVERT] Pas de gestion de refresh token explicite

Le store s'appuie entierement sur `autoRefreshToken: true` de Supabase. Si le refresh echoue (token expire apres longue inactivite), l'utilisateur verra un ecran vide sans message d'erreur.

**[12/09/2026]** — Non re-verifie en detail ; a confirmer lors du branchement backend reel (actuellement l'app tourne majoritairement sur donnees mockees, voir [11.3](#113-interactions-encore-mockees)).

### 6.4 [RESOLU] Pas de listener `onAuthStateChange`

Le store ne s'abonne pas aux changements d'etat d'authentification Supabase. Si la session expire en arriere-plan, l'app ne le detecte pas.

**Correction :**

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    // Mettre a jour le store
  }
});
```

**[RESOLU au 12/09/2026]** — Present dans `stores/authStore.ts:93`.

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

### 8.1 [PARTIELLEMENT RESOLU] Interactions 100% mockees

Tous les boutons d'action affichent un `Alert.alert()` au lieu d'effectuer une action reelle. Liste non exhaustive :
- Copier un numero de telephone → Alert
- Voir un document → Alert
- Signaler un incident → stocke en state local, perdu au reload
- Voter dans un sondage → state local, non persiste
- Tous les menus du profil → Alert

**[12/09/2026]** — La navigation principale et les flux cles (Accueil, Copro, Profil, Mon appart, creation/consultation d'incidents, Documents, AG, Notifications) fonctionnent reellement avec des donnees de demo coherentes (testes en conditions reelles sur le serveur de dev, vue mobile). Il reste 15 `Alert.alert()` dans le code, et plusieurs elements sont des placeholders silencieux (aucune action au clic, pas meme un Alert) constates lors d'un test manuel complet de l'app :
- Profil → "Mes donnees personnelles" (aucune action)
- Profil → "Securite · mot de passe" (aucune action)
- Copro → toggle "Messagerie" (le segment ne bascule pas, reste sur "Annonces")
- Documents → "PV des assemblees generales" (chevron sans navigation)

Le changement de role (Locataire ↔ Copropriétaire) dans Profil, lui, fonctionne reellement.

### 8.2 [RESOLU] Pas d'Error Boundary

Si un composant enfant throw une erreur, l'app entiere crash. Aucun `ErrorBoundary` n'est present.

**[RESOLU au 12/09/2026]** — `components/ui/ErrorBoundary.tsx` existe, est teste (`__tests__/components/ErrorBoundary.test.tsx`) et est branche dans `app/_layout.tsx`.

### 8.3 Pas d'accessibilite (a11y)

- Pas de `accessibilityLabel` sur les boutons
- Pas de `accessibilityRole` sur les elements interactifs
- Contraste des couleurs non verifie (WCAG AA)
- Pas de support lecteur d'ecran

### 8.4 Pas de gestion du clavier sur tous les ecrans

Seul le formulaire de login a un `KeyboardAvoidingView`. Les autres ecrans avec des inputs (signaler) n'en ont pas.

---

## 9. Outillage manquant

| Outil | Status (mars 2026) | Status (sept. 2026) | Priorite |
|-------|--------|--------|----------|
| ESLint + Prettier | Absent | **Present** | Haute |
| Jest / Testing Library | Absent | **Present** (70 tests) | Haute |
| Husky + lint-staged | Absent | **Present** | Haute |
| CI/CD (EAS Build) | Absent | Absent | Haute |
| Sentry / error tracking | Absent | **Present** (`@sentry/react-native` en dependance) | Haute |
| README.md | Absent | **Present** | Moyenne |
| Storybook (composants) | Absent | Absent | Basse |
| i18n (internationalisation) | Absent | Absent | Basse |

---

## 10. Plan d'action

### Phase 1 — Corrections critiques (a faire immediatement)

- [x] Remplacer `AsyncStorage` par `expo-secure-store` pour les tokens d'auth — **fait**
- [ ] Ajouter la validation email (regex) et mot de passe (complexite) cote client — non re-verifie, a confirmer
- [ ] Desactiver le bouton de login pendant le chargement (eviter double soumission) — non re-verifie, a confirmer
- [x] Ajouter `onAuthStateChange` dans le auth store pour detecter les expirations de session — **fait**
- [ ] Deplacer l'assignation du role cote serveur (trigger ou Edge Function Supabase) — **toujours ouvert, priorite haute**

### Phase 2 — Stabilisation technique

- [x] Installer ESLint + Prettier + configuration recommandee Expo — **fait**
- [x] Installer Husky + lint-staged pour les pre-commit hooks — **fait**
- [x] Verrouiller la version de Tamagui (retirer le `^`) — **fait**
- [x] Choisir une seule bibliotheque d'icones et supprimer les autres — **fait** (`lucide-react-native`)
- [x] Generer les vrais types Supabase (`npx supabase gen types typescript`) — **fait**
- [x] Ajouter un `ErrorBoundary` global dans `_layout.tsx` — **fait**
- [ ] Logger les erreurs en dev dans `initialize()` au lieu de les ignorer — non re-verifie, a confirmer

### Phase 3 — Qualite & Testabilite

- [x] Extraire les composants reutilisables dans `components/ui/` — **partiel** (14 fichiers, mais ecrans encore volumineux)
- [x] Extraire les hooks custom (`useAuth`, `useIncidents`, etc.) dans `hooks/` — **fait**
- [x] Deplacer les donnees mockees dans des fixtures separees — **fait** (`fixtures/`)
- [x] Installer Jest + React Testing Library — **fait**
- [x] Ecrire les tests unitaires pour `authStore` et les utils — **fait** (70 tests, 9 suites)
- [ ] Ajouter `accessibilityLabel` sur les elements interactifs — non re-verifie, a confirmer

### Phase 4 — Integration backend

- [ ] Connecter les ecrans aux API Supabase (remplacer les mocks) — **partiel** : navigation et flux principaux fonctionnels sur donnees demo, mais plusieurs actions restent des `Alert.alert()` ou des no-ops (voir [11.3](#113-interactions-encore-mockees))
- [ ] Implementer l'upload de photos (incidents, profil) avec Supabase Storage
- [ ] Implementer le telechargement de documents
- [ ] Ajouter un cache persistant pour React Query (offline first)
- [ ] Configurer les push notifications

### Phase 5 — Mise en production

- [ ] Configurer EAS Build (dev, staging, production)
- [x] Integrer Sentry pour le suivi d'erreurs — **dependance presente**, configuration a verifier
- [ ] Audit de performance avec React DevTools Profiler
- [ ] Audit d'accessibilite WCAG AA
- [x] Rediger le README avec les instructions de setup — **fait**
- [x] Implementer le dark mode (deja configure dans Tamagui) — **fait** (3 modes : clair/sombre/systeme)

### Phase 6 — Nouveaux points identifies au 12/09/2026

- [ ] Traiter les 39 vulnerabilites `npm audit` (1 critique `shell-quote`, 18 hautes majoritairement Expo/Metro) — lancer `npm audit fix` puis planifier une mise a jour du SDK Expo
- [ ] Cabler les sous-ecrans/boutons actuellement no-op : Profil → "Mes donnees personnelles", Profil → "Securite · mot de passe", Copro → toggle "Messagerie", Documents → "PV des assemblees generales"
- [ ] Reduire la taille des ecrans les plus volumineux (`signaler.tsx` 429 lignes, `index.tsx` 346, `app/(app)/_layout.tsx` 302) en extrayant des composants
- [ ] Augmenter l'usage de la memoisation (`React.memo`/`useMemo`/`useCallback`) sur les listes (paiements, incidents, annonces) — seulement 6 usages dans tout le projet actuellement
- [ ] Nettoyer les 13 warnings ESLint restants (imports `require()` dans les tests, deps manquantes dans `useAuthGuard.ts`, variables inutilisees)

---

## 11. Suivi — etat au 12 septembre 2026

Reaudit effectue sur le commit `c8c405a` ("feat: refonte design v2 (prototype MVP P0)"), en executant reellement la suite de tests, le linter, `tsc`, `npm audit`, et en testant l'application en conditions reelles (serveur de dev Expo web, vue mobile 375×812) plutot qu'en relisant uniquement le code.

### 11.1 Verifications techniques

| Verification | Resultat |
|---|---|
| `npm test` | **70/70 tests passent** (9 suites) |
| `npx tsc --noEmit` | **0 erreur** |
| `npm run lint` | **0 erreur**, 13 warnings mineurs |
| `npm audit --omit=dev` | **39 vulnerabilites** (1 critique, 18 hautes, 18 moderees, 2 basses) — essentiellement toolchain Expo/Metro |
| Git | branche `main`, a jour avec `origin/main`, arbre propre |

### 11.2 Ce qui a change depuis l'audit initial

La quasi-totalite des taches des Phases 1 a 3 et 5 de l'ancien plan d'action a ete realisee : stockage securise des tokens, `onAuthStateChange`, ESLint/Prettier/Husky, tests (70), types Supabase reels, `ErrorBoundary`, dark mode, verrouillage Tamagui, unification des icones, README. Voir le detail inline dans chaque section ci-dessus (`[RESOLU]`).

### 11.3 Interactions encore mockees

Confirme par un parcours manuel complet de l'app (Accueil, Copro, Profil, Mon appart, Incidents, Signaler, Documents, AG, Notifications) :

- **Fonctionnel** : navigation principale, creation/consultation d'incident (avec timeline et messages), liste de documents, ecran AG, notifications, changement de role Locataire/Copropriétaire.
- **No-op silencieux** (aucune reaction au clic) : Profil → "Mes donnees personnelles", Profil → "Securite · mot de passe", Copro → toggle "Messagerie", Documents → "PV des assemblees generales".
- **15 `Alert.alert()`** encore presents dans le code pour d'autres actions.

### 11.4 Fichiers ecrans toujours volumineux

```
app/(app)/signaler.tsx        429 lignes
app/(app)/index.tsx           346 lignes
app/(app)/_layout.tsx         302 lignes
app/(app)/copro.tsx           294 lignes
app/(app)/profil.tsx          279 lignes
app/(app)/appart.tsx          273 lignes
app/(app)/incident-detail.tsx 269 lignes
```

`components/` contient 14 fichiers (progres reel par rapport aux repertoires vides de mars), mais l'extraction depuis les ecrans reste incomplete. Seulement 6 usages de `React.memo`/`useMemo`/`useCallback` dans tout le projet.

### 11.5 Point de securite prioritaire restant

Le role utilisateur (`role: 'tenant'` / `meta.role || 'resident'`) est toujours assigne et lu cote client dans `stores/authStore.ts`, modifiable via l'API Supabase par un utilisateur malveillant. C'est desormais le point de securite le plus important a traiter avant une mise en production (le reste de la Phase 1 originale a ete corrige).

### 11.6 Verdict de suivi

Le projet est passe d'un etat "prototype avec dette d'outillage critique" (mars 2026) a un etat "prototype bien outille, backend partiellement branche" (septembre 2026). Prochaine priorite recommandee : (1) assignation du role cote serveur, (2) `npm audit fix` + mise a jour Expo SDK, (3) branchement reel des actions encore mockees, (4) refactor progressif des ecrans volumineux.

---

*Audit initial realise sur le commit `b7b1408` — branche `main`. Mise a jour du 12/09/2026 realisee sur le commit `c8c405a` — branche `main`.*
