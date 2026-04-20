export interface MembreEquipeItem {
  id: number;
  nomComplet: string;
  role: string;
  specialite: string;
  nombreAffaires: number;
  email: string;
  telephone: string;
  statut: 'Actif' | 'Inactif';
  initiales: string;
}

export interface EquipeStats {
  totalMembres: number;
  totalAvocats: number;
  totalAffairesGerees: number;
  totalActifs: number;
}

export interface AffaireMiniItem {
  id: number;
  reference: string;
  titre: string;
  statut: string;
  priorite: string;
  dateEcheance?: string | null;
}

export interface TacheMiniItem {
  id: number;
  titre: string;
  dueDate?: string | null;
  priority?: string | null;
  completed: boolean;
}

export interface MembreProfil {
  id: number;
  nomComplet: string;
  role: string;
  specialite: string;
  email: string;
  telephone: string;
  statut: string;
  initiales: string;
  nombreAffaires: number;
  nombreTaches: number;
  nombreFactures: number;
  nombreRendezVous: number;
  affaires: AffaireMiniItem[];
  taches: TacheMiniItem[];
}

