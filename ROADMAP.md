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
- **Clé (`app/(app)/_layout.tsx`, `AppartTabItem`)** : retirer l'animation (wiggle au repos + rotation -90° au tap), la rendre **statique**.
- **Transition d'écran sur "Mon appart"** : retirer l'effet "porte" (`components/ui/DoorTransition.tsx`, `rotateY` + perspective) actuellement utilisé dans `app/(app)/appart.tsx`. À remplacer par une simple apparition sans animation (ou réutiliser `TabSlideTransition` comme les 3 autres onglets, à clarifier).

### 2.5 Bug — double point orange en haut à droite (notifications)
**Cause identifiée** (diagnostic fait, pas encore corrigé) : deux badges de l'app utilisent `position="absolute"` sur une `View` Tamagui **sans que le parent immédiat n'ait `position="relative"`** :
- Le dot de notification sur la cloche (`app/(app)/index.tsx`, header, `PulsingDot` dans une `View position="absolute"`)
- Le badge orange de l'action rapide "AG" (`app/(app)/index.tsx`, composant `QuickAction`, `badge &&  <View position="absolute" .../>`)

Sur web, sans `position="relative"` explicite sur le parent, ces deux badges "s'échappent" vers le premier ancêtre positionné trouvé plus haut dans l'arbre — d'où leur apparition groupée dans le coin supérieur droit de l'écran, visible sur tous les écrans de l'app plutôt que sur la cloche et le bouton AG respectivement.
**Fix attendu** : ajouter `position="relative"` aux deux `View` parentes concernées dans `app/(app)/index.tsx`. Correction courte (2 lignes) une fois qu'on s'y attaque.

### 2.7 Refonte de la navigation (proposition utilisateur, 12/09/2026)
Idée soumise à valider avant implémentation (impact large : nav bar, 3 écrans principaux) :
- **Déplacer "Mon appart"** de la nav bar (actuellement 2ᵉ onglet, `app/(app)/appart.tsx`) **dans Profil**, plutôt qu'un onglet dédié.
- **Copro** : créer une section clairement dédiée **Annonces + Sondages** (séparée du reste), plutôt que noyée dans le segmented pill actuel à 3 onglets.
- **Fusionner Entraide et Messagerie** en un seul espace, au lieu des deux entrées actuelles du segmented pill Copro (Entraide) + bouton icône header (Messagerie) — cohérent avec 2.2 (repenser la messagerie P2P) puisque les conversations liées aux demandes d'entraide se rapprochent déjà d'une messagerie privée.
- Impact : `app/(app)/_layout.tsx` (nav bar, `TAB_ORDER`, `ACCUEIL_GROUP`/`COPRO_GROUP`), `app/(app)/copro.tsx` (restructuration complète des onglets), `app/(app)/profil.tsx`, `app/(app)/appart.tsx`. À traiter comme une phase à part entière, avec un plan dédié avant de coder.

---

*Dernière mise à jour : 12/09/2026.*
