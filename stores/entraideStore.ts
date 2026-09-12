import { create } from 'zustand';
import {
  MOCK_OFFERS,
  MOCK_DEMANDES_RECUES,
  MOCK_MES_DEMANDES,
  MOCK_MES_ANNONCES,
  type EntraideOffer,
  type DemandeRecue,
  type MaDemande,
  type MonAnnonce,
  type EntraideType,
  type EntraideCategorie,
} from '@/fixtures/entraide';

export interface PublierAnnonceInput {
  type: EntraideType;
  titre: string;
  categorie: EntraideCategorie;
  duree: string;
  visibleImmeuble: boolean;
}

interface EntraideState {
  offers: EntraideOffer[];
  demandesRecues: DemandeRecue[];
  mesDemandes: MaDemande[];
  mesAnnonces: MonAnnonce[];
  demander: (offerId: string) => void;
  accepterDemande: (id: string) => void;
  refuserDemande: (id: string) => void;
  publierAnnonce: (input: PublierAnnonceInput) => void;
}

/**
 * Etat partage de l'entraide (Phase 6) : offres de pret/service entre
 * voisins, demandes et annonces. Meme pattern que sondagesStore pour que
 * l'onglet Copro et les sous-ecrans restent coherents.
 */
export const useEntraideStore = create<EntraideState>((set, get) => ({
  offers: MOCK_OFFERS,
  demandesRecues: MOCK_DEMANDES_RECUES,
  mesDemandes: MOCK_MES_DEMANDES,
  mesAnnonces: MOCK_MES_ANNONCES,

  demander: (offerId) => {
    set({
      offers: get().offers.map((o) => (o.id === offerId ? { ...o, demandeEnvoyee: true } : o)),
    });
  },

  accepterDemande: (id) => {
    set({
      demandesRecues: get().demandesRecues.map((d) =>
        d.id === id ? { ...d, statut: 'accepted' } : d,
      ),
    });
  },

  refuserDemande: (id) => {
    set({
      demandesRecues: get().demandesRecues.map((d) =>
        d.id === id ? { ...d, statut: 'refused' } : d,
      ),
    });
  },

  publierAnnonce: (input) => {
    set({
      mesAnnonces: [
        ...get().mesAnnonces,
        { id: `annonce-${Date.now()}`, titre: input.titre, statut: 'en_ligne' },
      ],
    });
  },
}));
