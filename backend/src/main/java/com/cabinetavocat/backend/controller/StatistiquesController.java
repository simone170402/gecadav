package com.cabinetavocat.backend.controller;

import com.cabinetavocat.backend.auth.dto.StatistiquesDashboardDto;
import com.cabinetavocat.backend.service.StatistiquesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistiques")
public class StatistiquesController {

    private final StatistiquesService statistiquesService;

    public StatistiquesController(StatistiquesService statistiquesService) {
        this.statistiquesService = statistiquesService;
    }

    @GetMapping("/dashboard")
    public StatistiquesDashboardDto getDashboardStatistics() {
        return statistiquesService.getDashboardStatistics();
    }
}