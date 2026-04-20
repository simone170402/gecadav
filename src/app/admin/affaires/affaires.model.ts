export interface AffaireItem {
  id: number;
  reference: string;
  titre: string;
  description: string;
  client: string;
  clientId: number;
  type: string;
  statut: 'En cours' | 'Audience prévue' | 'En attente' | 'Clôturée';
  priorite: 'high' | 'medium' | 'low';
  assigneA: string;
  dateOuverture: string;
  dateEcheance: string | null;
  progression: number;
}

export interface AffaireStats {
  totalAffaires: number;
  enCours: number;
  urgentes: number;
  cloturees: number;
}