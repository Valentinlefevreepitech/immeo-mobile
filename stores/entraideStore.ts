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
  type EntraideCategorie,
} from '@/fixtures/entraide';

export interface PublierAnnonceInput {
  titre: string;
  categorie: EntraideCategorie;
  duree: string;
  proprietaireNom?: string;
  proprietaireInitials?: string;
  proprietaireEtage?: string;
}

const CATEGORIE_ICONS: Record<EntraideCategorie, EntraideOffer['icon']> = {
  Bricolage: 'wrench',
  Cuisine: 'utensils',
  Services: 'hand-helping',
  Autres: 'package',
};

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
    const id = `annonce-${Date.now()}`;
    const nom = input.proprietaireNom ?? 'Vous';
    // Le type objet/service est deduit de la categorie (le tag suffit a
    // differencier, pas besoin d'un choix separe dans le formulaire).
    const type = input.categorie === 'Services' ? 'service' : 'objet';
    const newOffer: EntraideOffer = {
      id,
      type,
      titre: input.titre,
      categorie: input.categorie,
      icon: CATEGORIE_ICONS[input.categorie],
      proprietaire: {
        nom,
        initials: input.proprietaireInitials ?? nom.slice(0, 2).toUpperCase(),
        etage: input.proprietaireEtage ?? 'Vous',
      },
      condition: type === 'service' ? 'à organiser' : `prêt ${input.duree}`,
      ctaLabel: type === 'service' ? 'Je participe' : 'Demander',
      statut: 'disponible',
      demandeEnvoyee: false,
      description: `Proposé par ${nom}.`,
      conditions: [`Durée : ${input.duree}`],
      dejaReserve: [],
    };
    set({
      offers: [newOffer, ...get().offers],
      mesAnnonces: [...get().mesAnnonces, { id, titre: input.titre, statut: 'en_ligne' }],
    });
  },
}));
