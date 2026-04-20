export interface FactureItem {
  id: number;
  reference: string;
  montant: number;
  montantFormate: string;
  statut: 'EN_ATTENTE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';
  dateEmission: string;
  dateEcheance: string | null;
  description?: string | null;
  modePaiement?: string | null;
  clientId: number;
  clientNomComplet: string;
  affaireId?: number | null;
  affaireReference?: string | null;
}

export interface FactureStats {
  revenusTotaux: string;
  facturesPayees: number;
  enAttente: number;
  enRetard: number;
}