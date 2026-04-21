package com.cabinetavocat.backend.service;

import com.cabinetavocat.backend.auth.dto.StatistiquesDashboardDto;

public interface StatistiquesService {
    StatistiquesDashboardDto getDashboardStatistics();
}