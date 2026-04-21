export interface AffaireItem {
  id: number;
  reference: string;
  titre: string;
  client: string;
  clientId: number;
  type: string;
  statut: 'En attente' | 'En cours' | 'Audience prévue' | 'Clôturée';
  priorite: 'high' | 'medium' | 'low';
  assigneA?: string;
  dateOuverture?: string | null;
  dateEcheance?: string | null;
  description?: string | null;
  progression: number;
  documentsCount?: number;
  rendezVousCount?: number;
}

export interface AffaireStats {
  totalAffaires: number;
  enCours: number;
  urgentes: number;
  cloturees: number;
}