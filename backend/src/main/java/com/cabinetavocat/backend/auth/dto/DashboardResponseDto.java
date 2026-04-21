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
public class DashboardResponseDto {
    private List<DashboardStatItemDto> stats;
    private List<RecentCaseDto> recentCases;
    private List<UpcomingAppointmentDto> upcomingAppointments;
    private List<MonthlyActivityDto> monthlyActivity;
    private List<RevenueDataDto> revenueData;
}