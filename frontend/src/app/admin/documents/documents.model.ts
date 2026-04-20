export interface DocumentItem {
  id: number;
  nom: string;
  type: string;
  categorie: string;
  fichier: string;
  taille?: number | null;
  tailleFormatee: string;
  uploadedBy?: string | null;
  dateUpload?: string | null;
  client?: string | null;
  clientId?: number | null;
  affaireReference?: string | null;
  affaireId?: number | null;
}

export interface DocumentStats {
  totalDocuments: number;
  contrats: number;
  jugements: number;
  espaceUtilise: string;
}