import { renderHook, act } from '@testing-library/react-native';
import { useEntraide } from '@/hooks/useEntraide';
import { useEntraideStore } from '@/stores/entraideStore';

jest.mock('@/fixtures/entraide', () => ({
  MOCK_OFFERS: [
    {
      id: 'tournevis',
      type: 'objet',
      titre: 'Tournevis électrique',
      categorie: 'Bricolage',
      icon: 'wrench',
      proprietaire: { nom: 'Sophie M.', initials: 'SM', etage: '3ème' },
      condition: 'prêt 48h',
      ctaLabel: 'Demander',
      statut: 'disponible',
      demandeEnvoyee: false,
      description: 'Test',
      conditions: [],
      dejaReserve: [],
    },
    {
      id: 'echelle',
      type: 'objet',
      titre: 'Échelle 2 m',
      categorie: 'Bricolage',
      icon: 'hammer',
      proprietaire: { nom: 'Karim B.', initials: 'KB', etage: '5ème' },
      condition: 'retour le 20 mars',
      ctaLabel: 'Demander',
      statut: 'emprunte',
      demandeEnvoyee: false,
      description: 'Test',
      conditions: [],
      dejaReserve: [],
    },
  ],
  MOCK_DEMANDES_RECUES: [
    {
      id: '1',
      demandeur: { nom: 'Karim B.', initials: 'KB', etage: '5ème', telephone: '06 00 00 00 00' },
      offerTitre: 'Tournevis électrique',
      dateLabel: 'Ce week-end',
      message: 'Salut !',
      statut: 'pending',
    },
  ],
  MOCK_MES_DEMANDES: [],
  MOCK_MES_ANNONCES: [{ id: '1', titre: 'Perceuse', statut: 'en_ligne' }],
}));

// Le store est un singleton partage entre tests : on le reset a chaque fois.
beforeEach(() => {
  useEntraideStore.setState(
    {
      offers: [
        {
          id: 'tournevis',
          type: 'objet',
          titre: 'Tournevis électrique',
          categorie: 'Bricolage',
          icon: 'wrench',
          proprietaire: { nom: 'Sophie M.', initials: 'SM', etage: '3ème' },
          condition: 'prêt 48h',
          ctaLabel: 'Demander',
          statut: 'disponible',
          demandeEnvoyee: false,
          description: 'Test',
          conditions: [],
          dejaReserve: [],
        },
      ],
      demandesRecues: [
        {
          id: '1',
          demandeur: {
            nom: 'Karim B.',
            initials: 'KB',
            etage: '5ème',
            telephone: '06 00 00 00 00',
          },
          offerTitre: 'Tournevis électrique',
          dateLabel: 'Ce week-end',
          message: 'Salut !',
          statut: 'pending',
        },
      ],
      mesDemandes: [],
      mesAnnonces: [{ id: '1', titre: 'Perceuse', statut: 'en_ligne' }],
    },
    false,
  );
});

describe('useEntraide', () => {
  it('returns offers, demandes and annonces from the store', () => {
    const { result } = renderHook(() => useEntraide());

    expect(result.current.offers).toHaveLength(1);
    expect(result.current.demandesRecues).toHaveLength(1);
    expect(result.current.mesAnnonces).toHaveLength(1);
  });

  it('demander marks the offer as demandeEnvoyee', () => {
    const { result } = renderHook(() => useEntraide());

    act(() => {
      result.current.demander('tournevis');
    });

    expect(result.current.offers.find((o) => o.id === 'tournevis')?.demandeEnvoyee).toBe(true);
  });

  it('accepterDemande sets the request status to accepted', () => {
    const { result } = renderHook(() => useEntraide());

    act(() => {
      result.current.accepterDemande('1');
    });

    expect(result.current.demandesRecues[0].statut).toBe('accepted');
  });

  it('refuserDemande sets the request status to refused', () => {
    const { result } = renderHook(() => useEntraide());

    act(() => {
      result.current.refuserDemande('1');
    });

    expect(result.current.demandesRecues[0].statut).toBe('refused');
  });

  it('publierAnnonce adds a new announcement', () => {
    const { result } = renderHook(() => useEntraide());

    act(() => {
      result.current.publierAnnonce({
        type: 'objet',
        titre: 'Nettoyeur haute pression',
        categorie: 'Bricolage',
        duree: '48h',
        visibleImmeuble: true,
      });
    });

    expect(result.current.mesAnnonces).toHaveLength(2);
    expect(result.current.mesAnnonces[1].titre).toBe('Nettoyeur haute pression');
    expect(result.current.mesAnnonces[1].statut).toBe('en_ligne');
  });
});
