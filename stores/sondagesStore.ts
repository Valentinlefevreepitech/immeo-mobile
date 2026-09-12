import { create } from 'zustand';
import { MOCK_SONDAGE_ACTIF, MOCK_SONDAGES_PASSES, type Sondage } from '@/fixtures/sondages';

interface SondagesState {
  active: Sondage | null;
  passes: Sondage[];
  vote: (optionId: string) => void;
  addComment: (author: string, initials: string, text: string) => void;
  create: (sondage: Sondage) => void;
}

/**
 * Etat partage des sondages (Phase 5) : un seul store pour que l'onglet Copro
 * et l'ecran de detail restent coherents (meme vote, memes commentaires),
 * meme pattern que roleStore/navTransitionStore pour l'etat cross-ecran.
 */
export const useSondagesStore = create<SondagesState>((set, get) => ({
  active: MOCK_SONDAGE_ACTIF,
  passes: MOCK_SONDAGES_PASSES,

  vote: (optionId) => {
    const { active } = get();
    if (!active || active.monVote === optionId) return;

    const options = active.options.map((opt) => {
      if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
      if (opt.id === active.monVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
      return opt;
    });

    set({ active: { ...active, options, monVote: optionId } });
  },

  addComment: (author, initials, text) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        comments: [
          ...active.comments,
          { id: String(active.comments.length + 1), author, role: 'voisin', initials, text },
        ],
      },
    });
  },

  create: (sondage) => set({ active: sondage }),
}));
