import { useEntraideStore } from '@/stores/entraideStore';

/**
 * Entraide entre voisins (Phase 6) : prets d'objets/services, sans
 * intervention du syndic. Wrapper fin autour du store partage.
 */
export function useEntraide() {
  const offers = useEntraideStore((s) => s.offers);
  const demandesRecues = useEntraideStore((s) => s.demandesRecues);
  const mesDemandes = useEntraideStore((s) => s.mesDemandes);
  const mesAnnonces = useEntraideStore((s) => s.mesAnnonces);
  const demander = useEntraideStore((s) => s.demander);
  const accepterDemande = useEntraideStore((s) => s.accepterDemande);
  const refuserDemande = useEntraideStore((s) => s.refuserDemande);
  const publierAnnonce = useEntraideStore((s) => s.publierAnnonce);

  return {
    offers,
    demandesRecues,
    mesDemandes,
    mesAnnonces,
    demander,
    accepterDemande,
    refuserDemande,
    publierAnnonce,
  };
}
