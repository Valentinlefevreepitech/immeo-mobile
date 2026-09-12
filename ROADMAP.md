# Roadmap — Imméo Mobile

Document de suivi du chantier de refonte (`PROMPT_CLAUDE_CODE.md`, 8 phases) et des prochains projets. Mis à jour au fil des sessions.

---

## 1. Les 8 phases de la refonte

| # | Phase | Statut | Commit(s) |
|---|-------|--------|-----------|
| 1 | Tokens + nav bar (slide directionnel, transition clé/porte, unification des rôles) | ✅ Fait | `c78331e` |
| 2 | Dark mode sur les 4 écrans existants (Accueil, Copro, Appart, Profil) | ✅ Fait | `e3e57e4` |
| 3 | Dark mode + orbe radiale animée sur l'onboarding invitation | ✅ Fait | `f86c8f1` |
| 4 | Dark mode sur les écrans Incidents (liste, détail, signalement) | ✅ Fait | `203814c` |
| 5 | Sondages entre voisins (onglet Copro, détail, création 2 étapes) | ✅ Fait | `abba7a2` |
| 6 | Entraide (prêt d'objets/services entre voisins) | ✅ Fait | `6ec3119`, `eab1426`, `45b70b1` |
| 7 | AG (vote en ligne copropriétaire), Documents, Notifications à enrichir | ✅ Fait | `6ec3119` |
| 8 | Branchement backend Supabase (auth, tables sondages/entraide, storage, push) | ⬜ À faire | — |

**Constat récurrent (Phases 2-4)** : la plupart des écrans existaient déjà quasi conformes à la spec avant même le début de cette session (commit `c8c405a`, antérieur) — le travail réel a surtout consisté à brancher le mode sombre (`useThemeColors()`), qui existait en infrastructure depuis la Phase 1 mais n'était consommé nulle part.

**Phase 5** a été la première construction réelle : rien n'existait dans l'UI pour les sondages (juste un embryon mort dans `useCopro.ts`, jamais branché). Deux bugs y ont été trouvés et corrigés : un event bubbling web sur le vote, et un état non partagé entre écrans (migré vers un store Zustand dédié `stores/sondagesStore.ts`).

**Phase 6** a suivi le même schéma que la 5 (fixture + store + hook + écrans, construits de zéro) : nouvel onglet Entraide, fiche de prêt, demande d'emprunt avec message, gestion des demandes/annonces. Deux itérations de feedback utilisateur après coup ont amélioré le flow : (1) les CTA rapides des cartes (Demander/Réserver/Je participe) passent maintenant par l'écran de demande avec message au lieu de marquer l'offre comme prise instantanément, avec un accès "Mes prêts" mis en avant en haut de l'onglet ; (2) `publierAnnonce()` ne créait qu'une entrée dans "Mes annonces" (visible seulement en gestion) sans jamais l'ajouter à la liste réellement parcourue par les voisins — corrigé, le store crée maintenant une vraie `EntraideOffer`.

**Phase 7** n'a nécessité que la migration mécanique `useThemeColors()` sur AG/Documents/Notifications (déjà quasi conformes à la spec).

**Bonus hors-phases** : un sélecteur de thème Clair/Sombre/Système avait été ajouté dans Profil > Apparence (`1d8b7ff`), puis **retiré sur demande utilisateur** (`b34f2b2`) — préférence pour suivre uniquement le thème système, sans bouton manuel. Un bug de fond blanc codé en dur (`#F7FCFB`) cassant la lisibilité en mode sombre a aussi été trouvé et corrigé sur les zones photo de `signaler.tsx` et `entraide-annonce.tsx` (`518d756`), ce correctif reste en place.

**Restructuration navigation (12/09/2026, `d268627`)** : "Mon appart" a quitté la nav bar pour Profil > Compte, Copro s'est recentré sur Annonces/Sondages, et un nouvel onglet `entraide.tsx` fusionne Entraide + Messagerie (segmented Offres/Messages). Détails en 2.7 (fait) et 2.4 (résolu en effet de bord). Un bug de navigation systémique (retour vers le mauvais écran) a été découvert au passage puis corrigé — voir 2.6 (fait).

**Phase 8** reste à faire et nécessitera un accès au projet Supabase réel.

---

## 2. Backlog — prochains projets

### 2.1 Refonte du login (priorité : préparer la mise en prod)
- Remplacer le flow actuel par un système classique **register/login** (email + mot de passe).
- Ajouter la connexion **Google** dans un second temps.
- Après connexion : flow pour **rejoindre ou créer une copropriété** (actuellement tout est hardcodé sur "Résidence Les Jardins" via `DEMO_USER`).
- Fichiers concernés probables : `app/(auth)/login.tsx` (740 lignes actuellement, login+register combinés), `stores/authStore.ts`, `app/(auth)/invitation.tsx` (le flow d'activation par invitation existe déjà et pourra servir de base pour le "rejoindre une copro").

### 2.2 Messagerie privée entre locataires — à revoir
- Aujourd'hui : **pas de messagerie P2P résident** (choix P0 assumé, voir commentaire dans `fixtures/copro.ts` — uniquement syndic + gardien).
- À faire : permettre les messages privés entre voisins, **avec un consentement explicite** (choisir de recevoir ou non des messages privés — s'appuiera probablement sur le toggle "Annuaire des voisins" déjà présent dans Profil > Consentements, ou un nouveau toggle dédié).
- Impact : nouvelle table/flow backend (Phase 8), nouvel écran de conversation, gestion des demandes de contact.
- **Retour utilisateur (12/09/2026)** : le système actuel (syndic + gardien uniquement, `MessagesTab` dans `copro.tsx`) est à repenser en profondeur pour intégrer le P2P, potentiellement **fusionné avec Entraide** — voir 2.7.

### 2.1bis Annuaire des voisins
- Actuellement le toggle "Annuaire des voisins" existe dans Profil > Consentements (`app/(app)/profil.tsx`) mais **aucun écran ne montre la liste des habitants** — le toggle contrôle une visibilité qui n'a nulle part où s'exercer.
- À faire : un écran "Voisins" listant les résidents ayant opté pour la visibilité (nom, étage, éventuellement rôle gardien/syndic), probablement accessible depuis Copro ou Profil.
- Lié à 2.2 : cet annuaire est probablement le point d'entrée naturel pour démarrer une conversation privée une fois la messagerie P2P en place.

### 2.3 Infos poubelles
- Ajouter les informations de collecte des déchets (quels jours sortir quelles poubelles).
- Probablement un nouveau bloc dans Copro (annonces) ou un écran dédié type "Infos pratiques" — à définir précisément avant implémentation (emplacement dans l'app, source de la donnée : mock ou paramétrable par le syndic).

### 2.4 Nav bar — simplifier les animations
✅ **Résolu en effet de bord de 2.7** (`d268627`) : "Mon appart" n'est plus un onglet de la nav bar (donc plus de clé animée `AppartTabItem` à rendre statique — le composant a été entièrement supprimé), et l'écran utilise maintenant `PageTransition` (fade standard) au lieu de l'effet "porte" (`DoorTransition`, supprimé).

### 2.6 Bug — retour (back) vers le mauvais onglet depuis un écran poussé
✅ **Corrigé** (12/09/2026). Root cause confirmée par instrumentation (log temporaire de `state.history` dans `CustomTabBar`) : l'historique du `Tabs` navigator ne contient jamais plus de 2 entrées (`[index, écran-focus-actuel]`) — chaque `navigation.navigate()` remplace la 2ᵉ entrée au lieu de l'empiler, donc `router.back()` retombe systématiquement sur `index`, quel que soit l'onglet réellement précédent. Ce n'est pas spécifique à 2.7 : les 13 écrans secondaires de l'app (`ag`, `documents`, `notifications`, `incidents`, `incident-detail`, `signaler`, `sondage-detail`, `sondage-creer`, `entraide-fiche`, `entraide-demande`, `entraide-gestion`, `entraide-annonce`, `appart`) utilisaient tous `router.back()` et étaient donc tous affectés.
**Fix** : remplacé chaque `onBack={() => router.back()}` par un `router.replace('/cible-explicite')` vers l'écran parent réel (ex. `appart` → `/profil`, `entraide-gestion`/`entraide-fiche` → `/entraide`, `incident-detail` → `/incidents`, `ag`/`documents`/`notifications`/`incidents` → `/`, `sondage-detail`/`sondage-creer` → `/copro`). Cas particulier : `entraide-demande` (accessible directement depuis la liste Entraide OU depuis la fiche) revient vers `/entraide-fiche` avec le même `id`, pour préserver un vrai comportement "un niveau en arrière". Au passage, deux routes obsolètes issues de la restructuration 2.7 (`entraide-demande.tsx` et `entraide-annonce.tsx` pointaient encore vers `/(app)/copro` au lieu de `/entraide`) ont aussi été corrigées.
Testé manuellement : reproduction du scénario du bug initial (Accueil → Entraide → Copro → Profil → Mon appart → Retour) donne maintenant bien Profil ; idem pour Entraide → Mes prêts → Retour (→ Entraide) et fiche → Demander → Retour (→ la fiche exacte, pas la racine Entraide).

### 2.5 Bug — double point orange en haut à droite (notifications)
✅ **Corrigé** (12/09/2026). Cause confirmée : deux badges de `app/(app)/index.tsx` utilisaient `position="absolute"` sur une `View` Tamagui sans que le parent immédiat n'ait `position="relative"` — le dot de la cloche (header) et le badge de l'action rapide "AG" (`QuickAction`). Sans `position="relative"` explicite sur le parent, ces badges "s'échappaient" vers le premier ancêtre positionné trouvé plus haut dans l'arbre. Fix : ajout de `position="relative"` sur les deux `View` parentes concernées. Vérifié visuellement clair et sombre — chaque badge reste bien ancré sur sa propre icône.

### 2.7 Refonte de la navigation (proposition utilisateur, 12/09/2026)
✅ **Fait** (`d268627`) :
- **"Mon appart"** a quitté la nav bar pour une entrée dans Profil > Compte (icône clé, `router.push('/appart')`), écran avec `ScreenHeader` + retour.
- **Copro** recentré sur **Annonces + Sondages** uniquement (section dédiée aux communications officielles).
- **Entraide et Messagerie fusionnés** dans un nouvel onglet racine `app/(app)/entraide.tsx` (segmented interne Offres/Messages), qui prend la place de "Mon appart" dans la pilule de la nav bar (icône `HandHelping`, badge non-lu).
- Le bouton rond isolé Copro passe de l'icône message à `Megaphone`.
- `components/ui/SegmentedTabs.tsx` extrait en composant partagé (était dupliqué).

Note : la vraie refonte de la messagerie P2P (2.2) reste à faire — la fusion ici n'a déplacé que l'UI existante (syndic/gardien uniquement), pas ajouté le P2P.

---

*Dernière mise à jour : 12/09/2026 (restructuration navigation).*
