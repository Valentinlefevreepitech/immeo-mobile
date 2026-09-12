import { renderHook, act } from '@testing-library/react-native';
import { useSondages } from '@/hooks/useSondages';
import { useSondagesStore } from '@/stores/sondagesStore';

jest.mock('@/stores/authStore', () => ({
  useAuthStore: (selector: (s: { user: { fullName: string; initials: string } }) => unknown) =>
    selector({ user: { fullName: 'Valentin Lefevre', initials: 'VL' } }),
}));

jest.mock('@/fixtures/sondages', () => ({
  MOCK_SONDAGE_ACTIF: {
    id: 'test-sondage',
    auteur: { nom: 'Sophie M.', initials: 'SM', etage: '3ème' },
    question: 'Composteur partagé ?',
    contexte: '',
    options: [
      { id: 'pour', label: 'Pour', votes: 10 },
      { id: 'contre', label: 'Contre', votes: 4 },
    ],
    dureeJours: 7,
    portee: 'immeuble',
    anonyme: false,
    commentairesActifs: true,
    totalLots: 41,
    clotureLabel: 'ferme dans 3 j',
    ouvertDepuisLabel: 'Ouvert 3 j',
    status: 'actif',
    monVote: null,
    comments: [],
  },
  MOCK_SONDAGES_PASSES: [
    {
      id: 'passe-1',
      auteur: { nom: 'Karim B.', initials: 'KB', etage: '5ème' },
      question: 'Question passée ?',
      contexte: '',
      options: [{ id: 'oui', label: 'Oui', votes: 5 }],
      dureeJours: 7,
      portee: 'immeuble',
      anonyme: false,
      commentairesActifs: false,
      totalLots: 41,
      clotureLabel: 'Clos',
      ouvertDepuisLabel: 'Clos le 1 mars',
      status: 'clos',
      monVote: 'oui',
      comments: [],
      winningOptionId: 'oui',
    },
  ],
}));

// Le store est un singleton partage entre tous les ecrans (et donc entre les
// tests) : on le remet dans un etat frais avant chaque test.
beforeEach(() => {
  useSondagesStore.setState(
    {
      active: {
        id: 'test-sondage',
        auteur: { nom: 'Sophie M.', initials: 'SM', etage: '3ème' },
        question: 'Composteur partagé ?',
        contexte: '',
        options: [
          { id: 'pour', label: 'Pour', votes: 10 },
          { id: 'contre', label: 'Contre', votes: 4 },
        ],
        dureeJours: 7,
        portee: 'immeuble',
        anonyme: false,
        commentairesActifs: true,
        totalLots: 41,
        clotureLabel: 'ferme dans 3 j',
        ouvertDepuisLabel: 'Ouvert 3 j',
        status: 'actif',
        monVote: null,
        comments: [],
      },
      passes: [
        {
          id: 'passe-1',
          auteur: { nom: 'Karim B.', initials: 'KB', etage: '5ème' },
          question: 'Question passée ?',
          contexte: '',
          options: [{ id: 'oui', label: 'Oui', votes: 5 }],
          dureeJours: 7,
          portee: 'immeuble',
          anonyme: false,
          commentairesActifs: false,
          totalLots: 41,
          clotureLabel: 'Clos',
          ouvertDepuisLabel: 'Clos le 1 mars',
          status: 'clos',
          monVote: 'oui',
          comments: [],
          winningOptionId: 'oui',
        },
      ],
    },
    false,
  );
});

describe('useSondages', () => {
  it('returns the active sondage and past sondages from the store', () => {
    const { result } = renderHook(() => useSondages());

    expect(result.current.active?.question).toBe('Composteur partagé ?');
    expect(result.current.passes).toHaveLength(1);
    expect(result.current.totalVotes).toBe(14);
  });

  it('vote increments the selected option and sets monVote', () => {
    const { result } = renderHook(() => useSondages());

    act(() => {
      result.current.vote('pour');
    });

    expect(result.current.active?.options.find((o) => o.id === 'pour')?.votes).toBe(11);
    expect(result.current.active?.monVote).toBe('pour');
    expect(result.current.totalVotes).toBe(15);
  });

  it('vote is modifiable: switching option moves the vote instead of blocking', () => {
    const { result } = renderHook(() => useSondages());

    act(() => {
      result.current.vote('pour');
    });
    act(() => {
      result.current.vote('contre');
    });

    expect(result.current.active?.options.find((o) => o.id === 'pour')?.votes).toBe(10);
    expect(result.current.active?.options.find((o) => o.id === 'contre')?.votes).toBe(5);
    expect(result.current.active?.monVote).toBe('contre');
    expect(result.current.totalVotes).toBe(15);
  });

  it('voting the same option twice does not double count', () => {
    const { result } = renderHook(() => useSondages());

    act(() => {
      result.current.vote('pour');
    });
    act(() => {
      result.current.vote('pour');
    });

    expect(result.current.active?.options.find((o) => o.id === 'pour')?.votes).toBe(11);
  });

  it('addComment appends a comment from the current user', () => {
    const { result } = renderHook(() => useSondages());

    act(() => {
      result.current.addComment('Bonne idée !');
    });

    expect(result.current.active?.comments).toHaveLength(1);
    expect(result.current.active?.comments[0]).toMatchObject({
      author: 'Valentin Lefevre',
      text: 'Bonne idée !',
    });
  });

  it('addComment ignores empty text', () => {
    const { result } = renderHook(() => useSondages());

    act(() => {
      result.current.addComment('   ');
    });

    expect(result.current.active?.comments).toHaveLength(0);
  });

  it('create replaces the active sondage', () => {
    const { result } = renderHook(() => useSondages());

    act(() => {
      result.current.create({
        question: 'Nouvelle question ?',
        contexte: 'Contexte',
        options: ['Oui', 'Non'],
        dureeJours: 3,
        portee: 'etage',
        anonyme: true,
        commentairesActifs: false,
      });
    });

    expect(result.current.active?.question).toBe('Nouvelle question ?');
    expect(result.current.active?.options).toHaveLength(2);
    expect(result.current.active?.options[0].votes).toBe(0);
    expect(result.current.active?.status).toBe('actif');
  });
});
