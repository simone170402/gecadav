export interface StatistiquesKpi {
  revenusCeMois: string;
  nouvellesAffaires: number;
  nouveauxClients: number;
  tauxSucces: number;
}

export interface MonthlyRevenueItem {
  month: string;
  revenue: number;
}

export interface CasesByTypeItem {
  name: string;
  value: number;
}

export interface ClientGrowthItem {
  month: string;
  clients: number;
}

export interface PerformanceMetrics {
  tempsMoyenResolution: number;
  satisfactionClient: number;
  tauxFidelisation: number;
}

export interface StatistiquesDashboard {
  kpis: StatistiquesKpi;
  monthlyRevenue: MonthlyRevenueItem[];
  casesByType: CasesByTypeItem[];
  clientGrowth: ClientGrowthItem[];
  performance: PerformanceMetrics;
}