export interface ProcurationItem {
  id: number;
  reference: string;
  clientId: number;
  client: string;
  type: string;
  status: 'Active' | 'En attente' | 'Expirée';
  createdDate: string;
  expiryDate: string;
  scope: string;
  signedBy: string;
}

export interface ProcurationStats {
  total: number;
  actives: number;
  enAttente: number;
  expirees: number;
}