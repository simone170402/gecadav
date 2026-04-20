export interface ClientItem {
  id: number;
  reference: string;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string;
  telephone: string;
  adresse: string;
  type: 'Particulier' | 'Entreprise';
  entreprise?: string | null;
  statut: 'Actif' | 'Inactif';
  notes?: string | null;
  nombreAffaires: number;
  dernierContact?: string | null;
}

export interface ClientStats {
  totalClients: number;
  clientsActifs: number;
  entreprises: number;
  particuliers: number;
}