import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSondagesStore } from '@/stores/sondagesStore';
import type { Sondage, SondageDuree, SondagePortee } from '@/fixtures/sondages';

export interface CreateSondageInput {
  question: string;
  contexte: string;
  options: string[];
  dureeJours: SondageDuree;
  portee: SondagePortee;
  anonyme: boolean;
  commentairesActifs: boolean;
}

/**
 * Sondages entre voisins (Phase 5) : informels, sans valeur de vote en AG.
 * Etat partage via sondagesStore - le vote reste modifiable jusqu'a la cloture.
 */
export function useSondages() {
  const user = useAuthStore((s) => s.user);
  const active = useSondagesStore((s) => s.active);
  const passes = useSondagesStore((s) => s.passes);
  const voteStore = useSondagesStore((s) => s.vote);
  const addCommentStore = useSondagesStore((s) => s.addComment);
  const createStore = useSondagesStore((s) => s.create);

  const vote = useCallback((optionId: string) => voteStore(optionId), [voteStore]);

  const addComment = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      addCommentStore(user?.fullName || 'Vous', user?.initials || 'VL', trimmed);
    },
    [addCommentStore, user],
  );

  const create = useCallback(
    (input: CreateSondageInput): Sondage => {
      const sondage: Sondage = {
        id: `sondage-${Date.now()}`,
        auteur: { nom: user?.fullName || 'Vous', initials: user?.initials || 'VL', etage: '3ème' },
        question: input.question,
        contexte: input.contexte,
        options: input.options.map((label, index) => ({ id: `opt-${index}`, label, votes: 0 })),
        dureeJours: input.dureeJours,
        portee: input.portee,
        anonyme: input.anonyme,
        commentairesActifs: input.commentairesActifs,
        totalLots: 41,
        clotureLabel: `ferme dans ${input.dureeJours} j`,
        ouvertDepuisLabel: "Ouvert aujourd'hui",
        status: 'actif',
        monVote: null,
        comments: [],
      };
      createStore(sondage);
      return sondage;
    },
    [createStore, user],
  );

  const totalVotes = active ? active.options.reduce((sum, o) => sum + o.votes, 0) : 0;

  return { active, passes, totalVotes, vote, addComment, create };
}
