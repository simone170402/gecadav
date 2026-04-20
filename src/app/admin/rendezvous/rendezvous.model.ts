export interface RendezVousItem {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  client: string;
  clientId?: number | null;
  location: string;
  notes: string;
  status: string;
  affaireId?: number | null;
}