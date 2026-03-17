export interface Affaire {
  id?: number;
  titre: string;
  description?: string;
  statut: string;
  dateOuverture: string;
  clientId: number;
  clientNom?: string;
}