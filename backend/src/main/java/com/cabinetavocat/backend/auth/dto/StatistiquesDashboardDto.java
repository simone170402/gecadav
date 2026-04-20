package com.cabinetavocat.backend.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatistiquesDashboardDto {
    private StatistiquesKpiDto kpis;
    private List<MonthlyRevenueDto> monthlyRevenue;
    private List<CasesByTypeDto> casesByType;
    private List<ClientGrowthDto> clientGrowth;
    private PerformanceMetricsDto performance;
}
